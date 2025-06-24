import { searchRestaurants, getPlaceReviews, scrapeAdditionalReviews } from '../utils/googlePlacesAPI.js';
import googleMapsReviewScraper from './googleMapsReviewScraper.js';
import apiUsageTracker from './apiUsageTracker.js';

class ReviewSummaryService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 10 * 60 * 1000; // 10분
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    if (!this.geminiApiKey) {
      console.warn('⚠️ Gemini API 키가 설정되지 않았습니다. 환경변수 VITE_GEMINI_API_KEY를 확인하세요.');
    } else {
      console.log('✅ Gemini API 키 설정 완료');
    }
  }

  // 리뷰 요약 메인 메서드
  async getReviewSummary(restaurant, cityName) {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }

    try {
      console.log(`📝 ${restaurant.name} 리뷰 분석 시작`);
      
      // 1. Google Places API에서 실제 리뷰 수집
      let reviews = [];
      if (restaurant.place_id) {
        reviews = await googleMapsReviewScraper.scrapeReviews(restaurant.name, cityName, restaurant.place_id);
      }

      // 2. 리뷰가 충분하지 않으면 추가 스크래핑 시도
      if (reviews.length < 5) {
        const additionalReviews = await googleMapsReviewScraper.scrapeAdditionalReviews(restaurant.name, cityName);
        reviews = [...reviews, ...additionalReviews];
      }

      // 3. 여전히 리뷰가 부족하면 에러
      if (reviews.length === 0) {
        throw new Error('리뷰 데이터를 찾을 수 없습니다.');
      }

      // 4. Gemini로 리뷰 요약 생성
      const summary = await this.summarizeReviews(reviews, restaurant.name);
      
      console.log(`✅ ${restaurant.name} 리뷰 요약 완료:`, summary);
      return summary;
      
    } catch (error) {
      console.error(`❌ ${restaurant.name} 리뷰 요약 실패:`, error);
      throw error;
    }
  }

  // Gemini API로 리뷰 요약 생성
  async summarizeReviews(reviews, restaurantName) {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      throw new Error('요약할 리뷰가 없습니다.');
    }

    try {
      // 리뷰 텍스트 준비
      const reviewTexts = reviews.map((review, index) => 
        `리뷰 ${index + 1}: "${review.text}" (평점: ${review.rating}/5)`
      ).join('\n\n');

      // Gemini API 호출을 위한 프롬프트
      const prompt = `
다음은 "${restaurantName}"에 대한 실제 고객 리뷰들입니다. 이 리뷰들을 분석하여 종합적인 요약을 한국어로 작성해주세요.

${reviewTexts}

다음 형식으로 요약해주세요:
1. 전체적인 평가 (한 줄)
2. 음식 맛과 질 (구체적인 메뉴나 특징 언급)
3. 서비스와 분위기
4. 가격대와 가성비
5. 추천 포인트
6. 주의사항 (있다면)

요약은 실제 리뷰 내용만을 바탕으로 작성하고, 과장하지 말고 객관적으로 작성해주세요.
`;

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      };

      console.log('🤖 Gemini API 요청 중...');
      
      const response = await fetch(`${this.baseUrl}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Gemini API 오류: ${response.status} ${errorData?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Gemini API 응답이 올바르지 않습니다.');
      }

      const summary = data.candidates[0].content.parts[0].text;
      
      return {
        summary: summary,
        reviewCount: reviews.length,
        averageRating: this.calculateAverageRating(reviews),
        source: 'real_gemini_api',
        lastUpdated: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Gemini API 요약 실패:', error);
      throw error;
    }
  }

  // 평균 평점 계산
  calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    
    const validRatings = reviews
      .map(r => r.rating)
      .filter(rating => rating && !isNaN(rating));
    
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    return Math.round((sum / validRatings.length) * 10) / 10;
  }

  // Gemini API 연결 상태 테스트
  async testGeminiConnection() {
    console.log('🔍 Gemini API 연결 테스트 시작');
    
    if (!this.geminiApiKey) {
      return { 
        success: false, 
        error: 'API 키가 설정되지 않았습니다.',
        apiKey: false
      };
    }

    try {
      const testPrompt = '안녕하세요라고 한국어로 간단히 답해주세요.';
      
      const response = await fetch(`${this.baseUrl}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: testPrompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorData?.error?.message || response.statusText}`,
          apiKey: true
        };
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        console.log('✅ Gemini API 연결 성공');
        return {
          success: true,
          response: data.candidates[0].content.parts[0].text,
          apiKey: true
        };
      } else {
        return {
          success: false,
          error: '응답 형식이 올바르지 않습니다.',
          apiKey: true
        };
      }
      
    } catch (error) {
      console.error('❌ Gemini API 연결 실패:', error);
      return {
        success: false,
        error: error.message,
        apiKey: true
      };
    }
  }

  // 리뷰 요약 테스트 (개발용)
  async testReviewSummary(restaurantName, cityName) {
    console.log('🧪 리뷰 요약 테스트 시작');
    
    try {
      // 실제 리뷰 수집 시도
      const reviews = await googleMapsReviewScraper.scrapeReviews(restaurantName, cityName);
      
      if (reviews.length === 0) {
        throw new Error('테스트할 리뷰가 없습니다.');
      }
      
      const summary = await this.summarizeReviews(reviews, restaurantName);
      
      console.log('✅ 테스트 결과:', summary);
      return summary;
      
    } catch (error) {
      console.error('❌ 테스트 실패:', error);
      throw error;
    }
  }

  // 캐시 관련 메서드들
  getCacheKey(restaurantName, cityName) {
    return `${restaurantName}_${cityName}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

// 싱글톤 인스턴스
const reviewSummaryService = new ReviewSummaryService();

export default reviewSummaryService; 