// API 클라이언트 - 실제 백엔드 연동
class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    this.timeout = 10000; // 10초
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1초
  }

  // 기본 fetch 래퍼
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // 타임아웃 컨트롤러
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('요청 시간이 초과되었습니다.', 408);
      }
      throw error;
    }
  }

  // 재시도 로직이 포함된 request
  async requestWithRetry(endpoint, options = {}) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await this.request(endpoint, options);
      } catch (error) {
        lastError = error;
        
        // 4xx 에러는 재시도 안함
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        // 마지막 시도면 에러 던지기
        if (attempt === this.retryAttempts) {
          throw error;
        }
        
        // 지연 후 재시도
        await this.delay(this.retryDelay * attempt);
      }
    }
    
    throw lastError;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET 요청
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.requestWithRetry(url, { method: 'GET' });
  }

  // POST 요청
  async post(endpoint, data = {}) {
    return this.requestWithRetry(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT 요청
  async put(endpoint, data = {}) {
    return this.requestWithRetry(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE 요청
  async delete(endpoint) {
    return this.requestWithRetry(endpoint, { method: 'DELETE' });
  }
}

// 커스텀 에러 클래스
class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// 싱글톤 인스턴스
const apiClient = new ApiClient();

export { apiClient, ApiError };
export default apiClient; 