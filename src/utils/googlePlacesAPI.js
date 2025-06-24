import apiUsageTracker from '../services/apiUsageTracker.js';
import apiClient from './apiClient.js'

// Google Places API 설정
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 'YOUR_API_KEY_HERE';

// 일본 규슈의 각 도시 좌표
const CITY_COORDINATES = {
  fukuoka: { lat: 33.5904, lng: 130.4017 },
  kurume: { lat: 33.3192, lng: 130.5081 },
  kumamoto: { lat: 32.8031, lng: 130.7081 },
  nagasaki: { lat: 32.7503, lng: 129.8779 },
  sasebo: { lat: 33.1597, lng: 129.7214 },
  oita: { lat: 33.2382, lng: 131.6126 },
  saga: { lat: 33.2635, lng: 130.3000 }
};

// 음식 타입을 일본어/영어 검색어로 매핑
const FOOD_SEARCH_TERMS = {
  ramen: ['라멘', 'ラーメン', 'ramen'],
  mentaiko: ['명란젓', '明太子', 'mentaiko'],
  motsunabe: ['모츠나베', 'もつ鍋', 'motsunabe'],
  yakitori: ['야키토리', '焼き鳥', 'yakitori'],
  udon: ['우동', 'うどん', 'udon'],
  basashi: ['바사시', '馬刺し', 'basashi'],
  tonkotsu: ['돈코츠 라멘', '豚骨ラーメン', 'tonkotsu ramen'],
  karashi: ['카라시 연근', 'からし蓮根', 'karashi renkon'],
  champon: ['짬뽕', 'ちゃんぽん', 'champon'],
  sara_udon: ['사라우동', '皿うどん', 'sara udon'],
  kasutera: ['카스테라', 'カステラ', 'castella'],
  burger: ['사세보 버거', 'sasebo burger'],
  kujira: ['고래고기', '鯨肉', 'whale meat'],
  oyster: ['굴 요리', '牡蠣', 'oyster'],
  bungo_beef: ['분고규', '豊後牛', 'bungo beef'],
  jigoku_mushi: ['지고쿠무시', '地獄蒸し', 'jigoku mushi'],
  dango: ['경단', '団子', 'dango']
};

class GooglePlacesService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
    
    if (!this.apiKey) {
      console.warn('⚠️ Google Places API 키가 설정되지 않았습니다.');
    }
  }

  // 텍스트 검색으로 식당 찾기
  async searchRestaurants(query, location = '') {
    if (!this.apiKey) {
      throw new Error('Google Places API 키가 필요합니다.');
    }

    try {
      console.log(`🔍 Google Places API로 검색: ${query} ${location}`);
      
      const searchQuery = `${query} restaurant ${location} Japan`;
      const response = await fetch(
        `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${this.apiKey}&language=ko&type=restaurant`
      );

      if (!response.ok) {
        throw new Error(`Google Places API 오류: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API 오류: ${data.status} - ${data.error_message || '알 수 없는 오류'}`);
      }

      const restaurants = data.results?.map(place => ({
        name: place.name,
        rating: place.rating || 0,
        specialty: place.types?.join(', ') || '',
        address: place.formatted_address || '',
        place_id: place.place_id,
        user_ratings_total: place.user_ratings_total || 0,
        price_level: place.price_level || null,
        opening_hours: place.opening_hours || null,
        photos: place.photos?.map(photo => ({
          photo_reference: photo.photo_reference,
          width: photo.width,
          height: photo.height
        })) || [],
        coordinates: place.geometry?.location || null
      })) || [];

      console.log(`✅ Google Places API에서 ${restaurants.length}개 식당 검색 완료`);
      return restaurants;
      
    } catch (error) {
      console.error('❌ Google Places API 검색 실패:', error);
      throw error;
    }
  }

  // 장소 상세 정보 가져오기
  async getPlaceDetails(placeId) {
    if (!this.apiKey) {
      throw new Error('Google Places API 키가 필요합니다.');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/details/json?place_id=${placeId}&key=${this.apiKey}&language=ko&fields=name,rating,formatted_address,formatted_phone_number,opening_hours,reviews,photos,price_level,user_ratings_total,website`
      );

      if (!response.ok) {
        throw new Error(`Google Places API 오류: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Google Places API 오류: ${data.status}`);
      }

      return data.result;
      
    } catch (error) {
      console.error('❌ 장소 상세 정보 조회 실패:', error);
      throw error;
    }
  }

  // 리뷰 가져오기
  async getPlaceReviews(placeId) {
    try {
      const details = await this.getPlaceDetails(placeId);
      
      return details.reviews?.map(review => ({
        text: review.text,
        rating: review.rating,
        author: review.author_name,
        time: review.relative_time_description,
        source: 'google_places_api'
      })) || [];
      
    } catch (error) {
      console.error('❌ 리뷰 조회 실패:', error);
      return [];
    }
  }

  // 사진 URL 생성
  getPhotoUrl(photoReference, maxWidth = 400) {
    if (!this.apiKey || !photoReference) return null;
    
    return `${this.baseUrl}/photo?photoreference=${photoReference}&maxwidth=${maxWidth}&key=${this.apiKey}`;
  }

  // 지역별 검색어 매핑
  getCitySearchTerms(cityId) {
    const cityTerms = {
      fukuoka: 'Fukuoka Hakata',
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
      ramen: 'ramen noodle',
      mentaiko: 'mentaiko pollock roe',
      motsunabe: 'motsunabe hotpot',
      yakitori: 'yakitori grilled chicken',
      udon: 'udon noodle',
      basashi: 'basashi horse sashimi',
      tonkotsu: 'tonkotsu ramen',
      karashi: 'karashi renkon lotus root',
      champon: 'champon noodle',
      sara_udon: 'sara udon',
      kasutera: 'kasutera sponge cake',
      burger: 'sasebo burger',
      kujira: 'whale meat',
      oyster: 'oyster',
      bungo_beef: 'bungo beef',
      jigoku_mushi: 'jigoku mushi steam cooking',
      dango: 'dango dumpling',
      saga_beef: 'saga beef',
      yobuko_squid: 'yobuko squid',
      gagyudon: 'beef bowl'
    };
    
    return foodTerms[foodType] || foodType;
  }
}

// 싱글톤 인스턴스
const googlePlacesService = new GooglePlacesService();

export default googlePlacesService;

// 기존 함수들과의 호환성을 위한 래퍼 함수들
export const searchRestaurants = async (query, location = '') => {
  return await googlePlacesService.searchRestaurants(query, location);
};

export const getPlaceReviews = async (placeId) => {
  return await googlePlacesService.getPlaceReviews(placeId);
};

export const scrapeAdditionalReviews = async (restaurantName, cityName) => {
  // 추가 리뷰 스크래핑은 별도 서비스에서 처리
  console.log(`📝 추가 리뷰 스크래핑: ${restaurantName} in ${cityName}`);
  return [];
};

// 구글맵 URL 생성 (place_id 우선, 없으면 검색)
export const generateGoogleMapsUrl = (restaurant, cityName) => {
  if (restaurant.place_id) {
    return `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`;
  }
  const query = encodeURIComponent(`${restaurant.name} ${cityName} 일본`);
  return `https://www.google.com/maps/search/${query}`;
}; 