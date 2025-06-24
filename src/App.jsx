import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { kyushuData, transportData } from './data/kyushuData'
import { searchRestaurants, generateGoogleMapsUrl as generateMapsUrl } from './utils/mockRestaurantAPI'
import { searchHotplaces, generateGoogleMapsUrl as generateHotplaceMapsUrl } from './utils/mockHotplaceAPI'
import './App.css'

function App() {
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedFood, setSelectedFood] = useState(null)
  const [selectedHotplace, setSelectedHotplace] = useState(null)
  const [hoveredCity, setHoveredCity] = useState(null)
  const [selectedCities, setSelectedCities] = useState([])
  const [showTransport, setShowTransport] = useState(false)
  const [selectedTransport, setSelectedTransport] = useState(null)
  const [mode, setMode] = useState('food')
  const [restaurants, setRestaurants] = useState([])
  const [hotplaces, setHotplaces] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingError, setLoadingError] = useState(null)

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

  const handleCityClick = (cityId) => {
    if (mode === 'food' || mode === 'hotplace') {
      setSelectedCity(cityId)
    } else {
      if (selectedCities.length === 0) {
        setSelectedCities([cityId])
      } else if (selectedCities.length === 1) {
        if (selectedCities[0] === cityId) return
        const newCities = [selectedCities[0], cityId]
        setSelectedCities(newCities)
        setShowTransport(true)
      } else {
        setSelectedCities([cityId])
        setShowTransport(false)
        setSelectedTransport(null)
      }
    }
  }

  const handleFoodClick = async (foodKey) => {
    setSelectedFood(foodKey)
    setIsLoading(true)
    setLoadingError(null)
    
    try {
      const restaurantData = await searchRestaurants(selectedCity, foodKey)
      setRestaurants(restaurantData)
    } catch (error) {
      console.error('Failed to fetch restaurants:', error)
      setLoadingError('맛집 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleHotplaceClick = async (hotplaceKey) => {
    setSelectedHotplace(hotplaceKey)
    setIsLoading(true)
    setLoadingError(null)
    
    try {
      const hotplaceData = await searchHotplaces(selectedCity, hotplaceKey)
      setHotplaces(hotplaceData)
    } catch (error) {
      console.error('Failed to fetch hotplaces:', error)
      setLoadingError('핫플 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToMap = () => {
    setSelectedCity(null)
    setSelectedFood(null)
    setSelectedHotplace(null)
    setSelectedCities([])
    setShowTransport(false)
    setSelectedTransport(null)
  }

  const handleBackToFoods = () => {
    setSelectedFood(null)
    setRestaurants([])
    setIsLoading(false)
    setLoadingError(null)
  }

  const handleBackToHotplaces = () => {
    setSelectedHotplace(null)
    setHotplaces([])
    setIsLoading(false)
    setLoadingError(null)
  }

  const handleTransportSelect = (option) => {
    setSelectedTransport(option)
  }

  const handleBackToTransport = () => {
    setSelectedTransport(null)
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setSelectedCity(null)
    setSelectedFood(null)
    setSelectedHotplace(null)
    setSelectedCities([])
    setShowTransport(false)
    setSelectedTransport(null)
  }

  const getTransportKey = (city1, city2) => {
    const sortedCities = [city1, city2].sort()
    return `${sortedCities[0]}-${sortedCities[1]}`
  }

  const getTransportData = () => {
    if (selectedCities.length !== 2) return null
    
    // 직접 키 매칭 시도
    const [city1, city2] = selectedCities
    const possibleKeys = [
      `${city1}-${city2}`,
      `${city2}-${city1}`,
      `${city1.toLowerCase()}-${city2.toLowerCase()}`,
      `${city2.toLowerCase()}-${city1.toLowerCase()}`
    ]
    
    console.log('Trying keys:', possibleKeys)
    
    for (const key of possibleKeys) {
      if (transportData[key]) {
        console.log('Found data with key:', key)
        return transportData[key]
      }
    }
    
    // 모든 키 출력
    console.log('All available keys:', Object.keys(transportData))
    console.log('Selected cities:', selectedCities)
    
    return null
  }



  return (
    <div className="app">
      <motion.header 
        className="header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="title">🌸 규슈 여행 도우미 🌸</h1>
        <p className="subtitle">맛있는 여행을 시작해보세요!</p>
      </motion.header>

      <div className="content">
        <AnimatePresence mode="wait">
          {!selectedCity && !showTransport && (
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
                    onClick={() => handleModeChange('food')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🍜 맛집
                  </motion.button>
                  <motion.button
                    className={`toggle-button ${mode === 'hotplace' ? 'active' : ''}`}
                    onClick={() => handleModeChange('hotplace')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📍 핫플
                  </motion.button>
                  <motion.button
                    className={`toggle-button ${mode === 'transport' ? 'active' : ''}`}
                    onClick={() => handleModeChange('transport')}
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
                      
                      // 두 도시 간의 각도 계산
                      const angle = Math.atan2(
                        (toCity.position.y + 20) - (fromCity.position.y + 20),
                        (toCity.position.x + 50) - (fromCity.position.x + 50)
                      );
                      const radius = 17; // 도시 마커의 반지름(14) + 테두리(3)
                      
                      // 각 도시의 원 테두리에 닿도록 좌표 계산
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
                        onClick={() => handleCityClick(cityId)}
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
                        onClick={() => handleCityClick(cityId)}
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
          )}

          {/* 교통수단 선택 화면 */}
          {showTransport && !selectedTransport && (
            <motion.div
              key="transport"
              className="transport-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <button className="back-button" onClick={handleBackToMap}>
                ← 지도로 돌아가기
              </button>
              
              <h2 className="section-title">
                🚗 {kyushuData[selectedCities[0]].name} → {kyushuData[selectedCities[1]].name}
              </h2>
              <p className="transport-distance">거리: {getTransportData()?.distance}</p>
              
              <div className="transport-options">
                {getTransportData()?.options.map((option, index) => (
                  <motion.div
                    key={index}
                    className="transport-option"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTransportSelect(option)}
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
          )}

          {/* 교통수단 상세 정보 화면 */}
          {selectedTransport && (
            <motion.div
              key="transport-detail"
              className="transport-detail-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <button className="back-button" onClick={handleBackToTransport}>
                ← 교통수단 선택으로 돌아가기
              </button>
              
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
                  <h3>🚗 {kyushuData[selectedCities[0]].name} → {kyushuData[selectedCities[1]].name}</h3>
                  <p className="distance">거리: {getTransportData()?.distance}</p>
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
          )}

          {selectedCity && !selectedFood && !selectedHotplace && mode === 'food' && (
            <motion.div
              key="foods"
              className="foods-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <button className="back-button" onClick={handleBackToMap}>
                ← 지도로 돌아가기
              </button>
              
              <h2 className="section-title">{kyushuData[selectedCity].name}의 특산 음식</h2>
              <p className="section-description">맛있는 음식을 선택해보세요!</p>
              
              <div className="foods-grid">
                {Object.entries(kyushuData[selectedCity].foods).map(([foodKey, food], index) => (
                  <motion.div
                    key={foodKey}
                    className="food-card"
                    onClick={() => handleFoodClick(foodKey)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="food-emoji">{food.emoji}</div>
                    <h3 className="food-name">{food.name}</h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedCity && !selectedFood && !selectedHotplace && mode === 'hotplace' && (
            <motion.div
              key="hotplaces"
              className="foods-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <button className="back-button" onClick={handleBackToMap}>
                ← 지도로 돌아가기
              </button>
              
              <h2 className="section-title">{kyushuData[selectedCity].name}의 핫플레이스</h2>
              <p className="section-description">인기 관광지를 선택해보세요!</p>
              
              <div className="foods-grid">
                {Object.entries(kyushuData[selectedCity].hotplaces).map(([hotplaceKey, hotplace], index) => (
                  <motion.div
                    key={hotplaceKey}
                    className="food-card"
                    onClick={() => handleHotplaceClick(hotplaceKey)}
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
          )}

          {selectedFood && (
            <motion.div
              key="restaurants"
              className="restaurants-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <button className="back-button" onClick={handleBackToFoods}>
                ← 음식 목록으로 돌아가기
              </button>
              
              <h2 className="section-title">
                {kyushuData[selectedCity].foods[selectedFood].name} 맛집 TOP 3
              </h2>
              <p className="section-description">실시간 구글맵 데이터로 찾은 최고의 맛집!</p>
              
              {/* 로딩 상태 */}
              {isLoading && (
                <div className="loading-container">
                  <motion.div 
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    🍜
                  </motion.div>
                  <p>맛집을 찾고 있습니다...</p>
                </div>
              )}
              
              {/* 에러 상태 */}
              {loadingError && (
                <div className="error-container">
                  <p>❌ {loadingError}</p>
                  <button 
                    className="retry-button"
                    onClick={() => handleFoodClick(selectedFood)}
                  >
                    다시 시도
                  </button>
                </div>
              )}
              
              {/* 맛집 목록 */}
              {!isLoading && !loadingError && restaurants.length > 0 && (
                <div className="restaurants-list">
                  {restaurants.map((restaurant, index) => (
                    <motion.div
                      key={restaurant.place_id || index}
                      className="restaurant-card clickable"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.open(generateMapsUrl(restaurant, kyushuData[selectedCity].name), '_blank')}
                    >
                      <div className="restaurant-rank">#{index + 1}</div>
                      <div className="restaurant-info">
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <p className="restaurant-specialty">{restaurant.specialty}</p>
                        <div className="restaurant-rating">
                          ⭐ {restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'} / 5.0
                          {restaurant.user_ratings_total && (
                            <span className="ratings-count">({restaurant.user_ratings_total})</span>
                          )}
                        </div>
                        {restaurant.address && (
                          <p className="restaurant-address">📍 {restaurant.address}</p>
                        )}
                      </div>
                      <div className="maps-icon">🗺️</div>
                    </motion.div>
                  ))}
                </div>
              )}
              
                             {/* 검색 결과 없음 */}
               {!isLoading && !loadingError && restaurants.length === 0 && selectedFood && (
                 <div className="no-results">
                   <p>😅 해당 음식의 맛집을 찾을 수 없습니다.</p>
                   <p>다른 음식을 선택해보세요!</p>
                 </div>
               )}
            </motion.div>
          )}

          {selectedHotplace && (
            <motion.div
              key="hotplace-spots"
              className="restaurants-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <button className="back-button" onClick={handleBackToHotplaces}>
                ← 핫플레이스 목록으로 돌아가기
              </button>
              
              <h2 className="section-title">
                {kyushuData[selectedCity].hotplaces[selectedHotplace].name} 추천 스팟 TOP 3
              </h2>
              <p className="section-description">실시간 구글맵 데이터로 찾은 최고의 관광지!</p>
              
              {/* 로딩 상태 */}
              {isLoading && (
                <div className="loading-container">
                  <motion.div 
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    📍
                  </motion.div>
                  <p>핫플레이스를 찾고 있습니다...</p>
                </div>
              )}
              
              {/* 에러 상태 */}
              {loadingError && (
                <div className="error-container">
                  <p>❌ {loadingError}</p>
                  <button 
                    className="retry-button"
                    onClick={() => handleHotplaceClick(selectedHotplace)}
                  >
                    다시 시도
                  </button>
                </div>
              )}
              
              {/* 핫플레이스 목록 */}
              {!isLoading && !loadingError && hotplaces.length > 0 && (
                <div className="restaurants-list">
                  {hotplaces.map((hotplace, index) => (
                    <motion.div
                      key={hotplace.place_id || index}
                      className="restaurant-card clickable"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.open(generateHotplaceMapsUrl(hotplace, kyushuData[selectedCity].name), '_blank')}
                    >
                      <div className="restaurant-rank">#{index + 1}</div>
                      <div className="restaurant-info">
                        <h3 className="restaurant-name">{hotplace.name}</h3>
                        <p className="restaurant-specialty">{hotplace.specialty}</p>
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
              {!isLoading && !loadingError && hotplaces.length === 0 && selectedHotplace && (
                <div className="no-results">
                  <p>😅 해당 핫플레이스를 찾을 수 없습니다.</p>
                  <p>다른 관광지를 선택해보세요!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.footer 
        className="footer"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p>🌟 즐거운 규슈 여행 되세요! 🌟</p>
      </motion.footer>
    </div>
  )
}

export default App 