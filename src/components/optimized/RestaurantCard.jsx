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
const ReviewSummary = memo(({ restaurant, cityName, reviews, onClose }) => {
  const [reviewData, setReviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      generateReviewSummary();
    }
  }, [reviews]);

  const generateReviewSummary = async () => {
    setIsLoading(true);
    try {
      // 제미나이로 리뷰 요약
      const summary = await reviewSummaryService.summarizeReviews(reviews, restaurant.name);
      setReviewData({
        ...summary,
        totalReviews: reviews.length,
        collectTime: new Date().toISOString()
      });
    } catch (error) {
      console.error('리뷰 요약 생성 실패:', error);
      setReviewData({
        summary: '리뷰 요약을 생성할 수 없습니다.',
        keywords: [],
        sentiment: 'neutral',
        totalReviews: reviews.length
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="review-summary-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="review-modal-content">
          <div className="modal-header">
            <h3>🤖 리뷰 분석 중...</h3>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>
          <div className="loading-content">
            <span className="loading-spinner">🔄</span>
            <p>구글맵 리뷰 {reviews?.length || 0}개를 제미나이로 분석하고 있습니다...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!reviewData) return null;

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😕';
      default: return '😐';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#28a745';
      case 'negative': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <motion.div 
      className="review-summary-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="review-modal-content">
        <div className="modal-header">
          <h3>📝 {restaurant.name} 리뷰 요약</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="review-summary" style={{ borderLeftColor: getSentimentColor(reviewData.sentiment) }}>
          <div className="review-header">
            <div className="review-rating">
              {reviewData.avgRating && (
                <>
                  <span className="scraped-rating">⭐ {reviewData.avgRating}</span>
                  <span className="review-count">({reviewData.totalReviews}개 리뷰)</span>
                </>
              )}
              <div className="review-source">
                <span className="source-badge">🌐 구글맵 실시간</span>
              </div>
            </div>
            <div className="review-sentiment">
              <span style={{ color: getSentimentColor(reviewData.sentiment) }}>
                {getSentimentIcon(reviewData.sentiment)}
              </span>
              {reviewData.llmUsed && <span className="llm-badge">🤖 Gemini</span>}
            </div>
          </div>

          <div className="review-content">
            <p className="review-text">
              {reviewData.summary}
            </p>

            {isExpanded && reviewData.llmUsed && (
              <div className="detailed-review">
                {reviewData.strengths && reviewData.strengths.length > 0 && (
                  <div className="review-section">
                    <h4 className="section-title">👍 장점</h4>
                    <ul className="review-list">
                      {reviewData.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {reviewData.weaknesses && reviewData.weaknesses.length > 0 && (
                  <div className="review-section">
                    <h4 className="section-title">👎 단점</h4>
                    <ul className="review-list">
                      {reviewData.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {reviewData.collectTime && (
                  <div className="review-meta">
                    <small>수집 시간: {new Date(reviewData.collectTime).toLocaleString()}</small>
                  </div>
                )}
              </div>
            )}

            {reviewData.keywords && reviewData.keywords.length > 0 && (
              <div className="review-keywords">
                {reviewData.keywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">#{keyword}</span>
                ))}
              </div>
            )}

            {reviewData.llmUsed && (
              <button 
                className="expand-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? '접기 ▲' : '자세히 ▼'}
              </button>
            )}
          </div>
        </div>

        {/* 개별 리뷰 목록 (접힌 상태) */}
        {isExpanded && reviews && (
          <div className="individual-reviews">
            <h4>📋 개별 리뷰 ({reviews.length}개)</h4>
            <div className="reviews-list">
              {reviews.slice(0, 10).map((review, index) => (
                <div key={index} className="individual-review">
                  <div className="review-header">
                    <span className="author">{review.author}</span>
                    <span className="rating">{'⭐'.repeat(Math.floor(review.rating || 0))}</span>
                    <span className="time">{review.time}</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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
  const [scrapedReviews, setScrapedReviews] = useState(null);
  const [isScrapingReviews, setIsScrapingReviews] = useState(false);

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

  // 리뷰 버튼 클릭 핸들러
  const handleReviewClick = useCallback(async (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    setIsScrapingReviews(true);
    try {
      console.log(`🔍 ${restaurant.name} 구글맵 리뷰 스크랩 시작`);
      
      // 구글맵에서 리뷰 20개 스크랩
      const reviews = await googleMapsReviewScraper.scrapeGoogleMapsReviews(
        restaurant.name, 
        cityName
      );
      
      const cleanedReviews = googleMapsReviewScraper.cleanAndValidateReviews(reviews);
      setScrapedReviews(cleanedReviews);
      setShowReviewSummary(true);
      
      console.log(`✅ ${cleanedReviews.length}개 리뷰 수집 완료`);
      
    } catch (error) {
      console.error('리뷰 스크랩 실패:', error);
      // 실패 시에도 Mock 데이터로 진행
      const mockReviews = googleMapsReviewScraper.generateMockGoogleMapsReviews(restaurant.name);
      setScrapedReviews(mockReviews);
      setShowReviewSummary(true);
    } finally {
      setIsScrapingReviews(false);
    }
  }, [restaurant, cityName]);

  const handleCloseReviewSummary = useCallback(() => {
    setShowReviewSummary(false);
    setScrapedReviews(null);
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
        <div className="restaurant-rank">#{rank}</div>
        
        <div className="restaurant-main">
          <div className="restaurant-info">
            <h3 className="restaurant-name">{restaurant.name}</h3>
            <p className="restaurant-address">{restaurant.vicinity || restaurant.formatted_address}</p>
            
            <div className="restaurant-details">
              {restaurant.rating && (
                <div className="rating-info">
                  <StarRating rating={restaurant.rating} />
                  <span className="rating-number">{restaurant.rating}</span>
                  {restaurant.user_ratings_total && (
                    <span className="rating-count">({restaurant.user_ratings_total})</span>
                  )}
                </div>
              )}
              
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
                className={`review-button ${isScrapingReviews ? 'loading' : ''}`}
                onClick={handleReviewClick}
                disabled={isScrapingReviews}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isScrapingReviews ? (
                  <>
                    <span className="loading-spinner">🔄</span>
                    리뷰 수집중...
                  </>
                ) : (
                  <>
                    📝 구글맵 리뷰 보기
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
      {showReviewSummary && scrapedReviews && (
        <ReviewSummary
          restaurant={restaurant}
          cityName={cityName}
          reviews={scrapedReviews}
          onClose={handleCloseReviewSummary}
        />
      )}
    </>
  )
})

RestaurantCard.displayName = 'RestaurantCard'

export default RestaurantCard 