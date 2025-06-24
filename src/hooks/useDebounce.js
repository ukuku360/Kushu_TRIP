import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// 디바운스 훅
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// 스로틀 훅
export const useThrottle = (value, limit) => {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

// 이전 값 추적 훅
export const usePrevious = (value) => {
  const ref = useRef()
  
  useEffect(() => {
    ref.current = value
  })
  
  return ref.current
}

// 지연된 로딩 훅
export const useDelayedLoading = (isLoading, delay = 300) => {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    let timeoutId

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true)
      }, delay)
    } else {
      setShowLoading(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading, delay])

  return showLoading
}

// 안전한 상태 업데이트 훅 (언마운트된 컴포넌트에서 상태 업데이트 방지)
export const useSafeState = (initialState) => {
  const [state, setState] = useState(initialState)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const setSafeState = useCallback((newState) => {
    if (isMountedRef.current) {
      setState(newState)
    }
  }, [])

  return [state, setSafeState]
}

// 로컬 스토리지 훅
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`localStorage에서 ${key} 읽기 실패:`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`localStorage에 ${key} 저장 실패:`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

// 인터섹션 옵저버 훅 (지연 로딩용)
export const useIntersectionObserver = (elementRef, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, {
      threshold: 0.1,
      ...options
    })

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return isIntersecting
}

// 윈도우 크기 추적 훅
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = useThrottle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }, 100)

    const throttledResize = () => handleResize()

    window.addEventListener('resize', throttledResize)
    return () => window.removeEventListener('resize', throttledResize)
  }, [])

  return windowSize
}

// 비동기 상태 관리 훅
export const useAsync = (asyncFunction, dependencies = []) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null
  })

  const execute = useCallback(async (...args) => {
    setState({ loading: true, error: null, data: null })
    
    try {
      const data = await asyncFunction(...args)
      setState({ loading: false, error: null, data })
      return data
    } catch (error) {
      setState({ loading: false, error, data: null })
      throw error
    }
  }, dependencies)

  return { ...state, execute }
}

// 메모이제이션된 검색 훅
export const useMemoizedSearch = (items, searchTerm, searchFields = ['name']) => {
  return useMemo(() => {
    if (!searchTerm || !Array.isArray(items)) return items

    const lowercaseSearchTerm = searchTerm.toLowerCase()
    
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field]
        return value && 
               typeof value === 'string' && 
               value.toLowerCase().includes(lowercaseSearchTerm)
      })
    )
  }, [items, searchTerm, searchFields])
}

export default {
  useDebounce,
  useThrottle,
  usePrevious,
  useDelayedLoading,
  useSafeState,
  useLocalStorage,
  useIntersectionObserver,
  useWindowSize,
  useAsync,
  useMemoizedSearch
} 