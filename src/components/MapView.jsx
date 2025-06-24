import React, { memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { kyushuData } from '../data/kyushuData'

const MapView = memo(({ 
  mode, 
  selectedCities, 
  hoveredCity, 
  setHoveredCity,
  onCityClick,
  onModeChange 
}) => {
  const connections = [
    { from: 'fukuoka', to: 'saga' },
    { from: 'fukuoka', to: 'kurume' },
    { from: 'saga', to: 'sasebo' },
    { from: 'saga', to: 'kurume' },
    { from: 'sasebo', to: 'nagasaki' },
    { from: 'kurume', to: 'kumamoto' },
    { from: 'fukuoka', to: 'oita' },
    { from: 'kumamoto', to: 'oita' },
    { from: 'kumamoto', to: 'nagasaki' },
  ]

  return (
    <motion.div
      key="map"
      className="map-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="section-title">규슈 지도</h2>
      
      {/* 모드 토글 버튼 */}
      <div className="mode-toggle-container">
        <div className="mode-toggle">
          <motion.button
            className={`toggle-button ${mode === 'food' ? 'active' : ''}`}
            onClick={() => onModeChange('food')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🍜 맛집
          </motion.button>
          <motion.button
            className={`toggle-button ${mode === 'hotplace' ? 'active' : ''}`}
            onClick={() => onModeChange('hotplace')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📍 핫플
          </motion.button>
          <motion.button
            className={`toggle-button ${mode === 'transport' ? 'active' : ''}`}
            onClick={() => onModeChange('transport')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚌 교통
          </motion.button>
        </div>
      </div>
      
      <p className="section-description">
        {mode === 'food' 
          ? '맛집을 찾고 싶은 도시를 클릭해보세요!' 
          : mode === 'hotplace'
          ? '핫플레이스를 찾고 싶은 도시를 클릭해보세요!'
          : '교통수단을 찾기 위해 출발지와 도착지를 선택해보세요!'
        }
      </p>
      
      <div className="kyushu-map">
        <svg width="500" height="400" viewBox="0 0 500 400">
          <defs>
            <linearGradient id="mindmapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f7fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.1" />
            </filter>
          </defs>
          
          <rect width="500" height="400" fill="url(#mindmapGradient)" rx="20"/>
          
          <g className="connection-lines">
            {connections.map((conn, index) => {
              const fromCity = kyushuData[conn.from];
              const toCity = kyushuData[conn.to];
              if (!fromCity || !toCity) return null;
              
              const angle = Math.atan2(
                (toCity.position.y + 20) - (fromCity.position.y + 20),
                (toCity.position.x + 50) - (fromCity.position.x + 50)
              );
              const radius = 17;
              
              const fromX = fromCity.position.x + 50 + Math.cos(angle) * radius;
              const fromY = fromCity.position.y + 20 + Math.sin(angle) * radius;
              const toX = toCity.position.x + 50 - Math.cos(angle) * radius;
              const toY = toCity.position.y + 20 - Math.sin(angle) * radius;
              
              return (
                <motion.line
                  key={index}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              );
            })}
            
            {/* 선택된 두 도시 간의 빨간 선 */}
            {selectedCities.length === 2 && (() => {
              const city1 = kyushuData[selectedCities[0]];
              const city2 = kyushuData[selectedCities[1]];
              if (!city1 || !city2) return null;
              
              const angle = Math.atan2(
                (city2.position.y + 20) - (city1.position.y + 20),
                (city2.position.x + 50) - (city1.position.x + 50)
              );
              const radius = 17;
              
              const fromX = city1.position.x + 50 + Math.cos(angle) * radius;
              const fromY = city1.position.y + 20 + Math.sin(angle) * radius;
              const toX = city2.position.x + 50 - Math.cos(angle) * radius;
              const toY = city2.position.y + 20 - Math.sin(angle) * radius;
              
              return (
                <motion.line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#ff4757"
                  strokeWidth="4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{
                    filter: 'drop-shadow(2px 2px 4px rgba(255, 71, 87, 0.3))',
                  }}
                />
              );
            })()}
          </g>

          {/* 도시 마커들 */}
          {Object.entries(kyushuData).map(([cityId, city]) => (
            <motion.g key={cityId}>
              {/* 도시 주변 글로우 효과 */}
              <motion.circle
                cx={city.position.x + 50}
                cy={city.position.y + 20}
                r={hoveredCity === cityId ? 28 : 20}
                fill={city.color}
                opacity={0.3}
                animate={{
                  scale: hoveredCity === cityId ? 1.3 : 1,
                  opacity: hoveredCity === cityId ? 0.6 : 0.3
                }}
                transition={{ duration: 0.3 }}
              />
              
              {/* 도시 마커 */}
              <motion.circle
                cx={city.position.x + 50}
                cy={city.position.y + 20}
                r="14"
                fill={selectedCities.includes(cityId) ? '#ff4757' : city.color}
                stroke={selectedCities.includes(cityId) ? '#fff' : '#fff'}
                strokeWidth={selectedCities.includes(cityId) ? '4' : '3'}
                style={{ cursor: 'pointer' }}
                onClick={() => onCityClick(cityId)}
                onMouseEnter={() => setHoveredCity(cityId)}
                onMouseLeave={() => setHoveredCity(null)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  y: [0, -3, 0],
                  scale: selectedCities.includes(cityId) ? 1.2 : 1,
                }}
                transition={{
                  y: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  scale: { duration: 0.3 }
                }}
                filter="url(#dropShadow)"
              />
              
              {/* 도시 이름 */}
              <motion.text
                x={city.position.x + 50}
                y={city.position.y + 50}
                textAnchor="middle"
                className="city-name"
                fill="#1f2937"
                fontSize="12"
                fontWeight="700"
                style={{ cursor: 'pointer' }}
                onClick={() => onCityClick(cityId)}
                animate={{
                  scale: hoveredCity === cityId ? 1.1 : 1
                }}
              >
                {city.name}
              </motion.text>
              
              {/* 반짝이는 효과 */}
              <motion.circle
                cx={city.position.x + 56}
                cy={city.position.y + 14}
                r="2"
                fill="#fff"
                opacity={0.9}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.3, 0.8]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            </motion.g>
          ))}
          
          {/* 구름 효과 */}
          <motion.g opacity={0.6}>
            <motion.ellipse
              cx="120"
              cy="50"
              rx="25"
              ry="15"
              fill="#ffffff"
              animate={{
                x: [0, 60, 0],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.ellipse
              cx="380"
              cy="45"
              rx="22"
              ry="12"
              fill="#ffffff"
              animate={{
                x: [0, -50, 0],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
            />
          </motion.g>
        </svg>
      </div>
      
      {/* 도시 선택 안내 */}
      {mode === 'transport' && selectedCities.length === 1 && (
        <motion.div
          className="city-selection-guide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p>🚗 {kyushuData[selectedCities[0]].name}에서 출발할 목적지를 선택해주세요!</p>
        </motion.div>
      )}
    </motion.div>
  )
})

MapView.displayName = 'MapView'

export default MapView 