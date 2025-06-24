import React from 'react'
import { motion } from 'framer-motion'
import { kyushuData } from '../data/kyushuData'
// 구글 맵 URL 생성 함수
const generateMapsUrl = (restaurant, cityName) => {
  const query = encodeURIComponent(`${restaurant.name} ${cityName}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}
import { getCityDataSafely, getFoodDataSafely, validateRestaurantData, safeFilter } from '../utils/typeCheckers'
import BackButton from './common/BackButton'
import LoadingSpinner from './common/LoadingSpinner'
import ErrorMessage from './common/ErrorMessage'
import RestaurantCard from './optimized/RestaurantCard'

const RestaurantList = ({ 
  selectedCity, 
  selectedFood, 
  restaurants,
  isLoading,
  loadingError,
  onBackToFoods,
  onRetry
}) => {
  const cityData = getCityDataSafely(selectedCity, kyushuData)
  const foodData = getFoodDataSafely(selectedCity, selectedFood, kyushuData)

  if (!cityData || !foodData) {
    return (
      <div className="restaurants-container">
        <BackButton onClick={onBackToFoods} label="음식 목록으로 돌아가기" />
        <div className="error-container">
          <p>❌ 데이터를 찾을 수 없습니다.</p>
          <p>도시: {selectedCity || '없음'}</p>
          <p>음식: {selectedFood || '없음'}</p>
        </div>
      </div>
    )
  }

  // 안전하게 필터링된 레스토랑 목록
  const validRestaurants = safeFilter(restaurants, validateRestaurantData)

  // 구글맵 링크 클릭 핸들러
  const handleRestaurantClick = (restaurant) => {
    window.open(generateMapsUrl(restaurant, cityData.name), '_blank')
  }

  return (
    <motion.div
      key="restaurants"
      className="restaurants-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton onClick={onBackToFoods} label="음식 목록으로 돌아가기" />
      
      <h2 className="section-title">
        {foodData.name} 맛집 TOP {validRestaurants.length}
      </h2>
      <p className="section-description">
        실시간 웹 검색과 AI 분석으로 찾은 최고의 맛집! 리뷰 요약도 확인해보세요 📝
      </p>
      
      {/* 로딩 상태 */}
      {isLoading && (
        <LoadingSpinner message="맛집을 찾고 있습니다..." />
      )}
      
      {/* 에러 상태 */}
      {loadingError && (
        <ErrorMessage 
          message={loadingError} 
          onRetry={onRetry}
        />
      )}
      
      {/* 맛집 목록 */}
      {!isLoading && !loadingError && validRestaurants.length > 0 && (
        <div className="restaurants-list">
          {validRestaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.place_id || index}
              restaurant={restaurant}
              rank={index + 1}
              cityName={cityData.name}
              onClick={handleRestaurantClick}
              isClickable={true}
              showReviews={true}
            />
          ))}
        </div>
      )}
      
      {/* 검색 결과 없음 - 이제 거의 발생하지 않음 */}
      {!isLoading && !loadingError && validRestaurants.length === 0 && selectedFood && (
        <div className="no-results">
          <p>🔍 맛집 검색 중...</p>
          <p>잠시만 기다려주세요!</p>
        </div>
      )}
    </motion.div>
  )
}

export default RestaurantList 