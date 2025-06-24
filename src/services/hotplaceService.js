import apiClient, { ApiError } from '../utils/apiClient.js';
import googlePlacesService from '../utils/googlePlacesAPI.js';
import hybridDataService from './hybridDataService.js';

const USE_MOCK_API = true; // 정확한 일본 핫플레이스 이름을 위해 Mock API 강제 사용
const USE_TRENDING_DATA = false; // 트렌딩 데이터 비활성화

class HotplaceService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 10 * 60 * 1000; // 10분
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
    return googlePlacesService.getCitySearchTerms(cityId);
  }

  getPlaceSearchTerms(placeType) {
    const placeTerms = {
      shrine: 'shrine temple',
      temple: 'temple shrine',
      park: 'park garden',
      museum: 'museum',
      castle: 'castle historical site',
      observation: 'observation deck viewpoint',
      shopping: 'shopping mall department store',
      hotspring: 'hot spring onsen',
      beach: 'beach coast',
      mountain: 'mountain hiking trail'
    };
    
    return placeTerms[placeType] || placeType;
  }

  async searchHotplaces(cityId, placeType, options = {}) {
    if (!cityId || !placeType) {
      throw new ApiError('도시와 장소 종류를 모두 입력해주세요.', 400);
    }

    const cacheKey = this.getCacheKey(cityId, placeType);
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) {
      console.log('✅ 캐시에서 데이터 반환:', cacheKey);
      return cachedData;
    }

    try {
      console.log(`🔍 실제 Google Places API로 핫플레이스 검색: ${cityId} ${placeType}`);
      
      const cityTerm = this.getCitySearchTerms(cityId);
      const placeTerm = this.getPlaceSearchTerms(placeType);
      const query = `${placeTerm} tourist attraction`;
      
      const hotplaces = await googlePlacesService.searchRestaurants(query, cityTerm);
      
      if (!hotplaces || hotplaces.length === 0) {
        console.log('Google Places API 결과 없음, 하이브리드 서비스 시도');
        const hybridResults = await hybridDataService.getHotplaces(cityId, placeType, options);
        
        if (hybridResults && hybridResults.length > 0) {
          this.setCache(cacheKey, hybridResults);
          return hybridResults;
        }
        
        throw new ApiError('검색 결과를 찾을 수 없습니다.', 404);
      }

      console.log(`✅ 핫플레이스 검색 완료: ${hotplaces.length}개`, hotplaces.map(h => h.name));

      this.setCache(cacheKey, hotplaces);
      
      return hotplaces;
      
    } catch (error) {
      console.error('핫플레이스 검색 실패:', error);
      
      if (error instanceof ApiError) {
        try {
          console.log('API 오류로 인해 하이브리드 서비스로 폴백');
          const hybridResults = await hybridDataService.getHotplaces(cityId, placeType, options);
          return hybridResults || [];
        } catch (hybridError) {
          console.error('하이브리드 서비스도 실패:', hybridError);
        }
      }
      
      throw new ApiError('핫플레이스 정보를 가져올 수 없습니다.', 500, error.message);
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