import apiUsageTracker from '../services/apiUsageTracker.js';
import apiClient from './apiClient.js';
import { googlePlacesLimiter } from './rateLimiter.js';
import { placesCache, reviewsCache } from './apiCache.js';

// Google Places API 설정
const GOOGLE_PLACES_API_KEY = (import.meta.env && import.meta.env.VITE_GOOGLE_PLACES_API_KEY) || 'YOUR_API_KEY_HERE';

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
    this.apiKey = (import.meta.env && import.meta.env.VITE_GOOGLE_PLACES_API_KEY);
    this.baseUrl = 'https://places.googleapis.com/v1'; // New Places API
    
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE' || this.apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
      console.warn('⚠️ Google Places API 키가 설정되지 않았습니다.');
      console.info('📝 .env 파일에 VITE_GOOGLE_PLACES_API_KEY=실제API키 를 설정해주세요.');
    } else {
      console.log('✅ Google Places API 키가 설정되었습니다.');
    }
  }

  // API 키가 없을 때 사용할 fallback 데이터
  getFallbackRestaurants(query, location) {
    const fallbackData = [
      {
        name: '하카타 이치란 라멘 본점',
        rating: 4.2,
        specialty: 'restaurant, meal_takeaway',
        address: '일본 후쿠오카현 후쿠오카시 하카타구',
        place_id: 'ChIJ123demo_place_1',
        user_ratings_total: 1250,
        price_level: 2,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 33.5904, lng: 130.4017 }
      },
      {
        name: '모츠나베 야마야',
        rating: 4.4,
        specialty: 'restaurant, food',
        address: '일본 후쿠오카현 후쿠오카시 중앙구',
        place_id: 'ChIJ456demo_place_2',
        user_ratings_total: 890,
        price_level: 3,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 33.5904, lng: 130.4017 }
      },
      {
        name: '명란젓 전문점 후쿠타로',
        rating: 4.3,
        specialty: 'restaurant, store',
        address: '일본 후쿠오카현 후쿠오카시 하카타구',
        place_id: 'ChIJ789demo_place_3',
        user_ratings_total: 765,
        price_level: 2,
        opening_hours: { open_now: false },
        photos: [],
        coordinates: { lat: 33.5904, lng: 130.4017 }
      },
      {
        name: '스가노야 바사시 전문점',
        rating: 4.6,
        specialty: 'restaurant, food',
        address: '일본 구마모토현 구마모토시',
        place_id: 'ChIJ101demo_place_4',
        user_ratings_total: 1100,
        price_level: 4,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 32.8031, lng: 130.7081 }
      },
      {
        name: '이프푸도 하카타 본점',
        rating: 4.5,
        specialty: 'restaurant, meal_takeaway',
        address: '일본 후쿠오카현 후쿠오카시 하카타구',
        place_id: 'ChIJ202demo_place_5',
        user_ratings_total: 2100,
        price_level: 2,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 33.5904, lng: 130.4017 }
      },
      {
        name: '나가사키 짬뽕 링링',
        rating: 4.3,
        specialty: 'restaurant, food',
        address: '일본 나가사키현 나가사키시',
        place_id: 'ChIJ303demo_place_6',
        user_ratings_total: 850,
        price_level: 2,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 32.7503, lng: 129.8779 }
      },
      {
        name: '야키토리 다이젠',
        rating: 4.7,
        specialty: 'restaurant, bar',
        address: '일본 후쿠오카현 쿠루메시',
        place_id: 'ChIJ404demo_place_7',
        user_ratings_total: 950,
        price_level: 3,
        opening_hours: { open_now: false },
        photos: [],
        coordinates: { lat: 33.3192, lng: 130.5081 }
      },
      {
        name: '분고규 스테이크 하우스',
        rating: 4.8,
        specialty: 'restaurant, food',
        address: '일본 오이타현 오이타시',
        place_id: 'ChIJ505demo_place_8',
        user_ratings_total: 1300,
        price_level: 4,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 33.2382, lng: 131.6126 }
      },
      {
        name: '사세보 버거 힘토라',
        rating: 4.1,
        specialty: 'restaurant, meal_takeaway',
        address: '일본 나가사키현 사세보시',
        place_id: 'ChIJ606demo_place_9',
        user_ratings_total: 675,
        price_level: 2,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 33.1597, lng: 129.7214 }
      },
      {
        name: '구마모토 라멘 아지센',
        rating: 4.4,
        specialty: 'restaurant, meal_takeaway',
        address: '일본 구마모토현 구마모토시',
        place_id: 'ChIJ707demo_place_10',
        user_ratings_total: 1580,
        price_level: 2,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 32.8031, lng: 130.7081 }
      },
      {
        name: '사가규 전문점 마쓰우라',
        rating: 4.6,
        specialty: 'restaurant, food',
        address: '일본 사가현 사가시',
        place_id: 'ChIJ808demo_place_11',
        user_ratings_total: 780,
        price_level: 4,
        opening_hours: { open_now: false },
        photos: [],
        coordinates: { lat: 33.2635, lng: 130.3000 }
      },
      {
        name: '톤코츠 라멘 남킨센료',
        rating: 4.5,
        specialty: 'restaurant, meal_takeaway',
        address: '일본 후쿠오카현 쿠루메시',
        place_id: 'ChIJ909demo_place_12',
        user_ratings_total: 1200,
        price_level: 2,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 33.3192, lng: 130.5081 }
      },
      {
        name: '카라시 연근 전문점',
        rating: 4.2,
        specialty: 'restaurant, food',
        address: '일본 구마모토현 구마모토시',
        place_id: 'ChIJ010demo_place_13',
        user_ratings_total: 640,
        price_level: 2,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 32.8031, lng: 130.7081 }
      },
      {
        name: '카스테라 본점 소운도',
        rating: 4.3,
        specialty: 'bakery, store',
        address: '일본 나가사키현 나가사키시',
        place_id: 'ChIJ111demo_place_14',
        user_ratings_total: 520,
        price_level: 2,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 32.7503, lng: 129.8779 }
      },
      {
        name: '지고쿠무시 공방',
        rating: 4.4,
        specialty: 'restaurant, tourist_attraction',
        address: '일본 오이타현 벳푸시',
        place_id: 'ChIJ212demo_place_15',
        user_ratings_total: 890,
        price_level: 3,
        opening_hours: { open_now: true },
        photos: [],
        coordinates: { lat: 33.2785, lng: 131.4917 }
      }
    ];

    // 검색어에 따라 관련된 데이터만 필터링
    const filteredData = fallbackData.filter(restaurant => {
      const searchTerm = query.toLowerCase();
      const locationTerm = location.toLowerCase();
      const restaurantName = restaurant.name.toLowerCase();
      const restaurantAddress = restaurant.address.toLowerCase();
      
      // 기본적으로 모든 결과를 포함하되, 검색어가 있으면 필터링
      if (!searchTerm && !locationTerm) return true;
      
      if (searchTerm.includes('라멘') || searchTerm.includes('ramen')) {
        return restaurantName.includes('라멘') || restaurantName.includes('이치란') || restaurantName.includes('이프푸도');
      }
      if (searchTerm.includes('바사시') || searchTerm.includes('basashi')) {
        return restaurantName.includes('바사시') || restaurantName.includes('스가노야');
      }
      if (searchTerm.includes('야키토리') || searchTerm.includes('yakitori')) {
        return restaurantName.includes('야키토리') || restaurantName.includes('다이젠');
      }
      if (searchTerm.includes('짬뽕') || searchTerm.includes('champon')) {
        return restaurantName.includes('짬뽕') || restaurantName.includes('링링');
      }
      
      return restaurantName.includes(searchTerm) || restaurantAddress.includes(locationTerm);
    }).slice(0, 8); // 최대 8개까지 반환

    console.log(`📦 API 키 없음 - 데모 데이터 ${filteredData.length}개 반환`);
    return filteredData;
  }

  // 텍스트 검색으로 장소 찾기 (Generic)
  async searchPlaces(query, options = {}) {
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE' || this.apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
      console.warn('Google Places API 키가 없어 샘플 데이터를 반환합니다.');
      console.info('📝 .env 파일에 VITE_GOOGLE_PLACES_API_KEY=실제API키 를 설정해주세요.');
      return this.getFallbackRestaurants(query, options.location || '');
    }

    const { location = '', type = 'place' } = options;

    // Check cache first
    const cacheKey = placesCache.generateKey('searchPlaces', { query, location, type });
    const cached = placesCache.get(cacheKey);
    if (cached) {
      console.log('⚡ Using cached search results');
      return cached;
    }

    try {
      // Rate limiting
      await googlePlacesLimiter.waitForToken('search');
      
      console.log(`🔍 New Google Places API로 검색: ${query} ${location}`);
      
      // 검색어 구성: 쿼리 + 위치 + 일본
      const searchQuery = `${query} ${location} Japan`;
      
      // Google Places API Text Search 사용
      const params = new URLSearchParams({
        query: searchQuery,
        key: this.apiKey,
        language: 'ko',
        region: 'jp'
      });

      if (type !== 'place') {
        params.append('type', type);
      }

      console.log('Search query:', searchQuery);

      const response = await fetch(`/maps/api/place/textsearch/json?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Google Places API 오류: ${response.status}`, errorText);
        return [];
      }

      const data = await response.json();
      // console.log('Places API 응답:', data); // 로그 너무 많아서 주석 처리
      
      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        console.warn('검색 결과가 없습니다. Status:', data.status);
        return [];
      }

      const places = data.results.map(place => ({
        name: place.name || 'Unknown',
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
      }))
      .filter(place => place.rating > 0) // 평점이 있는 것만
      .sort((a, b) => b.rating - a.rating); // 평점 높은 순으로 정렬

      console.log(`✅ Google Places API에서 ${places.length}개 장소 검색 완료 (평점순 정렬)`);
      
      // Cache the results
      placesCache.set(cacheKey, places);
      
      return places;
      
    } catch (error) {
      console.warn('❌ Google Places API 검색 실패:', error.message);
      console.info('💡 네트워크 오류로 인해 샘플 데이터를 반환합니다.');
      return this.getFallbackRestaurants(query, location);
    }
  }

  // 텍스트 검색으로 식당 찾기 (Legacy Wrapper)
  async searchRestaurants(query, location = '') {
    // "restaurant" 키워드가 없으면 추가
    const searchQuery = query.toLowerCase().includes('restaurant') ? query : `${query} restaurant`;
    return this.searchPlaces(searchQuery, { location, type: 'restaurant' });
  }

  // 장소 상세 정보 가져오기 (New Places API)
  async getPlaceDetails(placeId) {
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE' || this.apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
      console.warn('Google Places API 키가 없어 기본 데이터를 반환합니다.');
      return { reviews: [], rating: 0, user_ratings_total: 0 };
    }

    // Check cache first
    const cacheKey = `details:${placeId}`;
    const cached = placesCache.get(cacheKey);
    if (cached) {
      console.log('⚡ Using cached place details');
      return cached;
    }

    try {
      // Rate limiting
      await googlePlacesLimiter.waitForToken('details');
      
      // Google Places API Details 사용
      const params = new URLSearchParams({
        place_id: placeId,
        key: this.apiKey,
        fields: 'name,rating,formatted_address,international_phone_number,opening_hours,reviews,photos,price_level,user_ratings_total,website',
        language: 'ko'
      });

      const response = await fetch(`/maps/api/place/details/json?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn(`Google Places API Details 오류: ${response.status}`);
        return { reviews: [], rating: 0, user_ratings_total: 0 };
      }

      const data = await response.json();
      
      if (data.status !== 'OK' || !data.result) {
        console.warn('장소 상세 정보 조회 실패. Status:', data.status);
        return { reviews: [], rating: 0, user_ratings_total: 0 };
      }
      
      // Cache the results
      placesCache.set(cacheKey, data.result);
      
      return data.result;
      
    } catch (error) {
      console.warn('❌ 장소 상세 정보 조회 실패:', error.message);
      return { reviews: [], rating: 0, user_ratings_total: 0 };
    }
  }

  // 리뷰 가져오기
  async getPlaceReviews(placeId) {
    // Check cache first
    const cacheKey = `reviews:${placeId}`;
    const cached = reviewsCache.get(cacheKey);
    if (cached) {
      console.log('⚡ Using cached reviews');
      return cached;
    }

    try {
      const details = await this.getPlaceDetails(placeId);
      
      const reviews = details.reviews?.map(review => ({
        text: review.text,
        rating: review.rating,
        author: review.author_name,
        time: review.relative_time_description,
        source: 'google_places_api'
      })) || [];

      // Cache the reviews
      reviewsCache.set(cacheKey, reviews);
      
      return reviews;
      
    } catch (error) {
      console.error('❌ 리뷰 조회 실패:', error);
      return [];
    }
  }

  // 사진 URL 생성 (Google Places API)
  getPhotoUrl(photoReference, maxWidth = 400) {
    if (!this.apiKey || !photoReference) return null;
    
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
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