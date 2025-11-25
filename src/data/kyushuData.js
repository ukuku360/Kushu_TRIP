export const kyushuData = {
  fukuoka: {
    id: 'fukuoka',
    name: '후쿠오카',
    position: { x: 220, y: 80 },
    color: '#ff6b6b',
    foods: {
      ramen: {
        name: 'はかたラーメン(하카타 라멘)',
        emoji: '🍜',
        restaurants: [
          { name: '一蘭(이치란)', rating: 4.8, specialty: '톤코츠 라멘' },
          { name: '一風堂(이프푸도)', rating: 4.7, specialty: '원조 하카타 라멘' },
          { name: '麺屋 七彩(메냐 나나이로)', rating: 4.6, specialty: '진한 톤코츠' }
        ]
      },
      mentaiko: {
        name: 'めんたいこ(멘타이코)',
        emoji: '🌶️',
        restaurants: [
          { name: 'ふくや(후쿠타로)', rating: 4.9, specialty: '명란젓 전문점' },
          { name: 'やまや(야마야)', rating: 4.7, specialty: '명란젓 오니기리' },
          { name: 'かねふく(가네후쿠)', rating: 4.5, specialty: '명란젓 선물세트' }
        ]
      },
      motsunabe: {
        name: 'もつ鍋(모츠나베)',
        emoji: '🍲',
        restaurants: [
          { name: 'やま中(야마쇼)', rating: 4.8, specialty: '전통 모츠나베' },
          { name: 'もつ鍋 たけ(모츠나베 타케)', rating: 4.6, specialty: '간장 베이스' },
          { name: '博多 もつ鍋(하카타 모츠나베)', rating: 4.7, specialty: '미소 베이스' }
        ]
      }
    },
    hotplaces: {
      ohori_park: {
        name: '大濠公園(오호리공원)',
        emoji: '🌸',
        spots: [
          { name: '大濠公園 日本庭園(오호리공원 일본정원)', rating: 4.8, specialty: '전통 일본 정원' },
          { name: '大濠公園 桜並木(오호리공원 벚꽃길)', rating: 4.7, specialty: '벚꽃 명소' },
          { name: '大濠公園 ボートハウス(오호리공원 보트하우스)', rating: 4.6, specialty: '호수 보트 체험' }
        ]
      },
      dazaifu: {
        name: '太宰府(다자이후)',
        emoji: '⛩️',
        spots: [
          { name: '太宰府天満宮(다자이후 텐만구)', rating: 4.9, specialty: '학문의 신' },
          { name: '九州国立博物館(규슈 국립박물관)', rating: 4.8, specialty: '규슈 역사' },
          { name: '光明禅寺(고묘젠지)', rating: 4.7, specialty: '정토 정원' }
        ]
      },
      canal_city: {
        name: 'キャナルシティ(캐널시티)',
        emoji: '🛍️',
        spots: [
          { name: 'キャナルシティ博多(캐널시티 하카타)', rating: 4.8, specialty: '쇼핑몰 분수쇼' },
          { name: 'ラーメンスタジアム(라멘 스타디움)', rating: 4.7, specialty: '라멘 푸드코트' },
          { name: 'ユニクロ フラッグシップ(유니클로 플래그십)', rating: 4.6, specialty: '최대 규모 유니클로' }
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
        name: '焼き鳥(야키토리)',
        emoji: '🍗',
        restaurants: [
          { name: '大善(다이젠)', rating: 4.9, specialty: '쿠루메식 야키토리' },
          { name: '鳥心(토리신)', rating: 4.8, specialty: '숯불 구이' },
          { name: '焼き鳥 松屋(야키토리 마츠야)', rating: 4.7, specialty: '비밀 소스' }
        ]
      },
      ramen: {
        name: '久留米ラーメン(쿠루메 라멘)',
        emoji: '🍜',
        restaurants: [
          { name: '南京千両(남킨센료)', rating: 4.8, specialty: '톤코츠 원조' },
          { name: 'おもがえり(오모가에리)', rating: 4.7, specialty: '진한 스프' },
          { name: 'ラーメン横町(라멘 요코쵸)', rating: 4.6, specialty: '전통 맛' }
        ]
      },
      udon: {
        name: 'うどん(우동)',
        emoji: '🍲',
        restaurants: [
          { name: '丸星(마루호시)', rating: 4.7, specialty: '쫄깃한 면발' },
          { name: 'うどん好き(우동 스키)', rating: 4.6, specialty: '맑은 국물' },
          { name: '手打ちうどん(테우치 우동)', rating: 4.5, specialty: '수제 우동' }
        ]
      }
    },
    hotplaces: {
      inari_shrine: {
        name: '稲荷神社(이나리 신사)',
        emoji: '⛩️',
        spots: [
          { name: '久留米水天宮(쿠루메 스이텐구)', rating: 4.8, specialty: '연애성취 신사' },
          { name: '稲荷散歩道(이나리 산책로)', rating: 4.7, specialty: '산책로' },
          { name: '神社祭り場(신사 축제장)', rating: 4.6, specialty: '계절 축제' }
        ]
      },
      chikugo_river: {
        name: '筑後川(치쿠고강)',
        emoji: '🌊',
        spots: [
          { name: '筑後川リバーパーク(치쿠고강 리버파크)', rating: 4.7, specialty: '강변 공원' },
          { name: '浴心川河川敷(유카타가와 하천부지)', rating: 4.6, specialty: '바베큐장' },
          { name: '筑後川花火大会会場(치쿠고강 불꽃축제장)', rating: 4.5, specialty: '여름 축제' }
        ]
      },
      ishibashi_bunka: {
        name: '石橋文化センター(이시바시 문화센터)',
        emoji: '🎭',
        spots: [
          { name: 'ブリヂストン美術館(브리지스톤 미술관)', rating: 4.8, specialty: '현대 미술' },
          { name: '文化会館(문화회관)', rating: 4.6, specialty: '공연장' },
          { name: '図書館(도서관)', rating: 4.5, specialty: '시민 휴식처' }
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
        name: '馬刺し(바사시)',
        emoji: '🐎',
        restaurants: [
          { name: '菅乃屋(스가노야)', rating: 4.9, specialty: '최고급 말고기' },
          { name: '馬刺し専門店(바사시 전문점)', rating: 4.7, specialty: '신선한 말 회' },
          { name: '熊本屋(구마모토야)', rating: 4.6, specialty: '전통 바사시' }
        ]
      },
      tonkotsu: {
        name: '熊本ラーメン(구마모토 라멘)',
        emoji: '🍜',
        restaurants: [
          { name: '熊本ラーメン館(구마모토 라멘관)', rating: 4.8, specialty: '마늘 토핑' },
          { name: '味千(아지센)', rating: 4.7, specialty: '진한 국물' },
          { name: '龍ラーメン(류라멘)', rating: 4.6, specialty: '구마모토식 차슈' }
        ]
      },
      karashi: {
        name: 'からし蓮根(카라시 연근)',
        emoji: '🌿',
        restaurants: [
          { name: '蓮根専門店(로컨 전문점)', rating: 4.8, specialty: '매운 연근 요리' },
          { name: '熊本伝統食堂(구마모토 전통식당)', rating: 4.7, specialty: '현지식 카라시' },
          { name: '蓮根村(연근마을)', rating: 4.5, specialty: '연근 코스' }
        ]
      }
    },
    hotplaces: {
      kumamoto_castle: {
        name: '熊本城(구마모토성)',
        emoji: '🏯',
        spots: [
          { name: '熊本城天守閣(구마모토성 천수각)', rating: 4.9, specialty: '일본 3대 명성' },
          { name: '二の丸公園(니노마루 공원)', rating: 4.8, specialty: '성곽 정원' },
          { name: '加藤清正公像(가토 기요마사 공상)', rating: 4.7, specialty: '역사 유적' }
        ]
      },
      suizenji: {
        name: '水前寺成趣園(스이젠지 조쥬엔)',
        emoji: '🌸',
        spots: [
          { name: '水前寺成趣園(스이젠지 조쥬엔)', rating: 4.8, specialty: '전통 정원' },
          { name: 'ミニ富士山(미니 후지산)', rating: 4.7, specialty: '정원 조형물' },
          { name: '出水公園(출수공원)', rating: 4.6, specialty: '맑은 물' }
        ]
      },
      aso_shrine: {
        name: '阿蘇神社(아소 신사)',
        emoji: '⛩️',
        spots: [
          { name: '阿蘇神社本殿(아소 신사 본전)', rating: 4.8, specialty: '화산 신앙' },
          { name: '門前町通り(몬젠마치 거리)', rating: 4.7, specialty: '전통 상점가' },
          { name: '阿蘇ファームランド(아소 농장랜드)', rating: 4.6, specialty: '체험 목장' }
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
        name: 'ちゃんぽん(짬뽕)',
        emoji: '🍲',
        restaurants: [
          { name: '四海楼(시카이로)', rating: 4.9, specialty: '원조 짬뽕' },
          { name: '江山楼(코자이켄)', rating: 4.8, specialty: '해산물 짬뽕' },
          { name: '麺馬鹿一代(멘바카 이치다이)', rating: 4.7, specialty: '매운 짬뽕' }
        ]
      },
      sara_udon: {
        name: '皿うどん(사라우동)',
        emoji: '🍜',
        restaurants: [
          { name: '明華園(메이카엔)', rating: 4.8, specialty: '파삭한 면' },
          { name: '群来軒(긴레이)', rating: 4.7, specialty: '야채 사라우동' },
          { name: '蓬莱(호라이)', rating: 4.6, specialty: '해산물 사라우동' }
        ]
      },
      kasutera: {
        name: 'カステラ(카스테라)',
        emoji: '🍰',
        restaurants: [
          { name: '福砂屋(후쿠사야)', rating: 4.9, specialty: '원조 카스테라' },
          { name: '松翁軒(쇼켄도)', rating: 4.8, specialty: '꿀 카스테라' },
          { name: 'りんが(린가)', rating: 4.7, specialty: '초콜릿 카스테라' }
        ]
      }
    },
    hotplaces: {
      glover_garden: {
        name: 'グラバー園(글로버 가든)',
        emoji: '🏛️',
        spots: [
          { name: 'グラバー邸(글로버 저택)', rating: 4.9, specialty: '서양식 정원' },
          { name: '旧リンガー住宅(구 링거 주택)', rating: 4.8, specialty: '역사적 건물' },
          { name: '展望テラス(전망 테라스)', rating: 4.7, specialty: '나가사키 항구 조망' }
        ]
      },
      chinatown: {
        name: '中華街(차이나타운)',
        emoji: '🏮',
        spots: [
          { name: '長崎新地中華街(나가사키 신치 차이나타운)', rating: 4.8, specialty: '일본 3대 차이나타운' },
          { name: '湊公園(미나토 공원)', rating: 4.7, specialty: '중화거리 입구' },
          { name: '関帝廟(관제묘)', rating: 4.6, specialty: '중국 사원' }
        ]
      },
      peace_park: {
        name: '平和公園(평화공원)',
        emoji: '🕊️',
        spots: [
          { name: '平和祈念像(평화기념상)', rating: 4.9, specialty: '평화 기념' },
          { name: '原爆資料館(원폭자료관)', rating: 4.8, specialty: '역사 교육' },
          { name: '平和の泉(평화의 샘)', rating: 4.7, specialty: '기념 시설' }
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
        name: '佐世保バーガー(사세보 버거)',
        emoji: '🍔',
        restaurants: [
          { name: 'ビッグマン(빅맨)', rating: 4.9, specialty: '원조 사세보 버거' },
          { name: 'ラッキーズ(러키즈)', rating: 4.8, specialty: '수제 패티' },
          { name: 'ログキット(로그킷)', rating: 4.7, specialty: '아메리칸 스타일' }
        ]
      },
      kujira: {
        name: '鯨肉(고래고기)',
        emoji: '🐋',
        restaurants: [
          { name: '鯨屋(쿠지라야)', rating: 4.8, specialty: '고래 스테이크' },
          { name: '港(미나토)', rating: 4.7, specialty: '고래 회' },
          { name: '伝統海産物(전통 해산물)', rating: 4.6, specialty: '고래 나베' }
        ]
      },
      oyster: {
        name: '牡蠣料理(굴 요리)',
        emoji: '🦪',
        restaurants: [
          { name: '九州牡蠣屋(규슈 굴집)', rating: 4.7, specialty: '구이 굴' },
          { name: '海の家(바다의 집)', rating: 4.6, specialty: '굴 라멘' },
          { name: '牡蠣専門店(굴 전문점)', rating: 4.5, specialty: '굴 프라이' }
        ]
      }
    },
    hotplaces: {
      kujukushima: {
        name: '九十九島(구주쿠시마)',
        emoji: '🏝️',
        spots: [
          { name: '九十九島パールシーリゾート(구주쿠시마 펄시 리조트)', rating: 4.9, specialty: '208개의 섬' },
          { name: '展海峰(전카이보)', rating: 4.8, specialty: '전망대' },
          { name: '遊覧船(유람선)', rating: 4.7, specialty: '섬 투어' }
        ]
      },
      huis_ten_bosch: {
        name: 'ハウステンボス(하우스텐보스)',
        emoji: '🏰',
        spots: [
          { name: 'ハウステンボス宮殿(하우스텐보스 궁전)', rating: 4.8, specialty: '네덜란드 테마파크' },
          { name: 'イルミネーション(일루미네이션)', rating: 4.9, specialty: '빛의 왕국' },
          { name: 'カナルクルーザー(카날 크루저)', rating: 4.7, specialty: '운하 크루즈' }
        ]
      },
      mikawachi: {
        name: '三川内焼(미카와치 도자기)',
        emoji: '🏺',
        spots: [
          { name: '三川内焼伝統産業会館(미카와치야키 전통산업회관)', rating: 4.7, specialty: '전통 도자기' },
          { name: '窯元見学(가마모토 견학)', rating: 4.6, specialty: '도자기 제작 체험' },
          { name: '陶芸の里(도예의 고향)', rating: 4.5, specialty: '도자기 쇼핑' }
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
        name: '豊後牛(분고규)',
        emoji: '🥩',
        restaurants: [
          { name: '豊後屋(분고야)', rating: 4.9, specialty: '분고규 스테이크' },
          { name: '大分焼肉(오이타 야키니쿠)', rating: 4.8, specialty: '분고규 바베큐' },
          { name: '肉処(니쿠도코로)', rating: 4.7, specialty: '분고규 스키야키' }
        ]
      },
      jigoku_mushi: {
        name: '地獄蒸し(지고쿠무시)',
        emoji: '♨️',
        restaurants: [
          { name: '地獄蒸し工房(지고쿠무시 공방)', rating: 4.8, specialty: '온천 찜 요리' },
          { name: '別府温泉(별부 온천)', rating: 4.7, specialty: '야채 지고쿠무시' },
          { name: '湯布院蒸し屋(유후인 찜집)', rating: 4.6, specialty: '해산물 지고쿠무시' }
        ]
      },
      fugu: {
        name: 'ふぐ料理(복어요리)',
        emoji: '🐡',
        restaurants: [
          { name: 'ふぐ屋(후구야)', rating: 4.9, specialty: '복어 회' },
          { name: 'てっさ屋(텟사야)', rating: 4.8, specialty: '복어 찌개' },
          { name: '臼杵ふぐ(우스키 후구)', rating: 4.7, specialty: '복어 코스' }
        ]
      }
    },
    hotplaces: {
      beppu_onsen: {
        name: '別府温泉(별부 온천)',
        emoji: '♨️',
        spots: [
          { name: '地獄めぐり(지고쿠 메구리)', rating: 4.9, specialty: '지옥 온천 투어' },
          { name: '別府タワー(별부 타워)', rating: 4.7, specialty: '온천가 전망' },
          { name: '竹瓦温泉(다케가와라 온천)', rating: 4.8, specialty: '모래찜질' }
        ]
      },
      yufuin: {
        name: '湯布院(유후인)',
        emoji: '🌸',
        spots: [
          { name: '金鱗湖(킨린코)', rating: 4.8, specialty: '아름다운 호수' },
          { name: '湯の坪街道(유노츠보 가도)', rating: 4.7, specialty: '온천거리 쇼핑' },
          { name: '由布岳(유후다케)', rating: 4.6, specialty: '영봉' }
        ]
      },
      usuki: {
        name: '臼杵石仏(우스키 석불)',
        emoji: '🗿',
        spots: [
          { name: '臼杵石仏群(우스키 석불군)', rating: 4.8, specialty: '국가 보물 석불' },
          { name: '石仏公園(석불공원)', rating: 4.7, specialty: '역사 공원' },
          { name: '臼杵城跡(우스키성터)', rating: 4.6, specialty: '성터 유적' }
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
        name: '佐賀牛(사가규)',
        emoji: '🥩',
        restaurants: [
          { name: '佐賀牛本店(사가규 본점)', rating: 4.9, specialty: '최고급 사가규' },
          { name: '牛カツ(규카츠)', rating: 4.8, specialty: '사가규 까츠' },
          { name: '焼肉佐賀(야키니쿠 사가)', rating: 4.7, specialty: '사가규 바베큐' }
        ]
      },
      yobuko_squid: {
        name: '呼子イカ(요부코 이카)',
        emoji: '🦑',
        restaurants: [
          { name: 'イカ屋(이카야)', rating: 4.9, specialty: '살아있는 오징어 회' },
          { name: '呼子市場(요부코 시장)', rating: 4.8, specialty: '투명 오징어' },
          { name: 'イカ専門店(이카 전문점)', rating: 4.7, specialty: '오징어 덮밥' }
        ]
      },
      gagyudon: {
        name: '和牛丼(가규동)',
        emoji: '🍚',
        restaurants: [
          { name: '牛丼屋(규동야)', rating: 4.8, specialty: '사가규 덮밥' },
          { name: '丼ぶりハウス(돈부리 하우스)', rating: 4.7, specialty: '특제 가규동' },
          { name: 'みそ汁屋(미소시루야)', rating: 4.6, specialty: '가규동 정식' }
        ]
      }
    },
    hotplaces: {
      yoshinogari: {
        name: '吉野ヶ里(요시노가리)',
        emoji: '🏛️',
        spots: [
          { name: '吉野ヶ里歴史公園(요시노가리 역사공원)', rating: 4.8, specialty: '야요이 시대 유적' },
          { name: '弥生の村(야요이의 마을)', rating: 4.7, specialty: '고대 체험' },
          { name: '考古学博物館(고고학 박물관)', rating: 4.6, specialty: '유물 전시' }
        ]
      },
      arita: {
        name: '有田(아리타)',
        emoji: '🏺',
        spots: [
          { name: '有田陶磁の里(아리타 도자기 마을)', rating: 4.8, specialty: '일본 자기 발상지' },
          { name: '窯元巡り(가마모토 순례)', rating: 4.7, specialty: '도자기 공방 투어' },
          { name: '陶山神社(토잔 신사)', rating: 4.6, specialty: '도자기 토리이' }
        ]
      },
      karatsu: {
        name: '唐津(가라츠)',
        emoji: '🏰',
        spots: [
          { name: '唐津城(가라츠성)', rating: 4.8, specialty: '바다 조망 성' },
          { name: '虹の松原(니지노마츠바라)', rating: 4.7, specialty: '소나무 숲' },
          { name: '唐津くんち(가라츠 쿤치)', rating: 4.9, specialty: '가을 축제' }
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