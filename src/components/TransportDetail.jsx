import React from 'react'
import { motion } from 'framer-motion'
import { kyushuData } from '../data/kyushuData'
import BackButton from './common/BackButton'

const TransportDetail = ({ selectedCities, selectedTransport, transportData, onBackToTransport }) => {
  if (!selectedTransport || selectedCities.length !== 2) {
    return (
      <div className="transport-detail-container">
        <BackButton onClick={onBackToTransport} label="교통수단 선택으로 돌아가기" />
        <p>교통수단 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const fromCity = kyushuData[selectedCities[0]]
  const toCity = kyushuData[selectedCities[1]]

  return (
    <motion.div
      key="transport-detail"
      className="transport-detail-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton onClick={onBackToTransport} label="교통수단 선택으로 돌아가기" />
      
      <motion.div
        className="transport-detail-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="transport-detail-header">
          <div className="transport-detail-icon">
            {selectedTransport.type === '기차' && '🚂'}
            {selectedTransport.type === '신칸센' && '🚄'}
            {selectedTransport.type === '버스' && '🚌'}
            {selectedTransport.type === '고속버스' && '🚌'}
            {selectedTransport.type === '자동차' && '🚗'}
          </div>
          <h2>{selectedTransport.name}</h2>
        </div>
        
        <div className="route-info">
          <h3>🚗 {fromCity?.name} → {toCity?.name}</h3>
          <p className="distance">거리: {transportData?.distance}</p>
        </div>
        
        <div className="transport-detail-info">
          <div className="info-item">
            <span className="info-label">⏱️ 소요시간</span>
            <span className="info-value">{selectedTransport.duration}</span>
          </div>
          <div className="info-item">
            <span className="info-label">💰 요금</span>
            <span className="info-value">{selectedTransport.price}</span>
          </div>
          <div className="info-item">
            <span className="info-label">🔄 운행간격</span>
            <span className="info-value">{selectedTransport.frequency}</span>
          </div>
        </div>
        
        {selectedTransport.bookingUrl && (
          <motion.a
            href={selectedTransport.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="booking-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎫 예약하기
          </motion.a>
        )}
        
        {!selectedTransport.bookingUrl && (
          <div className="no-booking">
            ℹ️ 온라인 예약이 불가능한 교통수단입니다
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default TransportDetail 