// Mock Hotplace API - Google Places API 시뮬레이션
// 실제 운영에서는 백엔드 서버에서 Google Places API를 호출해야 함

const MOCK_HOTPLACES = {
  fukuoka: {
    ohori_park: [
      { name: '오호리공원 일본정원', rating: 4.8, specialty: '전통 일본 정원', address: '후쿠오카현 후쿠오카시 주오구 오호리공원 1-2', place_id: 'hotplace_1', user_ratings_total: 2341 },
      { name: '오호리공원 벚꽃길', rating: 4.7, specialty: '벚꽃 명소', address: '후쿠오카현 후쿠오카시 주오구 오호리공원', place_id: 'hotplace_2', user_ratings_total: 1876 },
      { name: '오호리공원 보트하우스', rating: 4.6, specialty: '호수 보트 체험', address: '후쿠오카현 후쿠오카시 주오구 오호리공원', place_id: 'hotplace_3', user_ratings_total: 1543 }
    ],
    dazaifu: [
      { name: '다자이후 텐만구', rating: 4.9, specialty: '학문의 신', address: '후쿠오카현 다자이후시 다자이후 4-7-1', place_id: 'hotplace_4', user_ratings_total: 3210 },
      { name: '다자이후 국립박물관', rating: 4.8, specialty: '규슈 역사', address: '후쿠오카현 다자이후시 이시자카 4-7-2', place_id: 'hotplace_5', user_ratings_total: 1987 },
      { name: '가멘지절', rating: 4.7, specialty: '정토 정원', address: '후쿠오카현 다자이후시 가멘지 2-16-1', place_id: 'hotplace_6', user_ratings_total: 1234 }
    ],
    canal_city: [
      { name: '캐널시티 하카타', rating: 4.8, specialty: '쇼핑몰 분수쇼', address: '후쿠오카현 후쿠오카시 하카타구 스미요시 1-2-25', place_id: 'hotplace_7', user_ratings_total: 2876 },
      { name: '라멘 스타디움', rating: 4.7, specialty: '라멘 푸드코트', address: '후쿠오카현 후쿠오카시 하카타구 캐널시티 5F', place_id: 'hotplace_8', user_ratings_total: 1654 },
      { name: '유니클로 플래그십', rating: 4.6, specialty: '최대 규모 유니클로', address: '후쿠오카현 후쿠오카시 하카타구 캐널시티 1F', place_id: 'hotplace_9', user_ratings_total: 1432 }
    ]
  },
  kurume: {
    inari_shrine: [
      { name: '쿠루메 스이텐구', rating: 4.8, specialty: '연애성취 신사', address: '후쿠오카현 쿠루메시 세이지마치 265', place_id: 'hotplace_10', user_ratings_total: 876 },
      { name: '이나리 산책로', rating: 4.7, specialty: '산책로', address: '후쿠오카현 쿠루메시 미이마치 신사길', place_id: 'hotplace_11', user_ratings_total: 654 },
      { name: '신사 축제장', rating: 4.6, specialty: '계절 축제', address: '후쿠오카현 쿠루메시 세이지마치 축제광장', place_id: 'hotplace_12', user_ratings_total: 543 }
    ],
    chikugo_river: [
      { name: '치쿠고강 리버파크', rating: 4.7, specialty: '강변 공원', address: '후쿠오카현 쿠루메시 미이마치 강변 1-1', place_id: 'hotplace_13', user_ratings_total: 987 },
      { name: '유카타가와 하천부지', rating: 4.6, specialty: '바베큐장', address: '후쿠오카현 쿠루메시 유카타가와', place_id: 'hotplace_14', user_ratings_total: 765 },
      { name: '치쿠고강 불꽃축제장', rating: 4.5, specialty: '여름 축제', address: '후쿠오카현 쿠루메시 치쿠고강 축제장', place_id: 'hotplace_15', user_ratings_total: 432 }
    ],
    ishibashi_bunka: [
      { name: '브리지스톤 미술관', rating: 4.8, specialty: '현대 미술', address: '후쿠오카현 쿠루메시 노지마마치 1-3', place_id: 'hotplace_16', user_ratings_total: 1123 },
      { name: '문화회관', rating: 4.6, specialty: '공연장', address: '후쿠오카현 쿠루메시 롯폰마츠 2-8', place_id: 'hotplace_17', user_ratings_total: 654 },
      { name: '도서관', rating: 4.5, specialty: '시민 휴식처', address: '후쿠오카현 쿠루메시 혼마치 문화거리', place_id: 'hotplace_18', user_ratings_total: 321 }
    ]
  },
  kumamoto: {
    kumamoto_castle: [
      { name: '구마모토성 천수각', rating: 4.9, specialty: '일본 3대 명성', address: '쿠마모토현 쿠마모토시 주오구 혼마루 1-1', place_id: 'hotplace_19', user_ratings_total: 4321 },
      { name: '니노마루 공원', rating: 4.8, specialty: '성곽 정원', address: '쿠마모토현 쿠마모토시 주오구 혼마루', place_id: 'hotplace_20', user_ratings_total: 2876 },
      { name: '가토 기요마사 상', rating: 4.7, specialty: '역사 유적', address: '쿠마모토현 쿠마모토시 주오구 혼마루', place_id: 'hotplace_21', user_ratings_total: 1987 }
    ],
    suizenji: [
      { name: '스이젠지 조쥬엔', rating: 4.8, specialty: '전통 정원', address: '쿠마모토현 쿠마모토시 주오구 스이젠지공원 8-1', place_id: 'hotplace_22', user_ratings_total: 2543 },
      { name: '미니 후지산', rating: 4.7, specialty: '정원 조형물', address: '쿠마모토현 쿠마모토시 주오구 스이젠지공원', place_id: 'hotplace_23', user_ratings_total: 1654 },
      { name: '출수공원', rating: 4.6, specialty: '맑은 물', address: '쿠마모토현 쿠마모토시 주오구 스이젠지공원', place_id: 'hotplace_24', user_ratings_total: 1234 }
    ],
    aso_shrine: [
      { name: '아소 신사 본전', rating: 4.8, specialty: '화산 신앙', address: '쿠마모토현 아소시 이치노미야마치 미야지 3083-1', place_id: 'hotplace_25', user_ratings_total: 1987 },
      { name: '몬젠마치 거리', rating: 4.7, specialty: '전통 상점가', address: '쿠마모토현 아소시 이치노미야마치 몬젠', place_id: 'hotplace_26', user_ratings_total: 1432 },
      { name: '아소 농장랜드', rating: 4.6, specialty: '체험 목장', address: '쿠마모토현 아소군 아소마치 농장랜드', place_id: 'hotplace_27', user_ratings_total: 876 }
    ]
  },
  nagasaki: {
    glover_garden: [
      { name: '글로버 저택', rating: 4.9, specialty: '메이지 시대 양관', address: '나가사키현 나가사키시 미나미야마테마치 8-1', place_id: 'hotplace_28', user_ratings_total: 3654 },
      { name: '린거 하우스', rating: 4.8, specialty: '서양식 정원', address: '나가사키현 나가사키시 미나미야마테마치 글로버정원', place_id: 'hotplace_29', user_ratings_total: 2876 },
      { name: '알트 하우스', rating: 4.7, specialty: '나가사키 항구 전망', address: '나가사키현 나가사키시 미나미야마테마치 글로버정원', place_id: 'hotplace_30', user_ratings_total: 2341 }
    ],
    peace_park: [
      { name: '평화 기념상', rating: 4.8, specialty: '평화 기원상', address: '나가사키현 나가사키시 마츠야마마치 9', place_id: 'hotplace_31', user_ratings_total: 2765 },
      { name: '원폭 자료관', rating: 4.7, specialty: '역사 교육', address: '나가사키현 나가사키시 히라노마치 7-8', place_id: 'hotplace_32', user_ratings_total: 1987 },
      { name: '천학 기념관', rating: 4.6, specialty: '평화 학습', address: '나가사키현 나가사키시 마츠야마마치 평화공원', place_id: 'hotplace_33', user_ratings_total: 1654 }
    ],
    dejima: [
      { name: '데지마 와하란', rating: 4.8, specialty: '네덜란드 상관', address: '나가사키현 나가사키시 데지마마치 6-1', place_id: 'hotplace_34', user_ratings_total: 2234 },
      { name: '역사 박물관', rating: 4.7, specialty: '국제 교류사', address: '나가사키현 나가사키시 데지마마치 1-1', place_id: 'hotplace_35', user_ratings_total: 1876 },
      { name: '옛 거리 재현', rating: 4.6, specialty: '에도 시대 거리', address: '나가사키현 나가사키시 데지마마치', place_id: 'hotplace_36', user_ratings_total: 1432 }
    ]
  },
  sasebo: {
    kujukushima: [
      { name: '구주쿠시마 수족관', rating: 4.8, specialty: '해양 생물', address: '나가사키현 사세보시 카시마에초 1008', place_id: 'hotplace_37', user_ratings_total: 2876 },
      { name: '유람선 크루즈', rating: 4.7, specialty: '섬 투어', address: '나가사키현 사세보시 카시마에초 크루즈터미널', place_id: 'hotplace_38', user_ratings_total: 2341 },
      { name: '전망대', rating: 4.6, specialty: '99개 섬 조망', address: '나가사키현 사세보시 카시마에초 전망대', place_id: 'hotplace_39', user_ratings_total: 1987 }
    ],
    sasebo_navy: [
      { name: '해상자위대 기지', rating: 4.6, specialty: '해군 역사', address: '나가사키현 사세보시 건설통 해상자위대', place_id: 'hotplace_40', user_ratings_total: 1234 },
      { name: '마린 파크', rating: 4.5, specialty: '해안 공원', address: '나가사키현 사세보시 혼마치 해안가', place_id: 'hotplace_41', user_ratings_total: 987 },
      { name: '포트 사이드', rating: 4.4, specialty: '항구 구경', address: '나가사키현 사세보시 미나토마치 항구', place_id: 'hotplace_42', user_ratings_total: 765 }
    ],
    huis_ten_bosch: [
      { name: '하우스텐보스 궁전', rating: 4.9, specialty: '네덜란드 테마파크', address: '나가사키현 사세보시 하우스텐보스마치 1-1', place_id: 'hotplace_43', user_ratings_total: 4567 },
      { name: '일루미네이션', rating: 4.8, specialty: '야간 조명쇼', address: '나가사키현 사세보시 하우스텐보스마치', place_id: 'hotplace_44', user_ratings_total: 3876 },
      { name: '꽃 정원', rating: 4.7, specialty: '계절 꽃축제', address: '나가사키현 사세보시 하우스텐보스마치 정원', place_id: 'hotplace_45', user_ratings_total: 2987 }
    ]
  },
  oita: {
    beppu_onsen: [
      { name: '지고쿠 온천 순례', rating: 4.9, specialty: '8개 지옥 온천', address: '오이타현 별부시 간나와 지고쿠온천', place_id: 'hotplace_46', user_ratings_total: 4321 },
      { name: '별부 타워', rating: 4.7, specialty: '온천가 전망', address: '오이타현 별부시 쇼닌지 10-2', place_id: 'hotplace_47', user_ratings_total: 2654 },
      { name: '우미지고쿠', rating: 4.8, specialty: '바다 지옥', address: '오이타현 별부시 간나와 559-1', place_id: 'hotplace_48', user_ratings_total: 3456 }
    ],
    yufuin: [
      { name: '유후다케 산', rating: 4.8, specialty: '산 전망대', address: '오이타현 유후시 유후인마치 유후다케', place_id: 'hotplace_49', user_ratings_total: 2876 },
      { name: '유노츠보 거리', rating: 4.7, specialty: '온천가 쇼핑', address: '오이타현 유후시 유후인마치 카와카미 유노츠보거리', place_id: 'hotplace_50', user_ratings_total: 2543 },
      { name: '킨린코 호수', rating: 4.6, specialty: '신비로운 호수', address: '오이타현 유후시 유후인마치 카와카미 킨린코', place_id: 'hotplace_51', user_ratings_total: 1987 }
    ],
    usuki: [
      { name: '우스키 마애불', rating: 4.8, specialty: '국보 석불군', address: '오이타현 우스키시 후카타 4조 마애불군', place_id: 'hotplace_52', user_ratings_total: 1876 },
      { name: '혼잔지', rating: 4.6, specialty: '역사적 사찰', address: '오이타현 우스키시 후카타 혼잔지', place_id: 'hotplace_53', user_ratings_total: 1234 },
      { name: '우스키 성터', rating: 4.5, specialty: '성곽 유적', address: '오이타현 우스키시 우스키 성터공원', place_id: 'hotplace_54', user_ratings_total: 987 }
    ]
  }
};

// Mock API 함수
export const searchHotplaces = async (cityId, hotplaceType) => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  try {
    const cityData = MOCK_HOTPLACES[cityId];
    if (!cityData || !cityData[hotplaceType]) {
      return [];
    }
    
    const hotplaces = cityData[hotplaceType];
    // 평점순으로 정렬
    return hotplaces.sort((a, b) => b.rating - a.rating);
    
  } catch (error) {
    console.error('Mock Hotplace API Error:', error);
    throw new Error('핫플 검색 중 오류가 발생했습니다.');
  }
};

// 구글맵 URL 생성 (Mock 데이터는 모두 검색 쿼리 사용)
export const generateGoogleMapsUrl = (hotplace, cityName) => {
  // Mock 데이터인 경우 또는 실제 place_id가 없는 경우 검색 쿼리 사용
  if (!hotplace.place_id || hotplace.place_id.startsWith('hotplace_')) {
    const query = encodeURIComponent(`${hotplace.name} ${hotplace.address} ${cityName} 일본`);
    return `https://www.google.com/maps/search/${query}`;
  }
  
  // 실제 place_id가 있는 경우에만 place_id 사용
  return `https://www.google.com/maps/place/?q=place_id:${hotplace.place_id}`;
}; 