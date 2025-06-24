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