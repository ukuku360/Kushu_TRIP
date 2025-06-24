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

// Google Places API로 맛집 검색
export const searchRestaurants = async (cityId, foodType) => {
  try {
    const coordinates = CITY_COORDINATES[cityId];
    const searchTerms = FOOD_SEARCH_TERMS[foodType];
    
    if (!coordinates || !searchTerms) {
      throw new Error('Invalid city or food type');
    }

    // 여러 검색어로 병렬 검색
    const searchPromises = searchTerms.map(term => 
      fetchPlacesForTerm(coordinates, term)
    );
    
    const results = await Promise.all(searchPromises);
    const allRestaurants = results.flat();
    
    // 중복 제거 (place_id 기준)
    const uniqueRestaurants = removeDuplicates(allRestaurants);
    
    // 평점 순으로 정렬하고 상위 3개 선택
    const topRestaurants = uniqueRestaurants
      .filter(restaurant => restaurant.rating && restaurant.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
    
    return topRestaurants.map((restaurant, index) => ({
      name: restaurant.name,
      rating: restaurant.rating,
      specialty: restaurant.types?.[0]?.replace(/_/g, ' ') || '맛집',
      address: restaurant.formatted_address,
      place_id: restaurant.place_id,
      photos: restaurant.photos,
      user_ratings_total: restaurant.user_ratings_total
    }));
    
  } catch (error) {
    console.error('Error searching restaurants:', error);
    // 에러 시 fallback 데이터 반환
    return getFallbackRestaurants(foodType);
  }
};

// 특정 검색어로 장소 검색
const fetchPlacesForTerm = async (coordinates, searchTerm) => {
  const { lat, lng } = coordinates;
  const radius = 5000; // 5km 반경
  
  const params = new URLSearchParams({
    key: GOOGLE_PLACES_API_KEY,
    location: `${lat},${lng}`,
    radius: radius,
    keyword: searchTerm,
    type: 'restaurant',
    language: 'ko'
  });
  
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`
  );
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const data = await response.json();
  return data.results || [];
};

// 중복 제거 함수
const removeDuplicates = (restaurants) => {
  const seen = new Set();
  return restaurants.filter(restaurant => {
    if (seen.has(restaurant.place_id)) {
      return false;
    }
    seen.add(restaurant.place_id);
    return true;
  });
};

// API 에러 시 fallback 데이터
const getFallbackRestaurants = (foodType) => [
  { 
    name: '맛집 검색 중...', 
    rating: 0.0, 
    specialty: '잠시만 기다려주세요',
    address: '검색 중...',
    place_id: null
  },
  { 
    name: 'API 키가 필요합니다', 
    rating: 0.0, 
    specialty: 'Google Places API 설정 필요',
    address: '.env.local 파일에 VITE_GOOGLE_PLACES_API_KEY 추가',
    place_id: null
  },
  { 
    name: '수동 검색을 이용해주세요', 
    rating: 0.0, 
    specialty: '구글맵에서 직접 검색해보세요',
    address: '죄송합니다',
    place_id: null
  }
];

// 구글맵 URL 생성 (place_id 우선, 없으면 검색)
export const generateGoogleMapsUrl = (restaurant, cityName) => {
  if (restaurant.place_id) {
    return `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`;
  }
  const query = encodeURIComponent(`${restaurant.name} ${cityName} 일본`);
  return `https://www.google.com/maps/search/${query}`;
}; 