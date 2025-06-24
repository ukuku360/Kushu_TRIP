export const kyushuData = {
  fukuoka: {
    id: 'fukuoka',
    name: '후쿠오카',
    position: { x: 220, y: 80 },
    color: '#ff6b6b',
    foods: {
      ramen: {
        name: '하카타 라멘',
        emoji: '🍜',
        restaurants: [
          { name: '이치난 라멘', rating: 4.8, specialty: '톤코츠 라멘' },
          { name: '이프푸도', rating: 4.7, specialty: '원조 하카타 라멘' },
          { name: '메냐 사카이', rating: 4.6, specialty: '진한 톤코츠' }
        ]
      },
      mentaiko: {
        name: '멘타이코',
        emoji: '🌶️',
        restaurants: [
          { name: '후쿠타로', rating: 4.9, specialty: '명란젓 전문점' },
          { name: '야마야', rating: 4.7, specialty: '명란젓 오니기리' },
          { name: '가네후쿠', rating: 4.5, specialty: '명란젓 선물세트' }
        ]
      },
      motsunabe: {
        name: '모츠나베',
        emoji: '🍲',
        restaurants: [
          { name: '야마쇼', rating: 4.8, specialty: '전통 모츠나베' },
          { name: '모츠나베 타케', rating: 4.6, specialty: '간장 베이스' },
          { name: '하카타 모츠나베', rating: 4.7, specialty: '미소 베이스' }
        ]
      }
    },
    hotplaces: {
      ohori_park: {
        name: '오호리공원',
        emoji: '🌸',
        spots: [
          { name: '오호리공원 일본정원', rating: 4.8, specialty: '전통 일본 정원' },
          { name: '오호리공원 벚꽃길', rating: 4.7, specialty: '벚꽃 명소' },
          { name: '오호리공원 보트하우스', rating: 4.6, specialty: '호수 보트 체험' }
        ]
      },
      dazaifu: {
        name: '다자이후',
        emoji: '⛩️',
        spots: [
          { name: '다자이후 텐만구', rating: 4.9, specialty: '학문의 신' },
          { name: '다자이후 국립박물관', rating: 4.8, specialty: '규슈 역사' },
          { name: '가멘지절', rating: 4.7, specialty: '정토 정원' }
        ]
      },
      canal_city: {
        name: '캐널시티',
        emoji: '🛍️',
        spots: [
          { name: '캐널시티 하카타', rating: 4.8, specialty: '쇼핑몰 분수쇼' },
          { name: '라멘 스타디움', rating: 4.7, specialty: '라멘 푸드코트' },
          { name: '유니클로 플래그십', rating: 4.6, specialty: '최대 규모 유니클로' }
        ]
      }
    }
  },
  kurume: {
    id: 'kurume',
    name: '쿠루메',
    position: { x: 240, y: 150 },
    color: '#4ecdc4',
    foods: {
      yakitori: {
        name: '야키토리',
        emoji: '🍗',
        restaurants: [
          { name: '다이젠', rating: 4.9, specialty: '쿠루메식 야키토리' },
          { name: '토리신', rating: 4.8, specialty: '숯불 구이' },
          { name: '야키토리 마츠야', rating: 4.7, specialty: '비밀 소스' }
        ]
      },
      ramen: {
        name: '쿠루메 라멘',
        emoji: '🍜',
        restaurants: [
          { name: '미나미 긴류', rating: 4.8, specialty: '톤코츠 원조' },
          { name: '오모가에리', rating: 4.7, specialty: '진한 스프' },
          { name: '라멘 요코쵸', rating: 4.6, specialty: '전통 맛' }
        ]
      },
      udon: {
        name: '우동',
        emoji: '🍲',
        restaurants: [
          { name: '마루호시', rating: 4.7, specialty: '쫄깃한 면발' },
          { name: '우동 스키', rating: 4.6, specialty: '맑은 국물' },
          { name: '테우치 우동', rating: 4.5, specialty: '수제 우동' }
        ]
      }
    },
    hotplaces: {
      inari_shrine: {
        name: '이나리 신사',
        emoji: '⛩️',
        spots: [
          { name: '쿠루메 스이텐구', rating: 4.8, specialty: '연애성취 신사' },
          { name: '이나리 산책로', rating: 4.7, specialty: '산책로' },
          { name: '신사 축제장', rating: 4.6, specialty: '계절 축제' }
        ]
      },
      chikugo_river: {
        name: '치쿠고강',
        emoji: '🌊',
        spots: [
          { name: '치쿠고강 리버파크', rating: 4.7, specialty: '강변 공원' },
          { name: '유카타가와 하천부지', rating: 4.6, specialty: '바베큐장' },
          { name: '치쿠고강 불꽃축제장', rating: 4.5, specialty: '여름 축제' }
        ]
      },
      ishibashi_bunka: {
        name: '이시바시 문화센터',
        emoji: '🎭',
        spots: [
          { name: '브리지스톤 미술관', rating: 4.8, specialty: '현대 미술' },
          { name: '문화회관', rating: 4.6, specialty: '공연장' },
          { name: '도서관', rating: 4.5, specialty: '시민 휴식처' }
        ]
      }
    }
  },
  kumamoto: {
    id: 'kumamoto',
    name: '구마모토',
    position: { x: 220, y: 250 },
    color: '#a8e6cf',
    foods: {
      basashi: {
        name: '바사시',
        emoji: '🐎',
        restaurants: [
          { name: '스가노야', rating: 4.9, specialty: '최고급 말고기' },
          { name: '바사시 전문점', rating: 4.7, specialty: '신선한 말 회' },
          { name: '구마모토야', rating: 4.6, specialty: '전통 바사시' }
        ]
      },
      tonkotsu: {
        name: '구마모토 라멘',
        emoji: '🍜',
        restaurants: [
          { name: '구마모토 라멘관', rating: 4.8, specialty: '마늘 토핑' },
          { name: '아지센', rating: 4.7, specialty: '진한 국물' },
          { name: '류라멘', rating: 4.6, specialty: '구마모토식 차슈' }
        ]
      },
      karashi: {
        name: '카라시 연근',
        emoji: '🌿',
        restaurants: [
          { name: '로컨 전문점', rating: 4.8, specialty: '매운 연근 요리' },
          { name: '구마모토 전통식당', rating: 4.7, specialty: '현지식 카라시' },
          { name: '연근마을', rating: 4.5, specialty: '연근 코스' }
        ]
      }
    },
    hotplaces: {
      kumamoto_castle: {
        name: '구마모토성',
        emoji: '🏯',
        spots: [
          { name: '구마모토성 천수각', rating: 4.9, specialty: '일본 3대 명성' },
          { name: '니노마루 공원', rating: 4.8, specialty: '성곽 정원' },
          { name: '가토 기요마사 상', rating: 4.7, specialty: '역사 유적' }
        ]
      },
      suizenji: {
        name: '스이젠지 정원',
        emoji: '🌸',
        spots: [
          { name: '스이젠지 조쥬엔', rating: 4.8, specialty: '전통 정원' },
          { name: '미니 후지산', rating: 4.7, specialty: '정원 조형물' },
          { name: '출수공원', rating: 4.6, specialty: '맑은 물' }
        ]
      },
      aso_shrine: {
        name: '아소 신사',
        emoji: '⛩️',
        spots: [
          { name: '아소 신사 본전', rating: 4.8, specialty: '화산 신앙' },
          { name: '몬젠마치 거리', rating: 4.7, specialty: '전통 상점가' },
          { name: '아소 농장랜드', rating: 4.6, specialty: '체험 목장' }
        ]
      }
    }
  },
  nagasaki: {
    id: 'nagasaki',
    name: '나가사키',
    position: { x: 80, y: 240 },
    color: '#ffe66d',
    foods: {
      champon: {
        name: '짬뽕',
        emoji: '🍲',
        restaurants: [
          { name: '시카이로', rating: 4.9, specialty: '원조 짬뽕' },
          { name: '코자이켄', rating: 4.8, specialty: '해산물 짬뽕' },
          { name: '멘바카 이치다이', rating: 4.7, specialty: '매운 짬뽕' }
        ]
      },
      sara_udon: {
        name: '사라우동',
        emoji: '🍜',
        restaurants: [
          { name: '메이카엔', rating: 4.8, specialty: '파삭한 면' },
          { name: '긴레이', rating: 4.7, specialty: '야채 사라우동' },
          { name: '호라이', rating: 4.6, specialty: '해산물 사라우동' }
        ]
      },
      kasutera: {
        name: '카스테라',
        emoji: '🍰',
        restaurants: [
          { name: '후쿠사야', rating: 4.9, specialty: '원조 카스테라' },
          { name: '쇼켄도', rating: 4.8, specialty: '꿀 카스테라' },
          { name: '린가', rating: 4.7, specialty: '초콜릿 카스테라' }
        ]
      }
    },
    hotplaces: {
      glover_garden: {
        name: '글로버 정원',
        emoji: '🌹',
        spots: [
          { name: '글로버 저택', rating: 4.9, specialty: '메이지 시대 양관' },
          { name: '린거 하우스', rating: 4.8, specialty: '서양식 정원' },
          { name: '알트 하우스', rating: 4.7, specialty: '나가사키 항구 전망' }
        ]
      },
      peace_park: {
        name: '평화공원',
        emoji: '🕊️',
        spots: [
          { name: '평화 기념상', rating: 4.8, specialty: '평화 기원상' },
          { name: '원폭 자료관', rating: 4.7, specialty: '역사 교육' },
          { name: '천학 기념관', rating: 4.6, specialty: '평화 학습' }
        ]
      },
      dejima: {
        name: '데지마',
        emoji: '🏛️',
        spots: [
          { name: '데지마 와하란', rating: 4.8, specialty: '네덜란드 상관' },
          { name: '역사 박물관', rating: 4.7, specialty: '국제 교류사' },
          { name: '옛 거리 재현', rating: 4.6, specialty: '에도 시대 거리' }
        ]
      }
    }
  },
  sasebo: {
    id: 'sasebo',
    name: '사세보',
    position: { x: 60, y: 150 },
    color: '#f093fb',
    foods: {
      burger: {
        name: '사세보 버거',
        emoji: '🍔',
        restaurants: [
          { name: '빅맨', rating: 4.9, specialty: '원조 사세보 버거' },
          { name: '러키즈', rating: 4.8, specialty: '수제 패티' },
          { name: '로그킷', rating: 4.7, specialty: '아메리칸 스타일' }
        ]
      },
      kujira: {
        name: '고래고기',
        emoji: '🐋',
        restaurants: [
          { name: '쿠지라야', rating: 4.8, specialty: '고래 스테이크' },
          { name: '미나토', rating: 4.7, specialty: '고래 회' },
          { name: '전통 해산물', rating: 4.6, specialty: '고래 나베' }
        ]
      },
      oyster: {
        name: '굴 요리',
        emoji: '🦪',
        restaurants: [
          { name: '규슈 굴집', rating: 4.7, specialty: '구이 굴' },
          { name: '바다의 집', rating: 4.6, specialty: '굴 라멘' },
          { name: '굴 전문점', rating: 4.5, specialty: '굴 프라이' }
        ]
      }
    },
    hotplaces: {
      kujukushima: {
        name: '구주쿠시마',
        emoji: '🏝️',
        spots: [
          { name: '구주쿠시마 수족관', rating: 4.8, specialty: '해양 생물' },
          { name: '유람선 크루즈', rating: 4.7, specialty: '섬 투어' },
          { name: '전망대', rating: 4.6, specialty: '99개 섬 조망' }
        ]
      },
      sasebo_navy: {
        name: '사세보 해군',
        emoji: '⚓',
        spots: [
          { name: '해상자위대 기지', rating: 4.6, specialty: '해군 역사' },
          { name: '마린 파크', rating: 4.5, specialty: '해안 공원' },
          { name: '포트 사이드', rating: 4.4, specialty: '항구 구경' }
        ]
      },
      huis_ten_bosch: {
        name: '하우스텐보스',
        emoji: '🎡',
        spots: [
          { name: '하우스텐보스 궁전', rating: 4.9, specialty: '네덜란드 테마파크' },
          { name: '일루미네이션', rating: 4.8, specialty: '야간 조명쇼' },
          { name: '꽃 정원', rating: 4.7, specialty: '계절 꽃축제' }
        ]
      }
    }
  },
  oita: {
    id: 'oita',
    name: '오이타',
    position: { x: 350, y: 160 },
    color: '#ffb3ba',
    foods: {
      bungo_beef: {
        name: '분고규',
        emoji: '🥩',
        restaurants: [
          { name: '분고야', rating: 4.9, specialty: '분고규 스테이크' },
          { name: '오이타 야키니쿠', rating: 4.8, specialty: '분고규 바베큐' },
          { name: '니쿠도코로', rating: 4.7, specialty: '분고규 스키야키' }
        ]
      },
      jigoku_mushi: {
        name: '지고쿠무시',
        emoji: '♨️',
        restaurants: [
          { name: '지고쿠무시 공방', rating: 4.8, specialty: '온천 찜 요리' },
          { name: '별부 온천', rating: 4.7, specialty: '야채 지고쿠무시' },
          { name: '유후인 찜집', rating: 4.6, specialty: '해산물 지고쿠무시' }
        ]
      },
      fugu: {
        name: '복어요리',
        emoji: '🐡',
        restaurants: [
          { name: '후구야', rating: 4.9, specialty: '복어 회' },
          { name: '텟사야', rating: 4.8, specialty: '복어 찌개' },
          { name: '우스키 후구', rating: 4.7, specialty: '복어 코스' }
        ]
      }
    }
  },
  saga: {
    id: 'saga',
    name: '사가',
    position: { x: 130, y: 130 },
    color: '#bae1ff',
    foods: {
      saga_beef: {
        name: '사가규',
        emoji: '🥩',
        restaurants: [
          { name: '사가규 본점', rating: 4.9, specialty: '최고급 사가규' },
          { name: '규카츠', rating: 4.8, specialty: '사가규 까츠' },
          { name: '야키니쿠 사가', rating: 4.7, specialty: '사가규 바베큐' }
        ]
      },
      yobuko_squid: {
        name: '요부코 오징어',
        emoji: '🦑',
        restaurants: [
          { name: '이카야', rating: 4.9, specialty: '살아있는 오징어 회' },
          { name: '요부코 시장', rating: 4.8, specialty: '투명 오징어' },
          { name: '오징어 전문점', rating: 4.7, specialty: '오징어 덮밥' }
        ]
      },
      gagyudon: {
        name: '가규동',
        emoji: '🍚',
        restaurants: [
          { name: '규동야', rating: 4.8, specialty: '사가규 덮밥' },
          { name: '돈부리 하우스', rating: 4.7, specialty: '특제 가규동' },
          { name: '미소시루야', rating: 4.6, specialty: '가규동 정식' }
        ]
      }
    },
    hotplaces: {
      yoshinogari: {
        name: '요시노가리 유적',
        emoji: '🏛️',
        spots: [
          { name: '요시노가리 역사공원', rating: 4.8, specialty: '야요이 시대 유적' },
          { name: '고대 마을 복원지', rating: 4.7, specialty: '역사 체험' },
          { name: '박물관', rating: 4.6, specialty: '고고학 자료' }
        ]
      },
      arita: {
        name: '아리타 도자기마을',
        emoji: '🏺',
        spots: [
          { name: '아리타 도자기관', rating: 4.8, specialty: '전통 도자기' },
          { name: '도자기 공방거리', rating: 4.7, specialty: '수제 도자기' },
          { name: '토야마 신사', rating: 4.6, specialty: '도자기 신사' }
        ]
      },
      karatsu: {
        name: '가라츠성',
        emoji: '🏯',
        spots: [
          { name: '가라츠성', rating: 4.8, specialty: '해안가 성곽' },
          { name: '마츠바라 해변', rating: 4.7, specialty: '소나무 해변' },
          { name: '구묘진 해변', rating: 4.6, specialty: '해수욕장' }
        ]
      }
    }
  },
  oita: {
    id: 'oita',
    name: '오이타',
    position: { x: 280, y: 200 },
    color: '#ffd93d',
    foods: {
      bungo_beef: {
        name: '분고규',
        emoji: '🥩',
        restaurants: [
          { name: '분고규 명가', rating: 4.9, specialty: '최고급 분고규' },
          { name: '오이타 스테이크', rating: 4.8, specialty: '분고규 스테이크' },
          { name: '규우나베 전문점', rating: 4.7, specialty: '소고기 전골' }
        ]
      },
      jigoku_mushi: {
        name: '지옥찜',
        emoji: '♨️',
        restaurants: [
          { name: '지옥찜 공방', rating: 4.8, specialty: '온천 지열 요리' },
          { name: '별부 지옥찜', rating: 4.7, specialty: '전통 지열 요리' },
          { name: '온천 요리집', rating: 4.6, specialty: '지열 조리법' }
        ]
      },
      dango: {
        name: '단고',
        emoji: '🍡',
        restaurants: [
          { name: '야키단고 명가', rating: 4.7, specialty: '구운 단고' },
          { name: '오이타 단고집', rating: 4.6, specialty: '수제 단고' },
          { name: '전통 과자점', rating: 4.5, specialty: '단고 전문' }
        ]
      }
    },
    hotplaces: {
      beppu_onsen: {
        name: '별부 온천',
        emoji: '♨️',
        spots: [
          { name: '지고쿠 온천 순례', rating: 4.9, specialty: '8개 지옥 온천' },
          { name: '별부 타워', rating: 4.7, specialty: '온천가 전망' },
          { name: '우미지고쿠', rating: 4.8, specialty: '바다 지옥' }
        ]
      },
      yufuin: {
        name: '유후인',
        emoji: '🏔️',
        spots: [
          { name: '유후다케 산', rating: 4.8, specialty: '산 전망대' },
          { name: '유노츠보 거리', rating: 4.7, specialty: '온천가 쇼핑' },
          { name: '킨린코 호수', rating: 4.6, specialty: '신비로운 호수' }
        ]
      },
      usuki: {
        name: '우스키 석불',
        emoji: '🗿',
        spots: [
          { name: '우스키 마애불', rating: 4.8, specialty: '국보 석불군' },
          { name: '혼잔지', rating: 4.6, specialty: '역사적 사찰' },
          { name: '우스키 성터', rating: 4.5, specialty: '성곽 유적' }
        ]
      }
    }
  }
};

