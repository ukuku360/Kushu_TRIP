/**
 * 타입 체크 유틸리티 함수들
 */

/**
 * 도시 데이터가 유효한지 검증
 * @param {string} cityId - 도시 ID
 * @param {object} kyushuData - 규슈 데이터 객체
 * @returns {boolean}
 */
export const validateCityData = (cityId, kyushuData) => {
  if (!cityId || typeof cityId !== 'string') {
    console.error('Invalid cityId:', cityId)
    return false
  }
  
  if (!kyushuData || typeof kyushuData !== 'object') {
    console.error('Invalid kyushuData:', kyushuData)
    return false
  }
  
  const cityData = kyushuData[cityId]
  if (!cityData) {
    console.error(`City ${cityId} not found in kyushuData`)
    return false
  }
  
  // 필수 필드 체크
  const requiredFields = ['name', 'position', 'color', 'foods', 'hotplaces']
  for (const field of requiredFields) {
    if (!(field in cityData)) {
      console.error(`Missing required field '${field}' in city ${cityId}`)
      return false
    }
  }
  
  return true
}

/**
 * 안전하게 도시 데이터를 가져오는 함수
 * @param {string} cityId - 도시 ID
 * @param {object} kyushuData - 규슈 데이터 객체
 * @returns {object|null}
 */
export const getCityDataSafely = (cityId, kyushuData) => {
  if (!validateCityData(cityId, kyushuData)) {
    return null
  }
  return kyushuData[cityId]
}

/**
 * 음식 데이터가 유효한지 검증
 * @param {string} cityId - 도시 ID
 * @param {string} foodKey - 음식 키
 * @param {object} kyushuData - 규슈 데이터 객체
 * @returns {boolean}
 */
export const validateFoodData = (cityId, foodKey, kyushuData) => {
  const cityData = getCityDataSafely(cityId, kyushuData)
  if (!cityData) return false
  
  if (!foodKey || typeof foodKey !== 'string') {
    console.error('Invalid foodKey:', foodKey)
    return false
  }
  
  if (!cityData.foods || typeof cityData.foods !== 'object') {
    console.error(`Invalid foods data for city ${cityId}`)
    return false
  }
  
  const foodData = cityData.foods[foodKey]
  if (!foodData) {
    console.error(`Food ${foodKey} not found in city ${cityId}`)
    return false
  }
  
  // 필수 필드 체크
  const requiredFields = ['name', 'emoji']
  for (const field of requiredFields) {
    if (!(field in foodData)) {
      console.error(`Missing required field '${field}' in food ${foodKey}`)
      return false
    }
  }
  
  return true
}

/**
 * 안전하게 음식 데이터를 가져오는 함수
 * @param {string} cityId - 도시 ID
 * @param {string} foodKey - 음식 키
 * @param {object} kyushuData - 규슈 데이터 객체
 * @returns {object|null}
 */
export const getFoodDataSafely = (cityId, foodKey, kyushuData) => {
  if (!validateFoodData(cityId, foodKey, kyushuData)) {
    return null
  }
  return kyushuData[cityId].foods[foodKey]
}

/**
 * 핫플레이스 데이터가 유효한지 검증
 * @param {string} cityId - 도시 ID
 * @param {string} hotplaceKey - 핫플레이스 키
 * @param {object} kyushuData - 규슈 데이터 객체
 * @returns {boolean}
 */
export const validateHotplaceData = (cityId, hotplaceKey, kyushuData) => {
  const cityData = getCityDataSafely(cityId, kyushuData)
  if (!cityData) return false
  
  if (!hotplaceKey || typeof hotplaceKey !== 'string') {
    console.error('Invalid hotplaceKey:', hotplaceKey)
    return false
  }
  
  if (!cityData.hotplaces || typeof cityData.hotplaces !== 'object') {
    console.error(`Invalid hotplaces data for city ${cityId}`)
    return false
  }
  
  const hotplaceData = cityData.hotplaces[hotplaceKey]
  if (!hotplaceData) {
    console.error(`Hotplace ${hotplaceKey} not found in city ${cityId}`)
    return false
  }
  
  // 필수 필드 체크
  const requiredFields = ['name', 'emoji']
  for (const field of requiredFields) {
    if (!(field in hotplaceData)) {
      console.error(`Missing required field '${field}' in hotplace ${hotplaceKey}`)
      return false
    }
  }
  
  return true
}

