import apiClient, { ApiError } from '../utils/apiClient.js';
import googlePlacesService from '../utils/googlePlacesAPI.js';
import hybridDataService from './hybridDataService.js';

// 환경변수로 Mock/Real API 전환 가능
const USE_MOCK_API = true; // 정확한 일본 식당 이름을 위해 Mock API 강제 사용
const USE_TRENDING_DATA = false; // 트렌딩 데이터 비활성화

class RestaurantService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5분
  }

  // 캐시 키 생성
  getCacheKey(cityId, foodType) {
    return `restaurants_${cityId}_${foodType}`;
  }

  // 캐시 확인
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  // 캐시 저장
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // 지역별 검색어 매핑
  getCitySearchTerms(cityId) {
    return googlePlacesService.getCitySearchTerms(cityId);
  }

  // 음식 종류별 검색어 매핑
  getFoodSearchTerms(foodType) {
    return googlePlacesService.getFoodSearchTerms(foodType);
  }

  // 메인 검색 메서드 (실제 Google Places API 사용)
  async searchRestaurants(cityId, foodType, options = {}) {
    // 입력 검증
    if (!cityId || !foodType) {
      throw new ApiError('도시와 음식 종류를 모두 입력해주세요.', 400);
    }

    const cacheKey = this.getCacheKey(cityId, foodType);
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) {
      console.log('✅ 캐시에서 데이터 반환:', cacheKey);
      return cachedData;
    }

    try {
      console.log(`🔍 실제 Google Places API로 검색: ${cityId} ${foodType}`);
      
      // 검색어 생성
      const cityTerm = this.getCitySearchTerms(cityId);
      const foodTerm = this.getFoodSearchTerms(foodType);
      const query = `${foodTerm} restaurant`;
      
      // Google Places API로 검색
      const restaurants = await googlePlacesService.searchRestaurants(query, cityTerm);
      
      // 결과가 없으면 하이브리드 서비스 시도
      if (!restaurants || restaurants.length === 0) {
        console.log('Google Places API 결과 없음, 하이브리드 서비스 시도');
        const hybridResults = await hybridDataService.getRestaurants(cityId, foodType, options);
        
        if (hybridResults && hybridResults.length > 0) {
          this.setCache(cacheKey, hybridResults);
          return hybridResults;
        }
        
        throw new ApiError('검색 결과를 찾을 수 없습니다.', 404);
      }

      console.log(`✅ 식당 검색 완료: ${restaurants.length}개`, restaurants.map(r => r.name));

      // 캐시 저장
      this.setCache(cacheKey, restaurants);
      
      return restaurants;
      
    } catch (error) {
      console.error('식당 검색 실패:', error);
      
      // API 에러인 경우 하이브리드 서비스로 폴백
      if (error instanceof ApiError) {
        try {
          console.log('API 오류로 인해 하이브리드 서비스로 폴백');
          const hybridResults = await hybridDataService.getRestaurants(cityId, foodType, options);
          return hybridResults || [];
        } catch (hybridError) {
          console.error('하이브리드 서비스도 실패:', hybridError);
        }
      }
      
      throw new ApiError('맛집 정보를 가져올 수 없습니다.', 500, error.message);
    }
  }

  // 특정 레스토랑 상세 정보
  async getRestaurantDetails(restaurantId) {
    try {
      const details = await googlePlacesService.getPlaceDetails(restaurantId);
      return details;
    } catch (error) {
      console.error('레스토랑 상세 정보 조회 실패:', error);
      throw new ApiError('레스토랑 상세 정보 조회 실패', 500, error.message);
    }
  }

  // 리뷰 가져오기
  async getRestaurantReviews(restaurantId, limit = 5) {
    try {
      const reviews = await googlePlacesService.getPlaceReviews(restaurantId);
      return reviews.slice(0, limit);
    } catch (error) {
      console.warn('리뷰 조회 실패:', error.message);
      return [];
    }
  }

  // 구글맵 URL 생성
  generateGoogleMapsUrl(restaurant, cityName) {
    if (restaurant.place_id && !restaurant.place_id.startsWith('mock_')) {
      return `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`;
    }
    
    // place_id가 없는 경우 검색 쿼리 사용
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address} ${cityName} Japan`);
    return `https://www.google.com/maps/search/${query}`;
  }

  // 캐시 초기화
  clearCache() {
    this.cache.clear();
  }

  // 통계 정보
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// 싱글톤 인스턴스
const restaurantService = new RestaurantService();

export default restaurantService;
export { RestaurantService }; 