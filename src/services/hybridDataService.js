import googlePlacesService from '../utils/googlePlacesAPI.js';

class HybridDataService {
  constructor() {
    this.dataVersion = '1.0.3';
    this.lastUpdate = new Date().toISOString();
  }

  // 실제 식당 데이터 가져오기 (Google Places API만 사용)
  async getRestaurants(cityId, foodType, options = {}) {
    try {
      console.log(`🔍 Google Places API로 ${cityId} ${foodType} 맛집 검색`);
      
      const cityTerm = this.getCitySearchTerms(cityId);
      const foodTerm = this.getFoodSearchTerms(foodType);
      const query = `${foodTerm} restaurant`;
      
      const restaurants = await googlePlacesService.searchRestaurants(query, cityTerm);
      
      if (!restaurants || restaurants.length === 0) {
        throw new Error('검색 결과가 없습니다');
      }
      
      console.log(`✅ Google Places API 데이터 ${restaurants.length}개 반환`);
      return restaurants;
      
    } catch (error) {
      console.error('Google Places API 식당 검색 실패:', error);
      throw error;
    }
  }

  async getHotplaces(cityId, placeType, options = {}) {
    try {
      console.log(`🔍 Google Places API로 ${cityId} ${placeType} 핫플레이스 검색`);
      
      const cityTerm = this.getCitySearchTerms(cityId);
      const placeTerm = this.getPlaceSearchTerms(placeType);
      const query = `${placeTerm} tourist attraction`;
      
      const hotplaces = await googlePlacesService.searchRestaurants(query, cityTerm);
      
      if (!hotplaces || hotplaces.length === 0) {
        throw new Error('검색 결과가 없습니다');
      }
      
      console.log(`✅ Google Places API 핫플레이스 데이터 ${hotplaces.length}개 반환`);
      return hotplaces;
      
    } catch (error) {
      console.error('Google Places API 핫플레이스 검색 실패:', error);
      throw error;
    }
  }

  // 지역별 검색어 매핑
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

  // 음식 종류별 검색어 매핑
  getFoodSearchTerms(foodType) {
    const foodTerms = {
      ramen: 'ramen tonkotsu',
      sushi: 'sushi sashimi',
      yakitori: 'yakitori grilled chicken',
      tempura: 'tempura fried',
      udon: 'udon noodles',
      soba: 'soba buckwheat noodles',
      takoyaki: 'takoyaki octopus balls',
      okonomiyaki: 'okonomiyaki pancake',
      yakiniku: 'yakiniku korean bbq',
      kaiseki: 'kaiseki traditional japanese',
      tonkatsu: 'tonkatsu pork cutlet',
      curry: 'japanese curry'
    };
    
    return foodTerms[foodType] || foodType;
  }

  // 장소 종류별 검색어 매핑
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

  // 서비스 정보
  getServiceInfo() {
    return {
      dataVersion: this.dataVersion,
      lastUpdate: this.lastUpdate,
      status: 'active',
      source: 'Google Places API only'
    };
  }
}

// 싱글톤 인스턴스
const hybridDataService = new HybridDataService();

export default hybridDataService; 