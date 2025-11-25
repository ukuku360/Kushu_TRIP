import apiClient, { ApiError } from '../utils/apiClient.js';
import googlePlacesService from '../utils/googlePlacesAPI.js';
import databaseService from './databaseService.js';
import { restaurantCache } from '../utils/localStorageCache.js';

// 실제 API만 사용 - Mock 데이터 완전 제거
const FORCE_REAL_API = true;

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

  // 메인 검색 메서드 (다중 캐시 전략: DB → localStorage → 메모리 → API)
  async searchRestaurants(cityId, foodType, options = {}) {
    // 입력 검증
    if (!cityId || !foodType) {
      throw new ApiError('도시와 음식 종류를 모두 입력해주세요.', 400);
    }

    // 1. 데이터베이스에서 먼저 확인
    try {
      const dbData = await databaseService.getRestaurants(cityId, foodType);
      if (dbData) {
        console.log('✅ 데이터베이스에서 데이터 반환:', `${cityId}-${foodType}`);
        // 구글맵 리뷰 기준 TOP 5만 반환
        return this.getTopRestaurantsByRating(dbData, 5);
      }
    } catch (error) {
      console.warn('데이터베이스 조회 실패, 캐시로 계속:', error.message);
    }

    // 2. localStorage 백업 캐시 확인
    const localStorageKey = restaurantCache.generateKey('search', { cityId, foodType });
    const localStorageData = restaurantCache.get(localStorageKey);
    if (localStorageData) {
      console.log('✅ localStorage 백업 캐시에서 데이터 반환:', localStorageKey);
      // 메모리 캐시에도 복사해서 다음 요청 속도 향상
      const memoryCacheKey = this.getCacheKey(cityId, foodType);
      const topRestaurants = this.getTopRestaurantsByRating(localStorageData, 5);
      this.setCache(memoryCacheKey, topRestaurants);
      return topRestaurants;
    }

    // 3. 메모리 캐시 확인 (마지막 백업)
    const cacheKey = this.getCacheKey(cityId, foodType);
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) {
      console.log('✅ 메모리 캐시에서 데이터 반환:', cacheKey);
      return cachedData;
    }

    // 4. Google Places API 호출
    try {
      console.log(`🔍 실제 Google Places API로 검색: ${cityId} ${foodType}`);
      
      // 검색어 생성
      const cityTerm = this.getCitySearchTerms(cityId);
      const foodTerm = this.getFoodSearchTerms(foodType);
      const query = `${foodTerm} restaurant`;
      
      // Google Places API로 검색
      const restaurants = await googlePlacesService.searchRestaurants(query, cityTerm);
      
      if (!restaurants || restaurants.length === 0) {
        throw new ApiError('검색 결과를 찾을 수 없습니다. API 키를 확인해주세요.', 404);
      }

      // 구글맵 리뷰 기준으로 TOP 5 선별
      const topRestaurants = this.getTopRestaurantsByRating(restaurants, 5);
      
      console.log(`✅ 실제 API 검색 완료: TOP ${topRestaurants.length}개 (구글맵 리뷰 기준)`, topRestaurants.map(r => r.name));

      // 5. 다중 캐시 저장 (병렬)
      const savePromises = [
        // 데이터베이스 저장 (전체 결과 저장하되 반환은 TOP 5)
        databaseService.saveRestaurants(cityId, foodType, topRestaurants).catch(error => {
          console.warn('데이터베이스 저장 실패:', error.message);
        }),
        
        // localStorage 백업 캐시 저장
        Promise.resolve().then(() => {
          restaurantCache.set(localStorageKey, topRestaurants);
        }).catch(error => {
          console.warn('localStorage 저장 실패:', error.message);
        })
      ];
      
      // 병렬 저장 실행 (결과를 기다리지 않음)
      Promise.all(savePromises);

      // 6. 메모리 캐시에도 저장 (즉시)
      this.setCache(cacheKey, topRestaurants);
      
      return topRestaurants;
      
    } catch (error) {
      console.error('Google Places API 검색 실패:', error);
      
      // API 키가 없거나 오류인 경우 명확한 에러 메시지
      if (error.message.includes('키') || error.message.includes('API')) {
        throw new ApiError('Google Places API 키를 설정해주세요. .env 파일에 VITE_GOOGLE_PLACES_API_KEY를 추가하세요.', 401);
      }
      
      throw new ApiError('맛집 정보를 가져올 수 없습니다. 네트워크 연결을 확인해주세요.', 500, error.message);
    }
  }

  // 구글맵 리뷰 기준으로 상위 N개 레스토랑 필터링
  getTopRestaurantsByRating(restaurants, limit = 5) {
    if (!restaurants || restaurants.length === 0) {
      return [];
    }

    // 유효한 평점과 리뷰가 있는 레스토랑만 필터링
    const validRestaurants = restaurants
      .filter(restaurant => {
        return restaurant && 
               restaurant.rating && 
               restaurant.rating > 0 && 
               restaurant.user_ratings_total && 
               restaurant.user_ratings_total > 0;
      })
      .sort((a, b) => {
        // 1차 정렬: 평점 높은 순
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        // 2차 정렬: 리뷰 수 많은 순
        return b.user_ratings_total - a.user_ratings_total;
      })
      .slice(0, limit); // 상위 N개만 선택

    console.log(`✅ 구글맵 리뷰 기준 TOP ${validRestaurants.length}개 레스토랑 선별 완료`);
    
    // 각 레스토랑의 순위 정보 추가
    const rankedRestaurants = validRestaurants.map((restaurant, index) => ({
      ...restaurant,
      rank: index + 1,
      rankInfo: `TOP ${index + 1} (${restaurant.rating}⭐ • ${restaurant.user_ratings_total}개 리뷰)`
    }));

    return rankedRestaurants;
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