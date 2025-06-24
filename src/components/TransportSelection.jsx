import React from 'react'
import { motion } from 'framer-motion'
import { kyushuData } from '../data/kyushuData'
import BackButton from './common/BackButton'

const TransportSelection = ({ selectedCities, transportData, onBackToMap, onTransportSelect }) => {
  if (!transportData || selectedCities.length !== 2) {
    return (
      <div className="transport-container">
        <BackButton onClick={onBackToMap} label="지도로 돌아가기" />
        <p>교통 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const fromCity = kyushuData[selectedCities[0]]
  const toCity = kyushuData[selectedCities[1]]

  return (
    <motion.div
      key="transport"
      className="transport-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton onClick={onBackToMap} label="지도로 돌아가기" />
      
      <h2 className="section-title">
        🚗 {fromCity?.name} → {toCity?.name}
      </h2>
      <p className="transport-distance">거리: {transportData.distance}</p>
      
      <div className="transport-options">
        {transportData.options.map((option, index) => (
          <motion.div
            key={index}
            className="transport-option"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTransportSelect(option)}
          >
            <div className="transport-icon">
              {option.type === '기차' && '🚂'}
              {option.type === '신칸센' && '🚄'}
              {option.type === '버스' && '🚌'}
              {option.type === '고속버스' && '🚌'}
              {option.type === '자동차' && '🚗'}
            </div>
            <div className="transport-info">
              <h3>{option.type}</h3>
              <p className="transport-name">{option.name}</p>
              <div className="transport-details">
                <span className="duration">⏱️ {option.duration}</span>
                <span className="price">💰 {option.price}</span>
                <span className="frequency">🔄 {option.frequency}</span>
              </div>
            </div>
            <div className="transport-arrow">→</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default TransportSelection 