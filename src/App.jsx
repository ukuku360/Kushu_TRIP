import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { transportData } from './data/kyushuData'
import restaurantService from './services/restaurantService'
import hotplaceService from './services/hotplaceService'
import { getTransportDataSafely } from './utils/typeCheckers'
import ErrorBoundary from './components/ErrorBoundary'
import MapView from './components/MapView'
import FoodSelection from './components/FoodSelection'
import HotplaceSelection from './components/HotplaceSelection'
import RestaurantList from './components/RestaurantList'
import HotplaceList from './components/HotplaceList'
import TransportSelection from './components/TransportSelection'
import TransportDetail from './components/TransportDetail'
import TrendingDataDebug from './components/TrendingDataDebug'
import ApiUsageMonitor from './components/ApiUsageMonitor'
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

  const handleCityClick = useCallback((cityId) => {
    try {
      if (!cityId || typeof cityId !== 'string') {
        console.error('Invalid cityId provided:', cityId)
        return
      }

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
    } catch (error) {
      console.error('Error in handleCityClick:', error)
      setLoadingError('도시 선택 중 오류가 발생했습니다.')
    }
  }, [mode, selectedCities])

  const handleFoodClick = useCallback(async (foodKey) => {
    try {
      if (!foodKey || typeof foodKey !== 'string') {
        console.error('Invalid foodKey provided:', foodKey)
        setLoadingError('올바르지 않은 음식 선택입니다.')
        return
      }

      setSelectedFood(foodKey)
      setIsLoading(true)
      setLoadingError(null)
      
      const restaurantData = await restaurantService.searchRestaurants(selectedCity, foodKey)
      
      if (!Array.isArray(restaurantData)) {
        throw new Error('Invalid restaurant data received')
      }
      
      setRestaurants(restaurantData)
    } catch (error) {
      console.error('Failed to fetch restaurants:', error)
      setLoadingError('맛집 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [selectedCity])

  const handleHotplaceClick = useCallback(async (hotplaceKey) => {
    try {
      if (!hotplaceKey || typeof hotplaceKey !== 'string') {
        console.error('Invalid hotplaceKey provided:', hotplaceKey)
        setLoadingError('올바르지 않은 핫플레이스 선택입니다.')
        return
      }

      setSelectedHotplace(hotplaceKey)
      setIsLoading(true)
      setLoadingError(null)
      
      const hotplaceData = await hotplaceService.searchHotplaces(selectedCity, hotplaceKey)
      
      if (!Array.isArray(hotplaceData)) {
        throw new Error('Invalid hotplace data received')
      }
      
      setHotplaces(hotplaceData)
    } catch (error) {
      console.error('Failed to fetch hotplaces:', error)
      setLoadingError('핫플 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [selectedCity])

  const handleBackToMap = () => {
    setSelectedCity(null)
    setSelectedFood(null)
    setSelectedHotplace(null)
    setSelectedCities([])
    setShowTransport(false)
    setSelectedTransport(null)
    setRestaurants([])
    setHotplaces([])
    setIsLoading(false)
    setLoadingError(null)
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
    try {
      if (!option || typeof option !== 'object') {
        console.error('Invalid transport option provided:', option)
        return
      }
      setSelectedTransport(option)
    } catch (error) {
      console.error('Error in handleTransportSelect:', error)
    }
  }

  const handleBackToTransport = () => {
    setSelectedTransport(null)
  }

  const handleModeChange = (newMode) => {
    try {
      if (!['food', 'hotplace', 'transport'].includes(newMode)) {
        console.error('Invalid mode provided:', newMode)
        return
      }

      setMode(newMode)
      setSelectedCity(null)
      setSelectedFood(null)
      setSelectedHotplace(null)
      setSelectedCities([])
      setShowTransport(false)
      setSelectedTransport(null)
      setRestaurants([])
      setHotplaces([])
      setIsLoading(false)
      setLoadingError(null)
    } catch (error) {
      console.error('Error in handleModeChange:', error)
    }
  }

  // Memoized transport data calculation
  const transportOptionsData = useMemo(() => {
    return getTransportDataSafely(selectedCities, transportData)
  }, [selectedCities])

  const handleRetryRestaurants = useCallback(() => {
    if (selectedFood) {
      handleFoodClick(selectedFood)
    }
  }, [selectedFood, handleFoodClick])

  const handleRetryHotplaces = useCallback(() => {
    if (selectedHotplace) {
      handleHotplaceClick(selectedHotplace)
    }
  }, [selectedHotplace, handleHotplaceClick])

  return (
    <ErrorBoundary>
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
            {/* 지도 화면 */}
            {!selectedCity && !showTransport && (
              <ErrorBoundary>
                <MapView
                  mode={mode}
                  selectedCities={selectedCities}
                  hoveredCity={hoveredCity}
                  setHoveredCity={setHoveredCity}
                  onCityClick={handleCityClick}
                  onModeChange={handleModeChange}
                />
              </ErrorBoundary>
            )}

            {/* 교통수단 선택 화면 */}
            {showTransport && !selectedTransport && (
              <ErrorBoundary>
                <TransportSelection
                  selectedCities={selectedCities}
                  transportData={transportOptionsData}
                  onBackToMap={handleBackToMap}
                  onTransportSelect={handleTransportSelect}
                />
              </ErrorBoundary>
            )}

            {/* 교통수단 상세 정보 화면 */}
            {selectedTransport && (
              <ErrorBoundary>
                <TransportDetail
                  selectedCities={selectedCities}
                  selectedTransport={selectedTransport}
                  transportData={transportOptionsData}
                  onBackToTransport={handleBackToTransport}
                />
              </ErrorBoundary>
            )}

            {/* 음식 선택 화면 */}
            {selectedCity && !selectedFood && !selectedHotplace && mode === 'food' && (
              <ErrorBoundary>
                <FoodSelection
                  selectedCity={selectedCity}
                  onBackToMap={handleBackToMap}
                  onFoodClick={handleFoodClick}
                />
              </ErrorBoundary>
            )}

            {/* 핫플레이스 선택 화면 */}
            {selectedCity && !selectedFood && !selectedHotplace && mode === 'hotplace' && (
              <ErrorBoundary>
                <HotplaceSelection
                  selectedCity={selectedCity}
                  onBackToMap={handleBackToMap}
                  onHotplaceClick={handleHotplaceClick}
                />
              </ErrorBoundary>
            )}

            {/* 맛집 리스트 화면 */}
            {selectedFood && (
              <ErrorBoundary>
                <RestaurantList
                  selectedCity={selectedCity}
                  selectedFood={selectedFood}
                  restaurants={restaurants}
                  isLoading={isLoading}
                  loadingError={loadingError}
                  onBackToFoods={handleBackToFoods}
                  onRetry={handleRetryRestaurants}
                />
              </ErrorBoundary>
            )}

            {/* 핫플레이스 리스트 화면 */}
            {selectedHotplace && (
              <ErrorBoundary>
                <HotplaceList
                  selectedCity={selectedCity}
                  selectedHotplace={selectedHotplace}
                  hotplaces={hotplaces}
                  isLoading={isLoading}
                  loadingError={loadingError}
                  onBackToHotplaces={handleBackToHotplaces}
                  onRetry={handleRetryHotplaces}
                />
              </ErrorBoundary>
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
        
        {/* 개발 모드에서만 디버그 컴포넌트 표시 */}
        {import.meta.env.DEV && <TrendingDataDebug />}
        
        {/* API 사용량 모니터 */}
        <ApiUsageMonitor />
      </div>
    </ErrorBoundary>
  )
}

export default App 