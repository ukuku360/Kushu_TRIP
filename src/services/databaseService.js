class DatabaseService {
  constructor() {
    this.isConnected = false;
    this.cache = new Map();
    
    console.log('💾 Database Service initialized (Frontend-only mode)');
    console.log('🔄 백엔드 없이 메모리 캐시만 사용합니다');
  }

  // Mock connection test - always succeeds
  async testConnection() {
    console.log('✅ Frontend-only mode - 백엔드 연결 불필요');
    this.isConnected = true;
    return { success: true, message: 'Frontend-only mode' };
  }

  // Mock stats
  async getStats() {
    return {
      connected: true,
      restaurants: 0,
      hotplaces: 0,
      quota: { used: 0, limit: 1000 },
      lastUpdate: new Date().toISOString()
    };
  }

  // Cache-based restaurant methods
  async getRestaurants(cityId, foodType) {
    const key = `restaurants_${cityId}_${foodType}`;
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour
      console.log('📦 캐시에서 레스토랑 데이터 로드:', key);
      return cached.data;
    }
    
    return null; // No cached data
  }

  async saveRestaurants(cityId, foodType, data) {
    const key = `restaurants_${cityId}_${foodType}`;
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log('💾 레스토랑 데이터 캐시 저장:', key);
  }

  // Cache-based hotplace methods
  async getHotplaces(cityId, placeType) {
    const key = `hotplaces_${cityId}_${placeType}`;
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour
      console.log('📦 캐시에서 핫플레이스 데이터 로드:', key);
      return cached.data;
    }
    
    return null; // No cached data
  }

  async saveHotplaces(cityId, placeType, data) {
    const key = `hotplaces_${cityId}_${placeType}`;
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log('💾 핫플레이스 데이터 캐시 저장:', key);
  }

  // Mock cleanup
  async cleanupExpiredData() {
    let removed = 0;
    const now = Date.now();
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > 3600000) { // 1 hour
        this.cache.delete(key);
        removed++;
      }
    }
    
    console.log(`🧹 만료된 캐시 ${removed}개 정리 완료`);
    return removed;
  }

  // Mock health check
  async healthCheck() {
    return { status: 'OK', mode: 'frontend-only' };
  }
}

const databaseService = new DatabaseService();

// Initialize immediately
databaseService.testConnection();

export default databaseService; 