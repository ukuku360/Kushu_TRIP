import apiUsageTracker from './apiUsageTracker.js';

// 구글맵 리뷰 스크랩핑 서비스
class GoogleMapsReviewScraper {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
    
    if (!this.apiKey) {
      console.warn('⚠️ Google Places API 키가 설정되지 않았습니다.');
    }
  }

  // 실제 Google Places API로 리뷰 수집
  async scrapeReviews(restaurantName, cityName, placeId = null) {
    try {
      console.log(`🔍 실제 리뷰 수집 시작: ${restaurantName} in ${cityName}`);
      
      let reviews = [];
      
      // 1. Place ID가 있으면 Google Places API 사용
      if (placeId && this.apiKey) {
        reviews = await this.getPlaceReviews(placeId);
      }
      
      // 2. 리뷰가 부족하면 웹 스크래핑 시도
      if (reviews.length < 10) {
        const webReviews = await this.scrapeWebReviews(restaurantName, cityName);
        reviews = [...reviews, ...webReviews];
      }
      
      // 3. 중복 제거 및 최대 20개로 제한
      const uniqueReviews = this.deduplicateReviews(reviews).slice(0, 20);
      
      console.log(`✅ 총 ${uniqueReviews.length}개 실제 리뷰 수집 완료`);
      return uniqueReviews;
      
    } catch (error) {
      console.error('❌ 리뷰 수집 실패:', error);
      throw error;
    }
  }

  // Google Places API에서 리뷰 가져오기
  async getPlaceReviews(placeId) {
    if (!this.apiKey) {
      console.warn('Google Places API 키가 없어 리뷰를 가져올 수 없습니다.');
      return [];
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/details/json?place_id=${placeId}&key=${this.apiKey}&language=ko&fields=reviews`
      );

      if (!response.ok) {
        throw new Error(`Google Places API 오류: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK' || !data.result?.reviews) {
        return [];
      }

      // API 사용량 추적
      apiUsageTracker.recordUsage('googlePlaces', 'placeDetails', JSON.stringify(data).length, true);
      apiUsageTracker.triggerUpdate();

      return data.result.reviews.map(review => ({
        text: review.text,
        rating: review.rating,
        author: review.author_name,
        time: review.relative_time_description,
        source: 'google_places_api'
      }));
      
    } catch (error) {
      console.error('Google Places API 리뷰 조회 실패:', error);
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
        console.warn('웹 검색 실패 - 스킵');
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
      text: cleanText.substring(0, 300),
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
      const key = review.text.substring(0, 50).replace(/\s/g, '');
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
}

// 싱글톤 인스턴스
const googleMapsReviewScraper = new GoogleMapsReviewScraper();

export default googleMapsReviewScraper; 