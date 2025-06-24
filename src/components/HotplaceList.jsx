import React from 'react'
import { motion } from 'framer-motion'
import { kyushuData } from '../data/kyushuData'
// 구글 맵 URL 생성 함수
const generateHotplaceMapsUrl = (hotplace, cityName) => {
  const query = encodeURIComponent(`${hotplace.name} ${cityName}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}
import { getCityDataSafely, getHotplaceDataSafely, validateHotplaceSpotData, safeFilter } from '../utils/typeCheckers'
import BackButton from './common/BackButton'
import LoadingSpinner from './common/LoadingSpinner'
import ErrorMessage from './common/ErrorMessage'

const HotplaceList = ({ 
  selectedCity, 
  selectedHotplace, 
  hotplaces,
  isLoading,
  loadingError,
  onBackToHotplaces,
  onRetry
}) => {
  const cityData = getCityDataSafely(selectedCity, kyushuData)
  const hotplaceData = getHotplaceDataSafely(selectedCity, selectedHotplace, kyushuData)

  if (!cityData || !hotplaceData) {
    return (
      <div className="restaurants-container">
        <BackButton onClick={onBackToHotplaces} label="핫플레이스 목록으로 돌아가기" />
        <div className="error-container">
          <p>❌ 데이터를 찾을 수 없습니다.</p>
          <p>도시: {selectedCity || '없음'}</p>
          <p>핫플레이스: {selectedHotplace || '없음'}</p>
        </div>
      </div>
    )
  }

  // 안전하게 필터링된 핫플레이스 목록
  const validHotplaces = safeFilter(hotplaces, validateHotplaceSpotData)

  return (
    <motion.div
      key="hotplace-spots"
      className="restaurants-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton onClick={onBackToHotplaces} label="핫플레이스 목록으로 돌아가기" />
      
      <h2 className="section-title">
        {hotplaceData.name} 추천 스팟 TOP 3
      </h2>
      <p className="section-description">인기 있는 핫플레이스를 방문해보세요!</p>
      
      {/* 로딩 상태 */}
      {isLoading && (
        <LoadingSpinner message="핫플레이스를 찾고 있습니다..." />
      )}
      
      {/* 에러 상태 */}
      {loadingError && (
        <ErrorMessage 
          message={loadingError} 
          onRetry={onRetry}
        />
      )}
      
      {/* 핫플레이스 목록 */}
      {!isLoading && !loadingError && validHotplaces.length > 0 && (
        <div className="restaurants-list">
          {validHotplaces.map((hotplace, index) => (
            <motion.div
              key={hotplace.place_id || index}
              className="restaurant-card clickable"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(generateHotplaceMapsUrl(hotplace, cityData.name), '_blank')}
            >
              <div className="restaurant-rank">#{index + 1}</div>
              <div className="restaurant-info">
                <h3 className="restaurant-name">{hotplace.name}</h3>
                <p className="restaurant-specialty">{hotplace.specialty || '관광지'}</p>
                <div className="restaurant-rating">
                  ⭐ {hotplace.rating ? hotplace.rating.toFixed(1) : 'N/A'} / 5.0
                  {hotplace.user_ratings_total && (
                    <span className="ratings-count">({hotplace.user_ratings_total})</span>
                  )}
                </div>
                {hotplace.address && (
                  <p className="restaurant-address">📍 {hotplace.address}</p>
                )}
              </div>
              <div className="maps-icon">🗺️</div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 검색 결과 없음 */}
      {!isLoading && !loadingError && validHotplaces.length === 0 && selectedHotplace && (
        <div className="no-results">
          <p>😅 해당 핫플레이스의 정보를 찾을 수 없습니다.</p>
          <p>다른 핫플레이스를 선택해보세요!</p>
          {hotplaces.length > 0 && validHotplaces.length === 0 && (
            <p className="validation-info">⚠️ 받은 데이터에 오류가 있어 표시할 수 없습니다.</p>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default HotplaceList 