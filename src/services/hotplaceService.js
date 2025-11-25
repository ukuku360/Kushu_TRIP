import googlePlacesService from '../utils/googlePlacesAPI.js';
import { ApiError } from '../utils/apiClient.js';
import databaseService from './databaseService.js';
import { hotplaceCache } from '../utils/localStorageCache.js';

class HotplaceService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5분
  }

  getCacheKey(cityId, placeType) {
    return `hotplaces_${cityId}_${placeType}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCitySearchTerms(cityId) {
    const cityTerms = {
      fukuoka: 'Fukuoka Hakata',
      kurume: 'Kurume',
      kumamoto: 'Kumamoto',
      nagasaki: 'Nagasaki',
      sasebo: 'Sasebo Nagasaki',
      oita: 'Oita Beppu',
      saga: 'Saga Karatsu'
    };
    
    return cityTerms[cityId] || cityId;
  }

  getPlaceSearchTerms(placeType) {
    const placeTerms = {
      ohori_park: 'Ohori Park',
      dazaifu: 'Dazaifu Tenmangu',
      canal_city: 'Canal City Hakata',
      inari_shrine: 'Inari Shrine',
      chikugo_river: 'Chikugo River',
      ishibashi_bunka: 'Ishibashi Cultural Center',
      kumamoto_castle: 'Kumamoto Castle',
      suizenji: 'Suizenji Garden',
      aso_shrine: 'Aso Shrine',
      glover_garden: 'Glover Garden',
      peace_park: 'Peace Park',
      dejima: 'Dejima',
      kujukushima: 'Kujukushima Islands',
      sasebo_navy: 'Sasebo Naval Base',
      huis_ten_bosch: 'Huis Ten Bosch',
      beppu_onsen: 'Beppu Onsen',
      yufuin: 'Yufuin',
      usuki: 'Usuki Stone Buddhas',
      yoshinogari: 'Yoshinogari Historical Park',
      arita: 'Arita Porcelain Park',
      karatsu: 'Karatsu Castle'
    };
    
    return placeTerms[placeType] || placeType;
  }

  async searchHotplaces(cityId, placeType, options = {}) {
    if (!cityId || !placeType) {
      throw new ApiError('도시와 장소 종류를 모두 입력해주세요.', 400);
    }

    // 1. 데이터베이스에서 먼저 확인
    try {
      const dbData = await databaseService.getHotplaces(cityId, placeType);
      if (dbData) {
        console.log('✅ 데이터베이스에서 핫플레이스 데이터 반환:', `${cityId}-${placeType}`);
        return dbData;
      }
    } catch (error) {
      console.warn('데이터베이스 조회 실패, 캐시로 계속:', error.message);
    }

    // 2. localStorage 백업 캐시 확인
    const localStorageKey = hotplaceCache.generateKey('search', { cityId, placeType });
    const localStorageData = hotplaceCache.get(localStorageKey);
    if (localStorageData) {
      console.log('✅ localStorage 백업 캐시에서 핫플레이스 데이터 반환:', localStorageKey);
      // 메모리 캐시에도 복사해서 다음 요청 속도 향상
      const memoryCacheKey = this.getCacheKey(cityId, placeType);
      this.setCache(memoryCacheKey, localStorageData);
      return localStorageData;
    }

    // 3. 메모리 캐시 확인 (마지막 백업)
    const cacheKey = this.getCacheKey(cityId, placeType);
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) {
      console.log('✅ 메모리 캐시에서 데이터 반환:', cacheKey);
      return cachedData;
    }

    // 3. Google Places API 호출
    try {
      console.log(`🔍 실제 Google Places API로 핫플레이스 검색: ${cityId} ${placeType}`);
      
      const cityTerm = this.getCitySearchTerms(cityId);
      const placeTerm = this.getPlaceSearchTerms(placeType);
      // "restaurant" 키워드 제거하고 "tourist attraction" 추가
      const query = `${placeTerm}`;
      
      // searchPlaces 사용 (type: 'tourist_attraction' 지정)
      const hotplaces = await googlePlacesService.searchPlaces(query, { 
        location: cityTerm,
        type: 'tourist_attraction'
      });
      
      if (!hotplaces || hotplaces.length === 0) {
        throw new ApiError('검색 결과를 찾을 수 없습니다. API 키를 확인해주세요.', 404);
      }

      console.log(`✅ 실제 API 핫플레이스 검색 완료: ${hotplaces.length}개`);

      // 4. 다중 캐시 저장 (병렬)
      const savePromises = [
        // 데이터베이스 저장
        databaseService.saveHotplaces(cityId, placeType, hotplaces).catch(error => {
          console.warn('핫플레이스 데이터베이스 저장 실패:', error.message);
        }),
        
        // localStorage 백업 캐시 저장
        Promise.resolve().then(() => {
          hotplaceCache.set(localStorageKey, hotplaces);
        }).catch(error => {
          console.warn('핫플레이스 localStorage 저장 실패:', error.message);
        })
      ];
      
      // 병렬 저장 실행 (결과를 기다리지 않음)
      Promise.all(savePromises);

      // 5. 메모리 캐시에도 저장 (즉시)
      this.setCache(cacheKey, hotplaces);
      return hotplaces;
      
    } catch (error) {
      console.error('Google Places API 핫플레이스 검색 실패:', error);
      
      if (error.message.includes('키') || error.message.includes('API')) {
        throw new ApiError('Google Places API 키를 설정해주세요. .env 파일에 VITE_GOOGLE_PLACES_API_KEY를 추가하세요.', 401);
      }
      
      throw new ApiError('핫플레이스 정보를 가져올 수 없습니다. 네트워크 연결을 확인해주세요.', 500, error.message);
    }
  }

  async getHotplaceDetails(placeId) {
    try {
      const details = await googlePlacesService.getPlaceDetails(placeId);
      return details;
    } catch (error) {
      console.error('핫플레이스 상세 정보 조회 실패:', error);
      throw new ApiError('핫플레이스 상세 정보 조회 실패', 500, error.message);
    }
  }

  generateGoogleMapsUrl(hotplace, cityName) {
    if (hotplace.place_id && !hotplace.place_id.startsWith('mock_')) {
      return `https://www.google.com/maps/place/?q=place_id:${hotplace.place_id}`;
    }
    
    const query = encodeURIComponent(`${hotplace.name} ${hotplace.address} ${cityName} Japan`);
    return `https://www.google.com/maps/search/${query}`;
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

const hotplaceService = new HotplaceService();

export default hotplaceService;
export { HotplaceService }; 