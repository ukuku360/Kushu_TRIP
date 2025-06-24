import trendingDataService from './trendingDataService.js';
import dataUpdateScheduler from './dataUpdateScheduler.js';
import googlePlacesAPI from '../utils/googlePlacesAPI.js';
import { ApiError } from '../utils/apiClient.js';

class HybridDataService {
  constructor() {
    console.log('🔄 하이브리드 데이터 서비스 초기화 - Mock API 제거됨');
  }

  async initialize() {
    if (this.initialized) return;
    
    console.log('🚀 하이브리드 데이터 서비스 초기화');
    await dataUpdateScheduler.initialize();
    this.initialized = true;
  }

  async getRestaurants(cityId, foodType, options = {}) {
    try {
      console.log(`🔥 트렌딩 데이터로 ${cityId} ${foodType} 맛집 검색`);
      
      // 1. 트렌딩 데이터 우선 시도
      try {
        const trendingData = await trendingDataService.getFoodTrends(cityId);
        
        if (trendingData && trendingData.length > 0) {
          // 음식 종류와 매칭되는 트렌딩 데이터 필터링
          const relevantTrends = trendingData.filter(trend => 
            trend.keyword.toLowerCase().includes(foodType.toLowerCase()) ||
            trend.searchQuery.toLowerCase().includes(foodType.toLowerCase())
          );
          
          if (relevantTrends.length > 0) {
            console.log(`✅ 트렌딩 데이터 기반 ${relevantTrends.length}개 맛집 반환`);
            return this.convertTrendingToRestaurants(relevantTrends, cityId);
          }
        }
      } catch (trendingError) {
        console.warn('트렌딩 데이터 조회 실패:', trendingError.message);
      }

      // 2. 트렌딩 데이터가 없으면 빈 결과 반환
      console.log('❌ 트렌딩 데이터 없음 - 빈 결과 반환');
      return [];
      
    } catch (error) {
      console.error('하이브리드 맛집 검색 실패:', error);
      return [];
    }
  }

  async getHotplaces(cityId, placeType, options = {}) {
    try {
      console.log(`🔥 트렌딩 데이터로 ${cityId} ${placeType} 핫플레이스 검색`);
      
      // 트렌딩 데이터 조회
      const trendingData = await trendingDataService.getHotplaceTrends(cityId);
      
      if (trendingData && trendingData.length > 0) {
        // 장소 종류와 매칭되는 트렌딩 데이터 필터링
        const relevantTrends = trendingData.filter(trend => 
          trend.keyword.toLowerCase().includes(placeType.toLowerCase()) ||
          trend.searchQuery.toLowerCase().includes(placeType.toLowerCase())
        );
        
        if (relevantTrends.length > 0) {
          console.log(`✅ 트렌딩 데이터 기반 ${relevantTrends.length}개 핫플레이스 반환`);
          return this.convertTrendingToHotplaces(relevantTrends, cityId);
        }
      }

      console.log('❌ 트렌딩 데이터 없음 - 빈 결과 반환');
      return [];
      
    } catch (error) {
      console.error('하이브리드 핫플레이스 검색 실패:', error);
      return [];
    }
  }

  formatData(data, source) {
    return data.map(item => ({
      ...item,
      source: source,
      isTrending: source === 'trending' || source === 'google_places',
      isRealTime: source === 'google_places',
      lastUpdated: (source === 'trending' || source === 'google_places') ? new Date().toISOString() : null
    }));
  }

  // 도시 ID를 한국어 이름으로 변환
  getCityName(cityId) {
    const cityNames = {
      fukuoka: '후쿠오카',
      kurume: '쿠루메',
      kumamoto: '구마모토',
      nagasaki: '나가사키',
      sasebo: '사세보',
      oita: '오이타',
      saga: '사가'
    };
    return cityNames[cityId] || cityId;
  }

  // 음식 타입을 한국어 이름으로 변환
  getFoodName(foodType) {
    const foodNames = {
      ramen: '라멘',
      mentaiko: '명란젓',
      motsunabe: '모츠나베',
      yakitori: '야키토리',
      udon: '우동',
      basashi: '바사시',
      tonkotsu: '돈코츠라멘',
      karashi: '카라시연근',
      champon: '짬뽕',
      sara_udon: '사라우동',
      kasutera: '카스테라',
      burger: '사세보버거',
      kujira: '고래고기',
      oyster: '굴',
      bungo_beef: '분고규',
      jigoku_mushi: '지옥찜',
      dango: '단고',
      saga_beef: '사가규',
      yobuko_squid: '요부코오징어',
      gagyudon: '가규동'
    };
    return foodNames[foodType] || foodType;
  }

