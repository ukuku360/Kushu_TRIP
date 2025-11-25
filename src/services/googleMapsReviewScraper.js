import apiUsageTracker from './apiUsageTracker.js';

// 구글맵 리뷰 스크랩핑 서비스
class GoogleMapsReviewScraper {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
    
    if (!this.apiKey || this.apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
      console.warn('⚠️ Google Places API 키가 설정되지 않았습니다.');
      console.info('📝 .env 파일에 VITE_GOOGLE_PLACES_API_KEY=실제API키 를 설정해주세요.');
    } else {
      console.log('✅ Google Places API 키가 설정되었습니다.');
    }
  }

  // 실제 Google Places API로 리뷰 수집 (최신 20개)
  async scrapeReviews(restaurantName, cityName, placeId, limit = 20) {
    try {
      console.log(`🔍 ${restaurantName} 최신 리뷰 ${limit}개 수집 시작 (place_id: ${placeId})`);
      
      let allReviews = [];
      
      // 데모 place_id인 경우 mock 리뷰 생성
      if (placeId && placeId.includes('demo_place')) {
        console.log('📝 데모 데이터용 mock 리뷰 생성');
        allReviews = this.generateMockReviews(restaurantName, limit);
      }
      // Google Places API를 통해 실제 리뷰 가져오기
      else if (placeId && !placeId.startsWith('mock_')) {
        try {
          // 다중 페이지 요청으로 더 많은 리뷰 수집
          const placeDetails = await this.getPlaceDetailsWithAllReviews(placeId);
          
          if (placeDetails && placeDetails.reviews) {
            const googleReviews = placeDetails.reviews.map(review => ({
              text: review.text?.text || review.text,
              rating: review.rating,
              author: review.authorAttribution?.displayName || review.author_name,
              time: review.relativePublishTimeDescription || review.relative_time_description,
              publishTime: review.publishTime || review.time || Date.now(), // 정렬용 시간
              source: 'google_places'
            }));
            
            // 최신순 정렬
            googleReviews.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
            
            allReviews = [...allReviews, ...googleReviews.slice(0, limit)];
            console.log(`✅ Google Places API에서 ${googleReviews.length}개 리뷰 수집`);
          }
        } catch (apiError) {
          console.warn('Google Places API 리뷰 조회 실패:', apiError.message);
        }
      }

      // Google Places API 리뷰가 충분하지 않으면 웹 검색으로 보완
      if (allReviews.length < Math.min(limit, 10) && !placeId.includes('demo_place')) {
        console.log(`🔍 웹 검색으로 추가 리뷰 수집 시도 (현재: ${allReviews.length}개)`);
        
        try {
          const searchQuery = `${restaurantName} ${cityName} 리뷰 후기 최신`;
          const additionalReviews = await this.searchLatestReviews(searchQuery, limit - allReviews.length);
          
          allReviews = [...allReviews, ...additionalReviews];
          console.log(`📝 웹에서 ${additionalReviews.length}개 추가 리뷰 수집`);
        } catch (error) {
          console.warn('웹 리뷰 수집 실패 - Google Places API 리뷰만 사용:', error.message);
        }
      }

      // 중복 제거하고 최신순으로 정렬 후 limit만큼만 반환
      const uniqueReviews = this.deduplicateReviews(allReviews);
      const latestReviews = uniqueReviews
        .sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
        .slice(0, limit);
      
      console.log(`✅ 총 ${latestReviews.length}개 최신 리뷰 수집 완료`);
      
      // 리뷰가 있으면 Gemini로 요약, 없으면 기본 메시지
      let summary;
      if (latestReviews.length > 0) {
        summary = await this.summarizeWithGemini(latestReviews, restaurantName);
      } else {
        summary = {
          종합평가: `${restaurantName}에 대한 최신 리뷰를 찾을 수 없습니다. Google Places API 설정을 확인해주세요.`,
          주요장점: [],
          아쉬운점: [],
          추천메뉴: [],
          방문팁: ['Google Maps에서 직접 확인해보세요.']
        };
      }
      
      return {
        reviews: latestReviews,
        summary: summary
      };
      
    } catch (error) {
      console.error('리뷰 수집 실패:', error);
      throw error;
    }
  }

  // Mock 리뷰 생성 (데모용)
  generateMockReviews(restaurantName, limit = 20) {
    const mockReviewTemplates = [
      {
        texts: [
          '정말 맛있어요! 현지 느낌이 물씬 나는 맛집입니다.',
          '친구들과 함께 갔는데 모두 만족했어요.',
          '조금 기다렸지만 그만한 가치가 있었습니다.',
          '직원분들이 친절하고 음식도 빨리 나왔어요.',
          '가격 대비 만족도가 높습니다. 재방문 의사 있어요!'
        ],
        ratings: [4.2, 4.5, 4.8, 4.3, 4.6]
      },
      {
        texts: [
          '맛은 좋은데 조금 짜요. 그래도 현지 맛을 느낄 수 있어서 좋았습니다.',
          '관광객이 많아서 조금 시끄러웠지만 음식은 정말 좋아요.',
          '예약하고 가는 것을 추천합니다. 웨이팅이 길어요.',
          '전통적인 맛을 잘 살린 것 같아요. 다음에 또 올게요.',
          '현지인들도 많이 오는 곳 같네요. 분위기가 좋아요.'
        ],
        ratings: [4.0, 4.1, 4.4, 4.7, 4.3]
      },
      {
        texts: [
          '생각보다 양이 많아서 놀랐어요. 맛도 훌륭하고요!',
          '사진보다 실제가 더 맛있어요. 강력 추천!',
          '처음 먹어보는 요리였는데 정말 인상적이었습니다.',
          '가격이 조금 비싸지만 그만한 가치가 있어요.',
          '아이들도 잘 먹을 수 있는 맛이에요. 가족 단위로 추천!'
        ],
        ratings: [4.6, 4.8, 4.5, 4.2, 4.4]
      }
    ];

    const authors = [
      '한국인 여행자', '일본 현지인', '맛집 탐방가', '가족 여행객', 
      '커플 여행자', '블로거', '현지 거주자', '출장족', '미식가',
      '학생', '직장인', '관광객', '음식 애호가', '여행 전문가'
    ];

    const timeExpressions = [
      '2일 전', '1주일 전', '3일 전', '5일 전', '어제',
      '1개월 전', '2주일 전', '6일 전', '4일 전', '오늘'
    ];

    const reviews = [];
    const usedTexts = new Set();

    for (let i = 0; i < Math.min(limit, 20); i++) {
      const templateGroup = mockReviewTemplates[i % mockReviewTemplates.length];
      const textIndex = i % templateGroup.texts.length;
      const reviewText = templateGroup.texts[textIndex];
      
      // 중복 방지
      if (usedTexts.has(reviewText)) {
        continue;
      }
      usedTexts.add(reviewText);

      reviews.push({
        text: reviewText,
        rating: templateGroup.ratings[textIndex],
        author: authors[i % authors.length],
        time: timeExpressions[i % timeExpressions.length],
        publishTime: Date.now() - (i * 24 * 60 * 60 * 1000), // i일 전
        source: 'mock_review'
      });
    }

    console.log(`📝 ${restaurantName}용 mock 리뷰 ${reviews.length}개 생성`);
    return reviews;
  }

  // 모든 리뷰를 가져오는 향상된 버전
  async getPlaceDetailsWithAllReviews(placeId) {
    if (!this.apiKey || this.apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
      console.warn('Google Places API 키가 없어 기본 데이터를 반환합니다.');
      return {
        reviews: [],
        rating: 0,
        user_ratings_total: 0
      };
    }

    try {
      // New Places API 사용 - 최대한 많은 리뷰 요청
      const response = await fetch(`/api/places/places/${placeId}`, {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews.publishTime,reviews.rating,reviews.text,reviews.authorAttribution,reviews.relativePublishTimeDescription'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Google Places API 오류: ${response.status}`, errorText);
        return {
          reviews: [],
          rating: 0,
          user_ratings_total: 0
        };
      }

      const data = await response.json();
      
      // New Places API 응답 구조에 맞게 변환
      return {
        reviews: data.reviews || [],
        rating: data.rating || 0,
        user_ratings_total: data.userRatingCount || 0
      };
      
    } catch (error) {
      console.warn('장소 상세 정보 조회 실패:', error.message);
      return {
        reviews: [],
        rating: 0,
        user_ratings_total: 0
      };
    }
  }

  // 최신 리뷰 웹 검색
  async searchLatestReviews(query, limit = 10) {
    try {
      // 최신 리뷰 검색을 위한 쿼리 수정
      const latestQuery = `${query} 2024 "최근" OR "어제" OR "지난주" OR "이번달"`;
      const response = await fetch(`/api/search?q=${encodeURIComponent(latestQuery)}&count=${limit}&freshness=Week`);
      
      if (!response.ok) {
        console.warn(`웹 검색 실패 ${response.status}:`, await response.text());
        return [];
      }
      
      const data = await response.json();
      const results = data.web?.results || [];
      
      return results.map((result, index) => ({
        text: result.description || result.title || `최신 리뷰입니다.`,
        rating: 4 + Math.random(), // 4.0-5.0 사이
        author: `웹 리뷰어 ${index + 1}`,
        time: '최근',
        publishTime: Date.now() - (index * 86400000), // 최근 순서로 가정
        source: 'web_search_latest'
      }));
      
    } catch (error) {
      console.warn('최신 리뷰 웹 검색 실패:', error);
      return [];
    }
  }

  // Google Places API 장소 상세 정보 가져오기
  async getPlaceDetails(placeId) {
    if (!this.apiKey || this.apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
      console.warn('Google Places API 키가 없어 기본 데이터를 반환합니다.');
      return {
        reviews: [],
        rating: 0,
        user_ratings_total: 0
      };
    }

    try {
      // New Places API 사용
      const response = await fetch(`/api/places/places/${placeId}`, {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Google Places API 오류: ${response.status}`, errorText);
        return {
          reviews: [],
          rating: 0,
          user_ratings_total: 0
        };
      }

      const data = await response.json();
      
      // New Places API 응답 구조에 맞게 변환
      return {
        reviews: data.reviews || [],
        rating: data.rating || 0,
        user_ratings_total: data.userRatingCount || 0
      };
      
    } catch (error) {
      console.warn('장소 상세 정보 조회 실패:', error.message);
      return {
        reviews: [],
        rating: 0,
        user_ratings_total: 0
      };
    }
  }

  // 웹 검색으로 리뷰 정보 수집
  async searchReviewInfo(query) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&count=5`);
      
      if (!response.ok) {
        console.warn(`웹 검색 실패 ${response.status}:`, await response.text());
        return [];
      }
      
      const data = await response.json();
      return data.web?.results || [];
      
    } catch (error) {
      console.warn('웹 검색 실패:', error);
      return [];
    }
  }

  // Google Places API에서 리뷰 가져오기
  async getPlaceReviews(placeId) {
    if (!this.apiKey || this.apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
      console.warn('Google Places API 키가 없어 리뷰를 가져올 수 없습니다.');
      return [];
    }

    try {
      const details = await this.getPlaceDetails(placeId);
      
      return details.reviews?.map(review => ({
        text: review.text?.text || review.text,
        rating: review.rating,
        author: review.authorAttribution?.displayName || review.author_name,
        time: review.relativePublishTimeDescription || review.relative_time_description,
        source: 'google_places'
      })) || [];
      
    } catch (error) {
      console.warn('리뷰 조회 실패:', error.message);
      return [];
    }
  }

  // 웹 스크래핑으로 추가 리뷰 수집
  async scrapeWebReviews(restaurantName, cityName) {
    try {
      console.log(`🌐 웹 스크래핑으로 추가 리뷰 수집: ${restaurantName}`);
      
      const searchQuery = `"${restaurantName}" ${cityName} 리뷰 평점 site:google.com OR site:maps.google.com`;
      const searchUrl = `/api/search?q=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        console.warn(`웹 검색 실패 ${response.status} - 스킵:`, await response.text());
        return [];
      }

      const data = await response.json();
      const results = data.web?.results || [];
      
      // Brave Search API 사용량 추적
      apiUsageTracker.recordUsage('brave', 'web/search/reviews', JSON.stringify(data).length, true);
      apiUsageTracker.triggerUpdate();
      
      const webReviews = this.parseWebReviews(results);
      console.log(`📝 웹에서 ${webReviews.length}개 추가 리뷰 수집`);
      
      return webReviews;
      
    } catch (error) {
      console.error('웹 리뷰 스크래핑 실패:', error);
      return [];
    }
  }

  // 웹 검색 결과에서 리뷰 파싱
  parseWebReviews(results) {
    const reviews = [];
    
    for (const result of results.slice(0, 30)) {
      const reviewData = this.extractReviewFromWebResult(result);
      if (reviewData) {
        reviews.push(reviewData);
      }
    }
    
    return reviews;
  }

  // 웹 검색 결과에서 리뷰 데이터 추출
  extractReviewFromWebResult(result) {
    const text = (result.description || result.title || '').trim();
    if (!text || text.length < 20) return null;

    // 평점 추출
    const ratingPatterns = [
      /평점\s*:?\s*([0-5]\.?\d?)\s*점?/,
      /별점\s*:?\s*([0-5]\.?\d?)/,
      /([0-5]\.?\d?)\s*(?:점|별|★)/,
      /rating\s*:?\s*([0-5]\.?\d?)/i
    ];

    let rating = null;
    for (const pattern of ratingPatterns) {
      const match = text.match(pattern);
      if (match) {
        rating = parseFloat(match[1]);
        break;
      }
    }

    // 리뷰 텍스트 정리
    const cleanText = text
      .replace(/평점.*?점/, '')
      .replace(/별점.*?별/, '')
      .replace(/구글맵|Google Maps|google\.com/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanText.length < 15) return null;

    return {
      text: cleanText.length > 300 ? cleanText.substring(0, 300) + '...' : cleanText,
      rating: rating,
      author: '웹 수집',
      time: '최근',
      source: 'web_scraping'
    };
  }

  // 추가 리뷰 스크래핑 (호환성 유지)
  async scrapeAdditionalReviews(restaurantName, cityName) {
    return await this.scrapeWebReviews(restaurantName, cityName);
  }

  // 리뷰 중복 제거
  deduplicateReviews(reviews) {
    const seen = new Set();
    return reviews.filter(review => {
      // review.text가 객체인 경우 text 속성을 추출
      const reviewText = typeof review.text === 'string' 
        ? review.text 
        : (review.text?.text || review.text?.value || review.originalText?.text || String(review.text || ''));
      
      if (!reviewText || reviewText.length < 5) return false;
      
      const key = reviewText.substring(0, 50).replace(/\s/g, '');
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Google Maps URL에서 리뷰 수집 시도 (고급 기능)
  async scrapeFromGoogleMapsUrl(url) {
    try {
      console.log('🌐 Google Maps URL에서 리뷰 수집 시도');
      
      // 여기서는 단순히 URL을 분석하여 검색 쿼리로 변환
      const urlParams = new URL(url).searchParams;
      const query = urlParams.get('q') || urlParams.get('query');
      
      if (query) {
        return await this.scrapeWebReviews(query, '');
      }
      
      return [];
      
    } catch (error) {
      console.error('Google Maps URL 리뷰 수집 실패:', error);
      return [];
    }
  }

  // 서비스 상태 확인
  checkServiceStatus() {
    return {
      googlePlacesApi: !!this.apiKey,
      webScraping: true,
      timestamp: new Date().toISOString()
    };
  }

  // Gemini API로 리뷰 요약
  async summarizeWithGemini(reviews, restaurantName) {
    // Gemini API 키 확인
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!geminiApiKey || geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      console.warn('Gemini API 키가 없어 mock 요약을 반환합니다.');
      return this.generateMockSummary(reviews, restaurantName);
    }

    try {
      // 리뷰 텍스트와 평점 정보 포함
      const reviewTexts = reviews.map((review, index) => {
        const rating = review.rating ? `평점: ${review.rating}/5` : '';
        const time = review.time ? `시간: ${review.time}` : '';
        return `리뷰 ${index + 1}: [${rating}${time ? ` | ${time}` : ''}] ${review.text}`;
      }).join('\n\n');
      
      const prompt = `다음은 "${restaurantName}" 레스토랑의 최신 ${reviews.length}개 고객 리뷰입니다. 최신 트렌드와 고객 의견을 반영하여 요약해주세요:

${reviewTexts}

위 최신 리뷰들을 바탕으로 다음 JSON 형태로 한국어 요약을 작성해주세요. 최신 리뷰의 특징과 트렌드를 반영해주세요:

{
  "종합평가": "최신 고객들의 전반적인 평가와 만족도를 2-3문장으로 요약",
  "주요장점": ["최근 고객들이 자주 언급하는 장점들 3-4개"],
  "아쉬운점": ["최근 고객들이 지적하는 단점들 2-3개 (없으면 빈 배열)"],
  "추천메뉴": ["리뷰에서 언급된 추천 메뉴나 인기 메뉴들"],
  "방문팁": ["최신 리뷰를 바탕으로 한 실용적인 방문 팁들"]
}

주의사항:
- 최신 리뷰의 내용만을 바탕으로 작성
- 구체적이고 실용적인 정보 위주로 작성
- 과장하지 말고 리뷰 내용에 충실하게 작성`;

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      };

      console.log(`🤖 Gemini로 ${restaurantName} 최신 리뷰 ${reviews.length}개 요약 시작`);
      
      // Gemini API 호출을 프록시를 통해 처리
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('Gemini API 응답 오류:', response.status, errorText);
        return this.generateMockSummary(reviews, restaurantName);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const generatedText = data.candidates[0].content.parts[0].text;
        console.log(`✅ Gemini 최신 리뷰 요약 성공: ${generatedText.substring(0, 50)}...`);
        
        // JSON 파싱 시도
        try {
          const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (parseError) {
          console.warn('JSON 파싱 실패, mock 요약 반환:', parseError);
        }
        
        return {
          종합평가: generatedText,
          주요장점: [],
          아쉬운점: [],
          추천메뉴: [],
          방문팁: []
        };
      }
      
      throw new Error('Gemini 응답 형식 오류');
      
    } catch (error) {
      console.warn('Gemini 최신 리뷰 요약 실패:', error.message);
      return this.generateMockSummary(reviews, restaurantName);
    }
  }

  // Mock 요약 생성 (데모용)
  generateMockSummary(reviews, restaurantName) {
    if (!reviews || reviews.length === 0) {
      return {
        종합평가: `${restaurantName}에 대한 리뷰가 없습니다.`,
        주요장점: [],
        아쉬운점: [],
        추천메뉴: [],
        방문팁: []
      };
    }

    // 평균 평점 계산
    const avgRating = reviews.reduce((sum, review) => sum + (review.rating || 4), 0) / reviews.length;
    const reviewCount = reviews.length;

    // 레스토랑 타입에 따른 맞춤형 요약
    const isRamen = restaurantName.includes('라멘') || restaurantName.includes('이치란') || restaurantName.includes('이프푸도');
    const isYakitori = restaurantName.includes('야키토리') || restaurantName.includes('다이젠');
    const isBasashi = restaurantName.includes('바사시') || restaurantName.includes('스가노야');
    const isChampon = restaurantName.includes('짬뽕') || restaurantName.includes('링링');

    let summary = {
      종합평가: `${restaurantName}은 최근 ${reviewCount}개의 리뷰에서 평균 ${avgRating.toFixed(1)}점을 받은 인기 맛집입니다. 현지 맛을 제대로 느낄 수 있어 많은 고객들이 만족하고 있습니다.`,
      주요장점: [
        '현지 전통 맛을 잘 살린 요리',
        '친절한 서비스',
        '합리적인 가격'
      ],
      아쉬운점: [
        '웨이팅 시간이 길 수 있음',
        '관광객이 많아 시끄러울 수 있음'
      ],
      추천메뉴: ['시그니처 메뉴'],
      방문팁: [
        '예약을 미리 하시길 추천',
        '현지인 추천 메뉴를 꼭 시도해보세요',
        '피크 시간 피하면 더 편안하게 식사 가능'
      ]
    };

    // 음식 타입별 맞춤 정보
    if (isRamen) {
      summary.주요장점 = [
        '진한 톤코츠 국물이 일품',
        '면발이 쫄깃하고 맛있음',
        '정통 일본 라멘의 맛'
      ];
      summary.추천메뉴 = ['톤코츠 라멘', '차슈 추가', '반숙 계란'];
      summary.방문팁 = [
        '국물을 끝까지 드시는 것을 추천',
        '면의 굵기를 선택할 수 있어요',
        '마늘과 파를 추가하면 더 맛있어요'
      ];
    } else if (isYakitori) {
      summary.주요장점 = [
        '숯불에 구운 진짜 야키토리',
        '신선한 닭고기 사용',
        '다양한 부위를 맛볼 수 있음'
      ];
      summary.추천메뉴 = ['닭가슴살', '닭껍질', '쓰쿠네'];
      summary.방문팁 = [
        '여러 종류를 조금씩 주문하는 것을 추천',
        '맥주와 함께 드시면 더 맛있어요',
        '저녁 시간대가 분위기가 좋아요'
      ];
    } else if (isBasashi) {
      summary.주요장점 = [
        '신선한 말고기 회',
        '현지에서만 맛볼 수 있는 특별한 경험',
        '부드럽고 담백한 맛'
      ];
      summary.추천메뉴 = ['바사시 모둠', '말고기 육회'];
      summary.방문팁 = [
        '처음이시면 소량부터 시도해보세요',
        '생강과 함께 드시면 맛이 더 좋아요',
        '현지 사케와 잘 어울려요'
      ];
    } else if (isChampon) {
      summary.주요장점 = [
        '푸짐한 야채와 해산물',
        '진한 국물이 일품',
        '나가사키 전통 맛'
      ];
      summary.추천메뉴 = ['짬뽕', '사라우동', '교자'];
      summary.방문팁 = [
        '양이 많으니 적당히 주문하세요',
        '국물이 뜨거우니 조심하세요',
        '현지 맥주와 함께 드시면 좋아요'
      ];
    }

    console.log(`📝 ${restaurantName} mock 요약 생성 완료`);
    return summary;
  }
}

// 싱글톤 인스턴스
const googleMapsReviewScraper = new GoogleMapsReviewScraper();

export default googleMapsReviewScraper; 