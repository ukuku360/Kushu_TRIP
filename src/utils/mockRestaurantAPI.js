// Mock Restaurant API - Google Places API 시뮬레이션
// 실제 운영에서는 백엔드 서버에서 Google Places API를 호출해야 함

const MOCK_RESTAURANTS = {
  fukuoka: {
    ramen: [
      { name: '一蘭 本店 (이치란 라멘 본점)', rating: 4.8, specialty: '톤코츠 라멘', address: '후쿠오카현 후쿠오카시 주오구 나카스 5-3-2', place_id: 'mock_1', user_ratings_total: 2341 },
      { name: '一風堂 本店 (이프푸도 본점)', rating: 4.7, specialty: '하카타 라멘', address: '후쿠오카현 후쿠오카시 하카타구 가미가와바타마치 10-1', place_id: 'mock_2', user_ratings_total: 1876 },
      { name: '博多だるま (하카타 다루마)', rating: 4.6, specialty: '진한 톤코츠', address: '후쿠오카현 후쿠오카시 하카타구 하카타에키마에', place_id: 'mock_3', user_ratings_total: 1543 }
    ],
    mentaiko: [
      { name: 'ふくや (후쿠야)', rating: 4.9, specialty: '명란젓 전문점', address: '후쿠오카현 후쿠오카시 하카타구 나카스', place_id: 'mock_4', user_ratings_total: 987 },
      { name: 'やまや (야마야)', rating: 4.7, specialty: '명란젓 오니기리', address: '후쿠오카현 후쿠오카시 하카타구 텐진', place_id: 'mock_5', user_ratings_total: 1234 },
      { name: 'かねふく (가네후쿠)', rating: 4.5, specialty: '명란젓 선물세트', address: '후쿠오카현 후쿠오카시 주오구 텐진', place_id: 'mock_6', user_ratings_total: 876 }
    ],
    motsunabe: [
      { name: 'やま中 本店 (야마나카 본점)', rating: 4.8, specialty: '전통 모츠나베', address: '후쿠오카현 후쿠오카시 주오구 니시나카스', place_id: 'mock_7', user_ratings_total: 1456 },
      { name: 'もつ鍋 楽天地 (모츠나베 라쿠텐치)', rating: 4.6, specialty: '간장 베이스', address: '후쿠오카현 후쿠오카시 하카타구 나카스', place_id: 'mock_8', user_ratings_total: 1123 },
      { name: '博多もつ鍋 おおやま (하카타 모츠나베 오오야마)', rating: 4.7, specialty: '미소 베이스', address: '후쿠오카현 후쿠오카시 하카타구 니시나카스', place_id: 'mock_9', user_ratings_total: 967 }
    ]
  },
  kurume: {
    yakitori: [
      { name: '大善 (다이젠)', rating: 4.9, specialty: '쿠루메식 야키토리', address: '후쿠오카현 쿠루메시 혼마치 9-18', place_id: 'mock_10', user_ratings_total: 876 },
      { name: '鳥心 (토리신)', rating: 4.8, specialty: '숯불 구이', address: '후쿠오카현 쿠루메시 시모쿠라 13-5', place_id: 'mock_11', user_ratings_total: 743 },
      { name: '焼き鳥 松家 (야키토리 마츠야)', rating: 4.7, specialty: '비밀 소스', address: '후쿠오카현 쿠루메시 아카사카 2-7', place_id: 'mock_12', user_ratings_total: 654 }
    ],
    ramen: [
      { name: '南京千両 (난킨센료)', rating: 4.8, specialty: '톤코츠 원조', address: '후쿠오카현 쿠루메시 오테마치 8-1', place_id: 'mock_13', user_ratings_total: 1234 },
      { name: 'おもがえり (오모가에리)', rating: 4.7, specialty: '진한 스프', address: '후쿠오카현 쿠루메시 혼마치 15-3', place_id: 'mock_14', user_ratings_total: 987 },
      { name: 'ラーメン横丁 (라멘 요코쵸)', rating: 4.6, specialty: '전통 맛', address: '후쿠오카현 쿠루메시 니시테츠 7-12', place_id: 'mock_15', user_ratings_total: 765 }
    ],
    udon: [
      { name: '丸星ラーメン店 (마루보시 라멘점)', rating: 4.7, specialty: '쫄깃한 면발', address: '후쿠오카현 쿠루메시 미이마치 4-6', place_id: 'mock_16', user_ratings_total: 543 },
      { name: 'うどん好き (우동 스키)', rating: 4.6, specialty: '맑은 국물', address: '후쿠오카현 쿠루메시 구루메 11-2', place_id: 'mock_17', user_ratings_total: 432 },
      { name: '手打ちうどん (테우치 우동)', rating: 4.5, specialty: '수제 우동', address: '후쿠오카현 쿠루메시 혼마치 6-9', place_id: 'mock_18', user_ratings_total: 321 }
    ]
  },
  kumamoto: {
    basashi: [
      { name: '菅乃屋 (스가노야)', rating: 4.9, specialty: '최고급 말고기', address: '쿠마모토현 쿠마모토시 주오구 가미토리 1-7-18', place_id: 'mock_19', user_ratings_total: 876 },
      { name: '馬肉専門店 美吉 (바사시 전문점 미요시)', rating: 4.7, specialty: '신선한 말 회', address: '쿠마모토현 쿠마모토시 히가시구 히가시쵸 4-14-24', place_id: 'mock_20', user_ratings_total: 654 },
      { name: '熊本屋 (구마모토야)', rating: 4.6, specialty: '전통 바사시', address: '쿠마모토현 쿠마모토시 미나미구 미나미타카에 1-1-1', place_id: 'mock_21', user_ratings_total: 543 }
    ],
    tonkotsu: [
      { name: '熊本ラーメン館 (구마모토 라멘관)', rating: 4.8, specialty: '마늘 토핑', address: '쿠마모토현 쿠마모토시 주오구 쿠로카미 1-3-1', place_id: 'mock_22', user_ratings_total: 1234 },
      { name: '味千ラーメン (아지센)', rating: 4.7, specialty: '진한 국물', address: '쿠마모토현 쿠마모토시 히가시구 히가시쵸 3-1-1', place_id: 'mock_23', user_ratings_total: 987 },
      { name: '龍ラーメン (류라멘)', rating: 4.6, specialty: '구마모토식 차슈', address: '쿠마모토현 쿠마모토시 기타구 다이에 2-5-1', place_id: 'mock_24', user_ratings_total: 765 }
    ],
    karashi: [
      { name: 'れんこん専門店 (로컨 전문점)', rating: 4.8, specialty: '매운 연근 요리', address: '쿠마모토현 쿠마모토시 주오구 가미토리 5-5-5', place_id: 'mock_25', user_ratings_total: 432 },
      { name: '熊本伝統食堂 (구마모토 전통식당)', rating: 4.7, specialty: '현지식 카라시', address: '쿠마모토현 쿠마모토시 니시구 니시하라 3-1-1', place_id: 'mock_26', user_ratings_total: 321 },
      { name: 'れんこん村 (연근마을)', rating: 4.5, specialty: '연근 코스', address: '쿠마모토현 쿠마모토시 미나미구 미나미타카에 2-2-2', place_id: 'mock_27', user_ratings_total: 234 }
    ]
  },
  nagasaki: {
    champon: [
      { name: '四海樓 (시카이로)', rating: 4.9, specialty: '원조 짬뽕', address: '나가사키현 나가사키시 마츠가에마치 4-5', place_id: 'mock_28', user_ratings_total: 2341 },
      { name: '江山楼 (코우잔로)', rating: 4.8, specialty: '해산물 짬뽕', address: '나가사키현 나가사키시 신치마치 12-2', place_id: 'mock_29', user_ratings_total: 1876 },
      { name: 'リンガーハット 浜町店 (링거헛 하마마치점)', rating: 4.7, specialty: '야채 짬뽕', address: '나가사키현 나가사키시 하마노마치 8-32', place_id: 'mock_30', user_ratings_total: 1543 }
    ],
    sara_udon: [
      { name: '明華園 (메이카엔)', rating: 4.8, specialty: '파삭한 면', address: '나가사키현 나가사키시 신치마치 10-16', place_id: 'mock_31', user_ratings_total: 987 },
      { name: '銀嶺 (긴레이)', rating: 4.7, specialty: '야채 사라우동', address: '나가사키현 나가사키시 혼마치 6-23', place_id: 'mock_32', user_ratings_total: 876 },
      { name: '蓬莱 (호라이)', rating: 4.6, specialty: '해산물 사라우동', address: '나가사키현 나가사키시 이나사 2-9-1', place_id: 'mock_33', user_ratings_total: 654 }
    ],
    kasutera: [
      { name: '福砂屋 (후쿠사야)', rating: 4.9, specialty: '원조 카스테라', address: '나가사키현 나가사키시 혼마치 3-1', place_id: 'mock_34', user_ratings_total: 1234 },
      { name: '松翁軒 (쇼오켄)', rating: 4.8, specialty: '꿀 카스테라', address: '나가사키현 나가사키시 신치마치 8-7', place_id: 'mock_35', user_ratings_total: 987 },
      { name: 'りんが (린가)', rating: 4.7, specialty: '초콜릿 카스테라', address: '나가사키현 나가사키시 다테마치 4-4', place_id: 'mock_36', user_ratings_total: 765 }
    ]
  },
  sasebo: {
    burger: [
      { name: 'ビッグマン (빅맨)', rating: 4.9, specialty: '원조 사세보 버거', address: '나가사키현 사세보시 혼마치 5-25', place_id: 'mock_37', user_ratings_total: 1543 },
      { name: 'ラッキーズ (러키즈)', rating: 4.8, specialty: '수제 패티', address: '나가사키현 사세보시 시마지 2-4-10', place_id: 'mock_38', user_ratings_total: 1234 },
      { name: 'ログキット (로그킷)', rating: 4.7, specialty: '아메리칸 스타일', address: '나가사키현 사세보시 우라가미 3-1-8', place_id: 'mock_39', user_ratings_total: 987 }
    ],
    kujira: [
      { name: 'くじら屋 (쿠지라야)', rating: 4.8, specialty: '고래 스테이크', address: '나가사키현 사세보시 혼마치 8-14', place_id: 'mock_40', user_ratings_total: 432 },
      { name: '港 (미나토)', rating: 4.7, specialty: '고래 회', address: '나가사키현 사세보시 미나토 1-2-3', place_id: 'mock_41', user_ratings_total: 321 },
      { name: '伝統海産物 (전통 해산물)', rating: 4.6, specialty: '고래 나베', address: '나가사키현 사세보시 시마지 7-8-9', place_id: 'mock_42', user_ratings_total: 234 }
    ],
    oyster: [
      { name: '九州牡蠣屋 (규슈 굴집)', rating: 4.7, specialty: '구이 굴', address: '나가사키현 사세보시 혼마치 12-5', place_id: 'mock_43', user_ratings_total: 543 },
      { name: '海の家 (바다의 집)', rating: 4.6, specialty: '굴 라멘', address: '나가사키현 사세보시 미나토 4-6-7', place_id: 'mock_44', user_ratings_total: 432 },
      { name: '牡蠣専門店 (굴 전문점)', rating: 4.5, specialty: '굴 프라이', address: '나가사키현 사세보시 우라가미 9-10-11', place_id: 'mock_45', user_ratings_total: 321 }
    ]
  },
  oita: {
    bungo_beef: [
      { name: '豊後屋 (분고야)', rating: 4.9, specialty: '분고규 스테이크', address: '오이타현 오이타시 혼마치 1-3-15', place_id: 'mock_46', user_ratings_total: 876 },
      { name: '大分焼肉 (오이타 야키니쿠)', rating: 4.8, specialty: '분고규 바베큐', address: '오이타현 오이타시 니아게 2-7-8', place_id: 'mock_47', user_ratings_total: 765 },
      { name: '肉処 (니쿠도코로)', rating: 4.7, specialty: '분고규 스키야키', address: '오이타현 오이타시 케이바 3-4-9', place_id: 'mock_48', user_ratings_total: 654 }
    ],
    jigoku_mushi: [
      { name: '地獄蒸し工房 (지고쿠무시 공방)', rating: 4.8, specialty: '온천 찜 요리', address: '오이타현 별부시 온천 1-2-3', place_id: 'mock_49', user_ratings_total: 543 },
      { name: '別府温泉 (별부 온천)', rating: 4.7, specialty: '야채 지고쿠무시', address: '오이타현 별부시 혼마치 4-5-6', place_id: 'mock_50', user_ratings_total: 432 },
      { name: '湯布院蒸し屋 (유후인 찜집)', rating: 4.6, specialty: '해산물 지고쿠무시', address: '오이타현 유후인시 온천 7-8-9', place_id: 'mock_51', user_ratings_total: 321 }
    ],
    dango: [
      { name: '団子屋 (단고야)', rating: 4.7, specialty: '온천 경단', address: '오이타현 오이타시 혼마치 10-11-12', place_id: 'mock_52', user_ratings_total: 234 },
      { name: '大分菓子店 (오이타 과자점)', rating: 4.6, specialty: '수제 경단', address: '오이타현 오이타시 니아게 13-14-15', place_id: 'mock_53', user_ratings_total: 198 },
      { name: '伝統団子 (전통 단고)', rating: 4.5, specialty: '팥 경단', address: '오이타현 오이타시 케이바 16-17-18', place_id: 'mock_54', user_ratings_total: 165 }
    ]
  }
};

// Mock API 함수
export const searchRestaurants = async (cityId, foodType) => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  try {
    const cityData = MOCK_RESTAURANTS[cityId];
    if (!cityData || !cityData[foodType]) {
      return [];
    }
    
    const restaurants = cityData[foodType];
    // 평점순으로 정렬
    return restaurants.sort((a, b) => b.rating - a.rating);
    
  } catch (error) {
    console.error('Mock API Error:', error);
    throw new Error('맛집 검색 중 오류가 발생했습니다.');
  }
};

// 구글맵 URL 생성 (Mock 데이터는 모두 검색 쿼리 사용)
export const generateGoogleMapsUrl = (restaurant, cityName) => {
  // Mock 데이터인 경우 또는 실제 place_id가 없는 경우 검색 쿼리 사용
  if (!restaurant.place_id || restaurant.place_id.startsWith('mock_')) {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address} ${cityName} 일본`);
    return `https://www.google.com/maps/search/${query}`;
  }
  
  // 실제 place_id가 있는 경우에만 place_id 사용
  return `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`;
}; 