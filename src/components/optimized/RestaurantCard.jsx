import React, { memo, useCallback, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import reviewSummaryService from '../../services/reviewSummaryService.js'
import googleMapsReviewScraper from '../../services/googleMapsReviewScraper.js'

// 평점을 별로 표시하는 컴포넌트
const StarRating = memo(({ rating }) => {
  const stars = Math.round(rating * 2) / 2 // 0.5 단위로 반올림
  const fullStars = Math.floor(stars)
  const hasHalfStar = stars % 1 !== 0
  
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return <span key={index}>⭐</span>
        } else if (index === fullStars && hasHalfStar) {
          return <span key={index}>✨</span>
        } else {
          return <span key={index}>☆</span>
        }
      })}
    </div>
  )
})

StarRating.displayName = 'StarRating'

// 리뷰 요약 컴포넌트
const ReviewSummary = memo(({ 
  restaurant, 
  cityName, 
  reviews, 
  summary, // Gemini에서 생성된 요약
  isLoading,
  error,
  onClose 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="review-summary-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="review-summary-modal"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="review-summary-header">
          <div className="header-content">
            <h2 className="restaurant-title">
              <span className="restaurant-icon">🏮</span>
              {restaurant.name}
            </h2>
            <p className="location-info">
              <span className="location-icon">📍</span>
              {cityName} • {isLoading ? '리뷰 수집중...' : `최신 ${reviews.length}개 리뷰`}
            </p>
          </div>
          <button className="close-button" onClick={onClose}>
            <span>✕</span>
          </button>
        </div>

        <div className="review-summary-content">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner-large">🔄</div>
              <p className="loading-text">최신 리뷰 20개를 수집하고 있습니다...</p>
              <p className="loading-subtext">잠시만 기다려주세요 ✨</p>
            </div>
          )}

          {/* 에러 상태 */}
          {error && !isLoading && (
            <div className="error-container">
              <div className="error-icon">❌</div>
              <p className="error-text">{error}</p>
              <p className="error-subtext">다시 시도해주세요.</p>
            </div>
          )}

          {/* 성공 상태 - Gemini AI 요약 */}
          {!isLoading && !error && reviews.length > 0 && (
            <>
              <div className="gemini-summary">
                <div className="summary-badge">
                  <div className="ai-badge">
                    <span className="ai-icon">🤖</span>
                    <span className="ai-text">Gemini AI 요약</span>
                    <span className="ai-sparkle">✨</span>
                  </div>
                </div>

                {summary && typeof summary === 'object' ? (
                  <div className="structured-summary">
                    {/* 종합평가 */}
                    <div className="main-evaluation">
                      <div className="section-header">
                        <span className="section-icon">🌟</span>
                        <h3 className="section-title">종합평가</h3>
                      </div>
                      <p className="evaluation-text">{summary.종합평가}</p>
                    </div>

                    {/* 세부 항목들 */}
                    <div className="summary-grid">
                      {/* 주요 장점 */}
                      <div className="summary-section pros">
                        <div className="section-header">
                          <span className="section-icon">👍</span>
                          <h4 className="section-title">주요 장점</h4>
                        </div>
                        <ul className="summary-list">
                          {(summary.주요장점 || summary.장점 || []).map((item, index) => (
                            <li key={index} className="summary-item">
                              <span className="item-bullet">🌿</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 아쉬운 점 */}
                      <div className="summary-section cons">
                        <div className="section-header">
                          <span className="section-icon">👎</span>
                          <h4 className="section-title">아쉬운 점</h4>
                        </div>
                        <ul className="summary-list">
                          {(summary.아쉬운점 || summary.단점 || []).map((item, index) => (
                            <li key={index} className="summary-item">
                              <span className="item-bullet">🌸</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 추천 메뉴 */}
                      <div className="summary-section menu">
                        <div className="section-header">
                          <span className="section-icon">🍜</span>
                          <h4 className="section-title">추천 메뉴</h4>
                        </div>
                        <ul className="summary-list">
                          {(summary.추천메뉴 || summary.메뉴 || []).map((item, index) => (
                            <li key={index} className="summary-item">
                              <span className="menu-bullet">🥢</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 방문 팁 */}
                      <div className="summary-section tips">
                        <div className="section-header">
                          <span className="section-icon">💡</span>
                          <h4 className="section-title">방문 팁</h4>
                        </div>
                        <ul className="summary-list">
                          {(summary.방문팁 || summary.팁 || []).map((item, index) => (
                            <li key={index} className="summary-item">
                              <span className="tip-bullet">🌙</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="simple-summary">
                    <p className="summary-text">
                      {summary || `${restaurant.name}에 대한 ${reviews.length}개의 최신 리뷰를 수집했습니다.`}
                    </p>
                  </div>
                )}
              </div>

              {/* 개별 리뷰 목록 */}
              <div className="individual-reviews">
                <div className="reviews-header" onClick={() => setIsExpanded(!isExpanded)}>
                  <div className="reviews-title">
                    <span className="reviews-icon">📝</span>
                    <span>최신 개별 리뷰</span>
                    <span className="review-count-badge">{reviews.length}개</span>
                  </div>
                  <button className="expand-button">
                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>🌸</span>
                  </button>
                </div>
                
                {isExpanded && (
                  <motion.div
                    className="reviews-list"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {reviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <div className="review-header">
                          <div className="review-author">
                            <span className="author-icon">👤</span>
                            <span className="author-name">{review.author || '익명'}</span>
                          </div>
                          {review.rating && (
                            <div className="review-rating">
                              <span className="rating-number">{review.rating}⭐</span>
                            </div>
                          )}
                        </div>
                        <div className="review-time">
                          <span className="time-icon">⏰</span>
                          <span>{review.time || '최근'}</span>
                        </div>
                        <p className="review-text">{review.text}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </>
          )}

          {/* 리뷰가 없는 경우 */}
          {!isLoading && !error && reviews.length === 0 && (
            <div className="no-reviews">
              <div className="no-reviews-icon">🤷‍♂️</div>
              <p className="no-reviews-text">이 식당의 리뷰를 찾을 수 없습니다.</p>
              <p className="no-reviews-subtext">다른 식당을 확인해보세요.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

ReviewSummary.displayName = 'ReviewSummary'

// 최적화된 RestaurantCard 컴포넌트
const RestaurantCard = memo(({
  restaurant,
  rank,
  cityName,
  onClick,
  isClickable = false,
  showReviews = true
}) => {
  const [showReviewSummary, setShowReviewSummary] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState('');

  const handleClick = useCallback(() => {
    if (isClickable && onClick) {
      onClick(restaurant)
    }
  }, [isClickable, onClick, restaurant])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }, [handleClick])

  // 리뷰 요약 로딩 함수
  const loadReviewSummary = useCallback(async () => {
    if (!restaurant.place_id) {
      console.warn('place_id가 없어 리뷰를 가져올 수 없습니다:', restaurant.name);
      setReviewError('이 식당의 리뷰 정보를 찾을 수 없습니다.');
      setIsLoadingReview(false);
      return;
    }

    setIsLoadingReview(true);
    setReviewError(null);
    
    try {
      console.log(`📝 ${restaurant.name} 최신 20개 리뷰 수집 시작...`);
      
      // 최신 20개 리뷰 스크랩
      const result = await googleMapsReviewScraper.scrapeReviews(
        restaurant.name, 
        cityName, 
        restaurant.place_id,
        20 // 최신 20개 리뷰
      );
      
      if (result && result.reviews) {
        console.log(`✅ ${restaurant.name} 최신 리뷰 ${result.reviews.length}개 수집 완료`);
        setReviews(result.reviews);
        setSummary(result.summary);
      } else {
        throw new Error('리뷰 데이터가 없습니다.');
      }
      
    } catch (error) {
      console.error(`❌ ${restaurant.name} 리뷰 로딩 실패:`, error);
      setReviewError(`리뷰를 불러올 수 없습니다: ${error.message}`);
      
      // 백업: 기본 리뷰 정보라도 표시
      try {
        const fallbackReviews = await googleMapsReviewScraper.getPlaceReviews(restaurant.place_id);
        if (fallbackReviews && fallbackReviews.length > 0) {
          setReviews(fallbackReviews.slice(0, 20));
          setSummary({
            종합평가: `${restaurant.name}에 대한 기본 리뷰 정보입니다.`,
            주요장점: ['Google Places API를 통한 리뷰'],
            아쉬운점: ['상세 분석이 제한됨'],
            추천메뉴: [],
            방문팁: ['Google Maps에서 더 많은 정보를 확인하세요.']
          });
          setReviewError(null);
        }
      } catch (fallbackError) {
        console.warn('백업 리뷰 로딩도 실패:', fallbackError);
      }
    } finally {
      setIsLoadingReview(false);
    }
  }, [restaurant.place_id, restaurant.name, cityName]);

  // 리뷰 버튼 클릭 핸들러
  const handleReviewClick = useCallback(async (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    
    console.log(`🔍 ${restaurant.name} 최신 리뷰 요약 시작`);
    
    // 즉시 모달 표시하고 로딩 상태로 설정
    setShowReviewSummary(true);
    setIsLoadingReview(true);
    setReviewError(null);
    
    // 최신 20개 리뷰 로드
    await loadReviewSummary();
    
  }, [restaurant.name, loadReviewSummary]);

  // 리뷰 요약 모달 닫기
  const closeReviewSummary = useCallback(() => {
    setShowReviewSummary(false);
    setReviews([]);
    setSummary('');
    setReviewError(null);
  }, []);

  return (
    <>
      <motion.div
        className={`restaurant-card ${isClickable ? 'clickable' : ''}`}
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        tabIndex={isClickable ? 0 : -1}
        role={isClickable ? 'button' : 'article'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        whileHover={isClickable ? { scale: 1.02 } : {}}
      >
        <div className="restaurant-header">
          <div className="restaurant-name-section">
            {restaurant.rank && (
              <div className="rank-badge">
                #{restaurant.rank}
              </div>
            )}
            <h3 className="restaurant-name">{restaurant.name}</h3>
            {restaurant.rankInfo && (
              <div className="rank-info">
                {restaurant.rankInfo}
              </div>
            )}
          </div>
          
          <div className="restaurant-rating">
            {restaurant.rating ? (
              <>
                <span className="rating-score">{restaurant.rating}</span>
                <span className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < Math.floor(restaurant.rating) ? 'filled' : ''}`}>
                      ⭐
                    </span>
                  ))}
                </span>
                <span className="rating-count">({restaurant.user_ratings_total || 0})</span>
              </>
            ) : (
              <span className="no-rating">평점 없음</span>
            )}
          </div>
        </div>

        <div className="restaurant-main">
          <div className="restaurant-info">
            <p className="restaurant-address">{restaurant.vicinity || restaurant.formatted_address}</p>
            
            <div className="restaurant-details">
              {restaurant.price_level && (
                <div className="price-level">
                  <span className="price-symbol">{'💰'.repeat(restaurant.price_level)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 리뷰 버튼 */}
          {showReviews && (
            <div className="restaurant-actions">
              <motion.button
                className={`review-button ${isLoadingReview ? 'loading' : ''}`}
                onClick={handleReviewClick}
                disabled={isLoadingReview}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoadingReview ? (
                  <>
                    <span className="loading-spinner">🔄</span>
                    최신 리뷰 20개 수집중...
                  </>
                ) : (
                  <>
                    📝 최신 리뷰 20개 보기
                  </>
                )}
              </motion.button>
              
              {isClickable && (
                <button 
                  className="maps-button"
                  onClick={handleClick}
                >
                  🗺️ 지도에서 보기
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* 리뷰 요약 모달 */}
      {showReviewSummary && (
        <ReviewSummary
          restaurant={restaurant}
          cityName={cityName}
          reviews={reviews}
          summary={summary}
          isLoading={isLoadingReview}
          error={reviewError}
          onClose={closeReviewSummary}
        />
      )}
    </>
  )
})

RestaurantCard.displayName = 'RestaurantCard'

export default RestaurantCard 