  // 핫플레이스 타입을 한국어 이름으로 변환
  getPlaceName(placeType) {
    const placeNames = {
      ohori_park: '오호리공원',
      dazaifu: '다자이후',
      canal_city: '캐널시티',
      inari_shrine: '이나리신사',
      chikugo_river: '치쿠고강',
      ishibashi_bunka: '이시바시문화센터',
      kumamoto_castle: '구마모토성',
      suizenji: '스이젠지공원',
      aso_shrine: '아소신사',
      glover_garden: '글로버가든',
      peace_park: '평화공원',
      dejima: '데지마',
      kujukushima: '구주쿠시마',
      sasebo_navy: '사세보군항',
      huis_ten_bosch: '하우스텐보스',
      beppu_onsen: '별부온천',
      yufuin: '유후인',
      usuki: '우스키석불',
      yoshinogari: '요시노가리유적',
      arita: '아리타도자기마을',
      karatsu: '가라츠성'
    };
    return placeNames[placeType] || placeType;
  }

  async updateInBackground(type, cityId, category) {
    // 이미 업데이트 중이면 스킵
    if (dataUpdateScheduler.isUpdating) {
      return;
    }

    try {
      console.log(`🔄 백그라운드 업데이트 시작: ${type} ${cityId}/${category}`);
      await dataUpdateScheduler.updateSpecificData(type, cityId, category);
    } catch (error) {
      console.warn('백그라운드 업데이트 실패:', error.message);
      // 실패해도 조용히 넘어감 (사용자 경험에 영향 없음)
    }
  }

  // 즉시 새로운 트렌딩 데이터 가져오기 (사용자가 새로고침 버튼을 눌렀을 때)
  async refreshTrendingData(type, cityId, category) {
    try {
      console.log(`🔄 즉시 업데이트: ${type} ${cityId}/${category}`);
      
      let data;
      if (type === 'restaurants') {
        data = await trendingDataService.fetchTrendingRestaurants(cityId, category);
      } else if (type === 'hotplaces') {
        data = await trendingDataService.fetchTrendingHotplaces(cityId, category);
      }
      
      if (data && data.length > 0) {
        const cacheKey = trendingDataService.getCacheKey(type, cityId, category);
        trendingDataService.setCache(cacheKey, data);
        return this.formatData(data, 'trending');
      }
      
      throw new Error('새로운 트렌딩 데이터를 찾을 수 없습니다.');
      
    } catch (error) {
      console.error('즉시 업데이트 실패:', error);
      throw new ApiError('최신 데이터를 가져올 수 없습니다.', 500);
    }
  }

  // 데이터 소스 정보 조회
  getDataSourceInfo(cityId, category, type = 'restaurants') {
    const cacheKey = trendingDataService.getCacheKey(type, cityId, category);
    const cached = trendingDataService.getFromCache(cacheKey);
    
    return {
      hasCache: !!cached,
      cacheAge: cached ? Date.now() - cached.timestamp : null,
      dataCount: cached ? cached.length : 0,
      source: cached ? 'trending' : 'static',
      lastUpdate: dataUpdateScheduler.getLastUpdateTime(),
      updateStatus: dataUpdateScheduler.getUpdateStatus()
    };
  }