export const transportData = {
  'fukuoka-saga': {
    distance: '60km',
    options: [
      {
        type: '기차',
        name: 'JR 카라츠선',
        duration: '1시간 10분',
        price: '¥770',
        frequency: '30분마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '버스',
        name: '니시테츠 버스',
        duration: '1시간 20분',
        price: '¥550',
        frequency: '15분마다',
        bookingUrl: 'https://www.nishitetsu.jp'
      },
      {
        type: '자동차',
        name: '일반도로',
        duration: '1시간',
        price: '¥300 (톨게이트)',
        frequency: '언제든지',
        bookingUrl: null
      }
    ]
  },
  'fukuoka-kurume': {
    distance: '40km',
    options: [
      {
        type: '기차',
        name: 'JR 카고시마 본선',
        duration: '35분',
        price: '¥620',
        frequency: '20분마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '기차',
        name: '니시테츠 전철',
        duration: '30분',
        price: '¥400',
        frequency: '10분마다',
        bookingUrl: 'https://www.nishitetsu.jp'
      },
      {
        type: '버스',
        name: '니시테츠 고속버스',
        duration: '50분',
        price: '¥480',
        frequency: '30분마다',
        bookingUrl: 'https://www.nishitetsu.jp'
      }
    ]
  },
  'fukuoka-kumamoto': {
    distance: '110km',
    options: [
      {
        type: '신칸센',
        name: '큐슈 신칸센',
        duration: '35분',
        price: '¥4,610',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '히토츠바시 고속버스',
        duration: '2시간 20분',
        price: '¥2,060',
        frequency: '30분마다',
        bookingUrl: 'https://www.kyusanko.co.jp'
      },
      {
        type: '자동차',
        name: '큐슈 자동차도',
        duration: '1시간 30분',
        price: '¥2,380 (고속도로비)',
        frequency: '언제든지',
        bookingUrl: null
      }
    ]
  },
  'fukuoka-oita': {
    distance: '120km',
    options: [
      {
        type: '기차',
        name: 'JR 니치난선',
        duration: '2시간 30분',
        price: '¥2,310',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '토요 버스',
        duration: '2시간 15분',
        price: '¥2,500',
        frequency: '1시간마다',
        bookingUrl: 'https://www.toyobus.jp'
      },
      {
        type: '자동차',
        name: '오이타 자동차도',
        duration: '1시간 50분',
        price: '¥2,800 (고속도로비)',
        frequency: '언제든지',
        bookingUrl: null
      }
    ]
  },
  'saga-kurume': {
    distance: '35km',
    options: [
      {
        type: '기차',
        name: 'JR 카고시마 본선',
        duration: '30분',
        price: '¥500',
        frequency: '20분마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '버스',
        name: '니시테츠 버스',
        duration: '45분',
        price: '¥380',
        frequency: '30분마다',
        bookingUrl: 'https://www.nishitetsu.jp'
      }
    ]
  },
  'saga-sasebo': {
    distance: '55km',
    options: [
      {
        type: '기차',
        name: 'JR 사세보선',
        duration: '1시간 20분',
        price: '¥1,020',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '버스',
        name: '사세보 버스',
        duration: '1시간 30분',
        price: '¥750',
        frequency: '1시간마다',
        bookingUrl: 'https://www.sasebo-bus.jp'
      }
    ]
  },
  'sasebo-nagasaki': {
    distance: '60km',
    options: [
      {
        type: '기차',
        name: 'JR 오무라선',
        duration: '1시간 30분',
        price: '¥1,170',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '나가사키 현 버스',
        duration: '1시간 15분',
        price: '¥960',
        frequency: '30분마다',
        bookingUrl: 'https://www.nagasakibus.jp'
      }
    ]
  },
  'kurume-kumamoto': {
    distance: '75km',
    options: [
      {
        type: '신칸센',
        name: '큐슈 신칸센',
        duration: '15분',
        price: '¥3,080',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '기차',
        name: 'JR 카고시마 본선',
        duration: '1시간 45분',
        price: '¥1,320',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '큐산코 버스',
        duration: '1시간 30분',
        price: '¥1,150',  
        frequency: '45분마다',
        bookingUrl: 'https://www.kyusanko.co.jp'
      }
    ]
  },
  'kumamoto-oita': {
    distance: '90km',
    options: [
      {
        type: '기차',
        name: 'JR 호히선',
        duration: '2시간 30분',
        price: '¥1,980',
        frequency: '2시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '큐산코 횡단 버스',
        duration: '2시간 15분',
        price: '¥2,200',
        frequency: '1시간마다',
        bookingUrl: 'https://www.kyusanko.co.jp'
      },
      {
        type: '자동차',
        name: '큐슈 횡단도로',
        duration: '1시간 45분',
        price: '¥2,100 (고속도로비)',
        frequency: '언제든지',
        bookingUrl: null
      }
    ]
  },
  'kumamoto-nagasaki': {
    distance: '120km', 
    options: [
      {
        type: '기차',
        name: 'JR 카고시마 본선',
        duration: '2시간 45분',
        price: '¥2,640',
        frequency: '2시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '큐산코 고속버스',
        duration: '2시간 30분',
        price: '¥2,400',
        frequency: '1시간마다',
        bookingUrl: 'https://www.kyusanko.co.jp'
      }
    ]
  },
  'fukuoka-nagasaki': {
    distance: '150km',
    options: [
      {
        type: '기차',
        name: 'JR 나가사키 본선',
        duration: '2시간',
        price: '¥2,270',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '큐산코 고속버스',
        duration: '2시간 30분',
        price: '¥2,060',
        frequency: '30분마다',
        bookingUrl: 'https://www.kyusanko.co.jp'
      },
      {
        type: '자동차',
        name: '나가사키 자동차도',
        duration: '2시간 15분',
        price: '¥2,780 (고속도로비)',
        frequency: '언제든지',
        bookingUrl: null
      }
    ]
  },
  'fukuoka-sasebo': {
    distance: '100km',
    options: [
      {
        type: '기차',
        name: 'JR 사세보선',
        duration: '1시간 50분',
        price: '¥1,690',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '사세보 고속버스',
        duration: '1시간 45분',
        price: '¥1,380',
        frequency: '45분마다',
        bookingUrl: 'https://www.sasebo-bus.jp'
      }
    ]
  },
  'oita-sasebo': {
    distance: '180km',
    options: [
      {
        type: '기차',
        name: 'JR 규슈 횡단',
        duration: '3시간 30분',
        price: '¥3,240',
        frequency: '2시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '규슈 횡단 버스',
        duration: '3시간 15분',
        price: '¥2,980',
        frequency: '1일 3회',
        bookingUrl: 'https://www.kyusanko.co.jp'
      }
    ]
  },
  'oita-nagasaki': {
    distance: '200km',
    options: [
      {
        type: '기차',
        name: 'JR 규슈 횡단',
        duration: '4시간',
        price: '¥3,780',
        frequency: '2시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '규슈 횡단 고속버스',
        duration: '3시간 45분',
        price: '¥3,200',
        frequency: '1일 2회',
        bookingUrl: 'https://www.kyusanko.co.jp'
      }
    ]
  },
  'oita-saga': {
    distance: '140km',
    options: [
      {
        type: '기차',
        name: 'JR 규슈 횡단',
        duration: '2시간 45분',
        price: '¥2,580',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '규슈 횡단 버스',
        duration: '2시간 30분',
        price: '¥2,200',
        frequency: '1시간마다',
        bookingUrl: 'https://www.kyusanko.co.jp'
      }
    ]
  },
  'kurume-nagasaki': {
    distance: '140km',
    options: [
      {
        type: '기차',
        name: 'JR 카고시마 본선 → JR 나가사키 본선',
        duration: '2시간 30분',
        price: '¥2,390',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '큐산코 고속버스',
        duration: '2시간 15분',
        price: '¥1,950',
        frequency: '1시간마다',
        bookingUrl: 'https://www.kyusanko.co.jp'
      }
    ]
  },
  'kurume-sasebo': {
    distance: '120km',
    options: [
      {
        type: '기차',
        name: 'JR 카고시마 본선 → JR 사세보선',
        duration: '2시간 10분',
        price: '¥1,890',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '버스',
        name: '니시테츠 고속버스',
        duration: '1시간 50분',
        price: '¥1,480',
        frequency: '1시간마다',
        bookingUrl: 'https://www.nishitetsu.jp'
      }
    ]
  },
  'kurume-oita': {
    distance: '85km',
    options: [
      {
        type: '기차',
        name: 'JR 큐다이 본선',
        duration: '1시간 45분',
        price: '¥1,520',
        frequency: '1시간마다',
        bookingUrl: 'https://www.jrkyushu.co.jp'
      },
      {
        type: '고속버스',
        name: '큐산코 고속버스',
        duration: '1시간 30분',
        price: '¥1,200',
        frequency: '1시간마다',
        bookingUrl: 'https://www.kyusanko.co.jp'
      },
      {
        type: '자동차',
        name: '대분 자동차도',
        duration: '1시간 15분',
        price: '¥1,850 (고속도로비)',
        frequency: '언제든지',
        bookingUrl: null
      }
    ]
  }
}; 