/**
 * 안전하게 핫플레이스 데이터를 가져오는 함수
 * @param {string} cityId - 도시 ID
 * @param {string} hotplaceKey - 핫플레이스 키
 * @param {object} kyushuData - 규슈 데이터 객체
 * @returns {object|null}
 */
export const getHotplaceDataSafely = (cityId, hotplaceKey, kyushuData) => {
  if (!validateHotplaceData(cityId, hotplaceKey, kyushuData)) {
    return null
  }
  return kyushuData[cityId].hotplaces[hotplaceKey]
}

/**
 * 교통 데이터가 유효한지 검증
 * @param {object} transportData - 교통 데이터 객체
 * @returns {boolean}
 */
export const validateTransportData = (transportData) => {
  if (!transportData || typeof transportData !== 'object') {
    console.error('Invalid transportData:', transportData)
    return false
  }
  
  // 필수 필드 체크
  const requiredFields = ['distance', 'options']
  for (const field of requiredFields) {
    if (!(field in transportData)) {
      console.error(`Missing required field '${field}' in transport data`)
      return false
    }
  }
  
  if (!Array.isArray(transportData.options)) {
    console.error('Transport options must be an array')
    return false
  }
  
  // 각 옵션 검증
  for (let i = 0; i < transportData.options.length; i++) {
    const option = transportData.options[i]
    const requiredOptionFields = ['type', 'name', 'duration', 'price', 'frequency']
    
    for (const field of requiredOptionFields) {
      if (!(field in option)) {
        console.error(`Missing required field '${field}' in transport option ${i}`)
        return false
      }
    }
  }
  
  return true
}

/**
 * 안전하게 교통 데이터를 가져오는 함수
 * @param {Array<string>} selectedCities - 선택된 도시들
 * @param {object} transportData - 교통 데이터 객체
 * @returns {object|null}
 */
export const getTransportDataSafely = (selectedCities, transportData) => {
  if (!Array.isArray(selectedCities) || selectedCities.length !== 2) {
    console.error('Invalid selectedCities: must be array of 2 cities')
    return null
  }
  
  if (!transportData || typeof transportData !== 'object') {
    console.error('Invalid transportData object')
    return null
  }
  
  const [city1, city2] = selectedCities
  const possibleKeys = [
    `${city1}-${city2}`,
    `${city2}-${city1}`,
    `${city1.toLowerCase()}-${city2.toLowerCase()}`,
    `${city2.toLowerCase()}-${city1.toLowerCase()}`
  ]
  
  for (const key of possibleKeys) {
    if (transportData[key]) {
      const data = transportData[key]
      if (validateTransportData(data)) {
        return data
      }
    }
  }
  
  console.warn(`No valid transport data found for cities: ${city1} - ${city2}`)
  return null
}

/**
 * 레스토랑 데이터가 유효한지 검증
 * @param {object} restaurant - 레스토랑 객체
 * @returns {boolean}
 */
export const validateRestaurantData = (restaurant) => {
  if (!restaurant || typeof restaurant !== 'object') {
    return false
  }
  
  // 필수 필드 체크 (name은 최소한 있어야 함)
  if (!restaurant.name || typeof restaurant.name !== 'string') {
    return false
  }
  
  return true
}

/**
 * 핫플레이스 스팟 데이터가 유효한지 검증
 * @param {object} hotplaceSpot - 핫플레이스 스팟 객체
 * @returns {boolean}
 */
export const validateHotplaceSpotData = (hotplaceSpot) => {
  if (!hotplaceSpot || typeof hotplaceSpot !== 'object') {
    return false
  }
  
  // 필수 필드 체크 (name은 최소한 있어야 함)
  if (!hotplaceSpot.name || typeof hotplaceSpot.name !== 'string') {
    return false
  }
  
  return true
}

/**
 * 배열 데이터를 안전하게 필터링하는 함수
 * @param {Array} array - 필터링할 배열
 * @param {Function} validator - 검증 함수
 * @returns {Array}
 */
export const safeFilter = (array, validator) => {
  if (!Array.isArray(array)) {
    console.error('safeFilter: input is not an array')
    return []
  }
  
  if (typeof validator !== 'function') {
    console.error('safeFilter: validator is not a function')
    return []
  }
  
  return array.filter(item => {
    try {
      return validator(item)
    } catch (error) {
      console.error('safeFilter: validator function threw error:', error)
      return false
    }
  })
} 