  // 모든 도시/카테고리의 데이터 상태 확인
  getAllDataStatus() {
    const status = {};
    
    // 맛집 데이터 상태
    status.restaurants = {};
    const cities = ['fukuoka', 'kurume', 'kumamoto', 'nagasaki', 'sasebo', 'oita'];
    const foodTypes = {
      fukuoka: ['ramen', 'mentaiko', 'motsunabe'],
      kurume: ['yakitori', 'ramen', 'udon'],
      kumamoto: ['basashi', 'tonkotsu', 'karashi'],
      nagasaki: ['champon', 'sara_udon', 'kasutera'],
      sasebo: ['burger', 'kujira', 'oyster'],
      oita: ['bungo_beef', 'jigoku_mushi', 'dango']
    };
    
    cities.forEach(city => {
      status.restaurants[city] = {};
      foodTypes[city]?.forEach(food => {
        status.restaurants[city][food] = this.getDataSourceInfo(city, food, 'restaurants');
      });
    });

    // 핫플레이스 데이터 상태
    status.hotplaces = {};
    const hotplaceTypes = {
      fukuoka: ['ohori_park', 'dazaifu', 'canal_city'],
      kurume: ['inari_shrine', 'chikugo_river', 'ishibashi_bunka'],
      kumamoto: ['kumamoto_castle', 'suizenji', 'aso_shrine'],
      nagasaki: ['glover_garden', 'peace_park', 'dejima'],
      sasebo: ['kujukushima', 'sasebo_navy', 'huis_ten_bosch'],
      oita: ['beppu_onsen', 'yufuin', 'usuki']
    };
    
    cities.forEach(city => {
      status.hotplaces[city] = {};
      hotplaceTypes[city]?.forEach(place => {
        status.hotplaces[city][place] = this.getDataSourceInfo(city, place, 'hotplaces');
      });
    });

    return {
      ...status,
      global: dataUpdateScheduler.getUpdateStatus()
    };
  }

  // 개발자용 유틸리티
  async forceBulkUpdate() {
    console.log('🔧 전체 강제 업데이트 시작');
    return await dataUpdateScheduler.forceUpdate();
  }

  clearAllCache() {
    dataUpdateScheduler.clearAllCache();
  }

  // 특정 API 키 설정 (환경변수가 없을 때)
  setApiKey(key) {
    trendingDataService.searchApiKey = key;
  }

  // 트렌딩 데이터를 레스토랑 형식으로 변환
  convertTrendingToRestaurants(trends, cityId) {
    return trends.slice(0, 5).map((trend, index) => ({
      name: trend.keyword,
      rating: 4.0 + (trend.score || 0.5),
      specialty: trend.searchQuery || trend.keyword,
      address: this.getCityAddress(cityId),
      place_id: `trending_restaurant_${cityId}_${index}`,
      user_ratings_total: Math.floor((trend.score || 0.5) * 200) + 100,
      source: 'trending_data',
      trending_score: trend.score,
      search_volume: trend.searchVolume || 0,
      coordinates: this.getCityCoordinates(cityId)
    }));
  }

  // 트렌딩 데이터를 핫플레이스 형식으로 변환
  convertTrendingToHotplaces(trends, cityId) {
    return trends.slice(0, 5).map((trend, index) => ({
      name: trend.keyword,
      rating: 4.0 + (trend.score || 0.5),
      specialty: trend.searchQuery || trend.keyword,
      address: this.getCityAddress(cityId),
      place_id: `trending_hotplace_${cityId}_${index}`,
      user_ratings_total: Math.floor((trend.score || 0.5) * 300) + 150,
      source: 'trending_data',
      trending_score: trend.score,
      search_volume: trend.searchVolume || 0,
      coordinates: this.getCityCoordinates(cityId)
    }));
  }

  // 도시별 주소 매핑
  getCityAddress(cityId) {
    const addresses = {
      fukuoka: 'Fukuoka, Japan',
      kumamoto: 'Kumamoto, Japan', 
      nagasaki: 'Nagasaki, Japan',
      sasebo: 'Sasebo, Nagasaki, Japan',
      oita: 'Oita, Japan',
      saga: 'Saga, Japan'
    };
    return addresses[cityId] || `${cityId}, Japan`;
  }

  // 도시별 좌표 매핑
  getCityCoordinates(cityId) {
    const coordinates = {
      fukuoka: { lat: 33.5904, lng: 130.4017 },
      kumamoto: { lat: 32.8031, lng: 130.7079 },
      nagasaki: { lat: 32.7503, lng: 129.8779 },
      sasebo: { lat: 33.1597, lng: 129.7233 },
      oita: { lat: 33.2382, lng: 131.6126 },
      saga: { lat: 33.2494, lng: 130.2989 }
    };
    return coordinates[cityId] || null;
  }

  // 서비스 상태 확인
  async getServiceStatus() {
    try {
      const trendingStatus = await trendingDataService.checkServiceStatus();
      
      return {
        service: 'hybrid',
        trending_service: trendingStatus,
        timestamp: new Date().toISOString(),
        status: 'operational'
      };
    } catch (error) {
      return {
        service: 'hybrid',
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

const hybridDataService = new HybridDataService();

export default hybridDataService; 