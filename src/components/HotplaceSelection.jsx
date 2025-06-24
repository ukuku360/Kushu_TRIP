import React from 'react'
import { motion } from 'framer-motion'
import { kyushuData } from '../data/kyushuData'
import { getCityDataSafely } from '../utils/typeCheckers'
import BackButton from './common/BackButton'

const HotplaceSelection = ({ selectedCity, onBackToMap, onHotplaceClick }) => {
  const cityData = getCityDataSafely(selectedCity, kyushuData)
  
  if (!cityData) {
    return (
      <div className="foods-container">
        <BackButton onClick={onBackToMap} label="지도로 돌아가기" />
        <div className="error-container">
          <p>❌ 도시 정보를 찾을 수 없습니다.</p>
          <p>선택된 도시: {selectedCity || '없음'}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      key="hotplaces"
      className="foods-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton onClick={onBackToMap} label="지도로 돌아가기" />
      
      <h2 className="section-title">{cityData.name}의 핫플레이스</h2>
      <p className="section-description">인기 관광지를 선택해보세요!</p>
      
      <div className="foods-grid">
        {Object.entries(cityData.hotplaces).map(([hotplaceKey, hotplace], index) => (
          <motion.div
            key={hotplaceKey}
            className="food-card"
            onClick={() => onHotplaceClick(hotplaceKey)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="food-emoji">{hotplace.emoji}</div>
            <h3 className="food-name">{hotplace.name}</h3>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default HotplaceSelection 