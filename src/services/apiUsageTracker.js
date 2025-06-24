// API 사용량 추적 서비스
class ApiUsageTracker {
  constructor() {
    this.storageKey = 'api_usage_tracker';
    this.initializeStorage();
  }

  // 스토리지 초기화
  initializeStorage() {
    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      const initialData = {
        gemini: {
          daily: { count: 0, date: this.getTodayString(), limit: 1500 },
          hourly: { count: 0, hour: this.getCurrentHour(), limit: 60 },
          total: 0,
          history: []
        },
        googlePlaces: {
          daily: { count: 0, date: this.getTodayString(), limit: 1000 },
          monthly: { count: 0, month: this.getCurrentMonth(), limit: 28000 },
          total: 0,
          history: []
        },
        brave: {
          daily: { count: 0, date: this.getTodayString(), limit: 2000 },
          monthly: { count: 0, month: this.getCurrentMonth(), limit: 50000 },
          total: 0,
          history: []
        }
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  // 현재 데이터 가져오기
  getData() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    
    // 날짜/시간 체크 및 리셋
    const today = this.getTodayString();
    const currentHour = this.getCurrentHour();
    const currentMonth = this.getCurrentMonth();
    
    // Gemini 일일/시간별 리셋
    if (data.gemini.daily.date !== today) {
      data.gemini.daily = { count: 0, date: today, limit: 1500 };
    }
    if (data.gemini.hourly.hour !== currentHour) {
      data.gemini.hourly = { count: 0, hour: currentHour, limit: 60 };
    }
    
    // Google Places 일일/월별 리셋
    if (data.googlePlaces.daily.date !== today) {
      data.googlePlaces.daily = { count: 0, date: today, limit: 1000 };
    }
    if (data.googlePlaces.monthly.month !== currentMonth) {
      data.googlePlaces.monthly = { count: 0, month: currentMonth, limit: 28000 };
    }
    
    // Brave Search 일일/월별 리셋
    if (data.brave.daily.date !== today) {
      data.brave.daily = { count: 0, date: today, limit: 2000 };
    }
    if (data.brave.monthly.month !== currentMonth) {
      data.brave.monthly = { count: 0, month: currentMonth, limit: 50000 };
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    return data;
  }

  // API 사용량 기록
  recordUsage(apiType, endpoint = '', responseSize = 0, success = true) {
    const data = this.getData();
    const timestamp = new Date().toISOString();
    
    if (!data[apiType]) {
      console.warn(`Unknown API type: ${apiType}`);
      return;
    }
    
    // 카운트 증가
    data[apiType].total++;
    
    if (apiType === 'gemini') {
      data[apiType].daily.count++;
      data[apiType].hourly.count++;
    } else {
      data[apiType].daily.count++;
      data[apiType].monthly.count++;
    }
    
    // 히스토리 추가 (최근 100개만 보관)
    const historyEntry = {
      timestamp,
      endpoint,
      responseSize,
      success,
      daily: data[apiType].daily.count,
      ...(apiType === 'gemini' ? { hourly: data[apiType].hourly.count } : { monthly: data[apiType].monthly.count })
    };
    
    data[apiType].history.unshift(historyEntry);
    if (data[apiType].history.length > 100) {
      data[apiType].history = data[apiType].history.slice(0, 100);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    
    // 경고 체크
    this.checkLimits(apiType, data[apiType]);
    
    return data[apiType];
  }

  // 한도 체크 및 경고
  checkLimits(apiType, apiData) {
    const warnings = [];
    
    if (apiType === 'gemini') {
      // 시간별 체크
      const hourlyUsage = (apiData.hourly.count / apiData.hourly.limit) * 100;
      if (hourlyUsage >= 90) {
        warnings.push(`⚠️ Gemini API 시간별 한도 ${hourlyUsage.toFixed(1)}% 사용 (${apiData.hourly.count}/${apiData.hourly.limit})`);
      }
      
      // 일일 체크
      const dailyUsage = (apiData.daily.count / apiData.daily.limit) * 100;
      if (dailyUsage >= 80) {
        warnings.push(`⚠️ Gemini API 일일 한도 ${dailyUsage.toFixed(1)}% 사용 (${apiData.daily.count}/${apiData.daily.limit})`);
      }
    } else {
      // 일일 체크
      const dailyUsage = (apiData.daily.count / apiData.daily.limit) * 100;
      if (dailyUsage >= 80) {
        warnings.push(`⚠️ ${apiType} API 일일 한도 ${dailyUsage.toFixed(1)}% 사용 (${apiData.daily.count}/${apiData.daily.limit})`);
      }
      
      // 월별 체크
      if (apiData.monthly) {
        const monthlyUsage = (apiData.monthly.count / apiData.monthly.limit) * 100;
        if (monthlyUsage >= 80) {
          warnings.push(`⚠️ ${apiType} API 월별 한도 ${monthlyUsage.toFixed(1)}% 사용 (${apiData.monthly.count}/${apiData.monthly.limit})`);
        }
      }
    }
    
    // 경고 표시
    warnings.forEach(warning => console.warn(warning));
    
    return warnings;
  }

  // 사용량 통계
  getUsageStats() {
    const data = this.getData();
    const stats = {};
    
    Object.keys(data).forEach(apiType => {
      const api = data[apiType];
      stats[apiType] = {
        total: api.total,
        today: api.daily.count,
        todayPercent: ((api.daily.count / api.daily.limit) * 100).toFixed(1),
        recentActivity: api.history.slice(0, 5)
      };
      
      if (apiType === 'gemini') {
        stats[apiType].thisHour = api.hourly.count;
        stats[apiType].hourlyPercent = ((api.hourly.count / api.hourly.limit) * 100).toFixed(1);
      } else if (api.monthly) {
        stats[apiType].thisMonth = api.monthly.count;
        stats[apiType].monthlyPercent = ((api.monthly.count / api.monthly.limit) * 100).toFixed(1);
      }
    });
    
    return stats;
  }

  // 데이터 내보내기
  exportData() {
    const data = this.getData();
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      summary: this.getUsageStats()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-usage-${this.getTodayString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 데이터 초기화
  resetData() {
    if (confirm('정말로 모든 API 사용량 데이터를 초기화하시겠습니까?')) {
      localStorage.removeItem(this.storageKey);
      this.initializeStorage();
      console.log('✅ API 사용량 데이터가 초기화되었습니다.');
      return true;
    }
    return false;
  }

  // 유틸리티 메서드
  getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  getCurrentHour() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}`;
  }

  getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // 실시간 업데이트를 위한 이벤트 시스템
  onUsageUpdate(callback) {
    window.addEventListener('apiUsageUpdate', callback);
  }

  offUsageUpdate(callback) {
    window.removeEventListener('apiUsageUpdate', callback);
  }

  triggerUpdate() {
    window.dispatchEvent(new CustomEvent('apiUsageUpdate', { detail: this.getUsageStats() }));
  }
}

// 싱글톤 인스턴스
const apiUsageTracker = new ApiUsageTracker();

// 전역 접근 가능하도록 설정
if (typeof window !== 'undefined') {
  window.apiUsageTracker = apiUsageTracker;
}

export default apiUsageTracker; 