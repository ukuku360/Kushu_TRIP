/**
 * localStorage 기반 백업 캐시 시스템
 * 메모리 캐시가 실패하거나 페이지 새로고침 시에도 데이터 유지
 */

class LocalStorageCache {
  constructor(keyPrefix = 'kushu_trip_', maxAge = 60 * 60 * 1000) { // 기본 1시간
    this.keyPrefix = keyPrefix;
    this.maxAge = maxAge;
    this.isSupported = this.checkSupport();
    
    if (!this.isSupported) {
      console.warn('⚠️ localStorage가 지원되지 않습니다. 메모리 캐시만 사용됩니다.');
    } else {
      console.log('✅ localStorage 백업 캐시 시스템 초기화 완료');
      // 시작 시 만료된 캐시 정리
      this.cleanupExpired();
    }
  }

  // localStorage 지원 여부 확인
  checkSupport() {
    try {
      const testKey = '__test_localStorage__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  // 캐시 키 생성
  generateKey(category, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${this.keyPrefix}${category}_${paramString}`;
  }

  // 캐시 데이터 저장
  set(key, data, customMaxAge = null) {
    if (!this.isSupported) return false;

    try {
      const cacheData = {
        data: data,
        timestamp: Date.now(),
        maxAge: customMaxAge || this.maxAge,
        version: '1.0' // 캐시 포맷 버전
      };

      const serialized = JSON.stringify(cacheData);
      localStorage.setItem(key, serialized);
      
      console.log(`💾 localStorage 캐시 저장: ${key} (${this.formatSize(serialized.length)})`);
      return true;
    } catch (error) {
      console.warn(`localStorage 저장 실패 (${key}):`, error.message);
      // 용량 초과 시 오래된 캐시 정리 후 재시도
      if (error.name === 'QuotaExceededError') {
        this.cleanupOldest(5); // 가장 오래된 5개 정리
        try {
          localStorage.setItem(key, JSON.stringify(cacheData));
          return true;
        } catch (retryError) {
          console.error('재시도 후에도 localStorage 저장 실패:', retryError.message);
        }
      }
      return false;
    }
  }

  // 캐시 데이터 조회
  get(key) {
    if (!this.isSupported) return null;

    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      
      // 캐시 만료 확인
      if (Date.now() - cacheData.timestamp > cacheData.maxAge) {
        localStorage.removeItem(key);
        console.log(`🗑️ 만료된 캐시 삭제: ${key}`);
        return null;
      }

      console.log(`📦 localStorage 캐시 히트: ${key}`);
      return cacheData.data;
    } catch (error) {
      console.warn(`localStorage 조회 실패 (${key}):`, error.message);
      // 손상된 캐시 데이터 삭제
      localStorage.removeItem(key);
      return null;
    }
  }

  // 캐시 삭제
  remove(key) {
    if (!this.isSupported) return false;
    
    try {
      localStorage.removeItem(key);
      console.log(`🗑️ localStorage 캐시 삭제: ${key}`);
      return true;
    } catch (error) {
      console.warn(`localStorage 삭제 실패 (${key}):`, error.message);
      return false;
    }
  }

  // 만료된 캐시 정리
  cleanupExpired() {
    if (!this.isSupported) return 0;

    let cleaned = 0;
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (!key.startsWith(this.keyPrefix)) continue;
      
      try {
        const cached = localStorage.getItem(key);
        if (!cached) continue;

        const cacheData = JSON.parse(cached);
        if (Date.now() - cacheData.timestamp > cacheData.maxAge) {
          localStorage.removeItem(key);
          cleaned++;
        }
      } catch (error) {
        // 손상된 데이터도 정리
        localStorage.removeItem(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 만료된 localStorage 캐시 ${cleaned}개 정리 완료`);
    }
    return cleaned;
  }

  // 가장 오래된 캐시 정리
  cleanupOldest(count = 5) {
    if (!this.isSupported) return 0;

    const cacheEntries = [];
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (!key.startsWith(this.keyPrefix)) continue;
      
      try {
        const cached = localStorage.getItem(key);
        if (!cached) continue;

        const cacheData = JSON.parse(cached);
        cacheEntries.push({
          key,
          timestamp: cacheData.timestamp,
          size: cached.length
        });
      } catch (error) {
        // 손상된 데이터는 즉시 삭제
        localStorage.removeItem(key);
      }
    }

    // 타임스탬프 기준 오름차순 정렬 (오래된 것부터)
    cacheEntries.sort((a, b) => a.timestamp - b.timestamp);
    
    let cleaned = 0;
    for (let i = 0; i < Math.min(count, cacheEntries.length); i++) {
      localStorage.removeItem(cacheEntries[i].key);
      cleaned++;
    }

    if (cleaned > 0) {
      console.log(`🧹 오래된 localStorage 캐시 ${cleaned}개 정리 완료`);
    }
    return cleaned;
  }

  // 카테고리별 캐시 정리
  clearCategory(category) {
    if (!this.isSupported) return 0;

    let cleared = 0;
    const keys = Object.keys(localStorage);
    const categoryPrefix = `${this.keyPrefix}${category}_`;
    
    for (const key of keys) {
      if (key.startsWith(categoryPrefix)) {
        localStorage.removeItem(key);
        cleared++;
      }
    }

    if (cleared > 0) {
      console.log(`🗑️ ${category} 카테고리 캐시 ${cleared}개 정리 완료`);
    }
    return cleared;
  }

  // 전체 캐시 삭제
  clear() {
    if (!this.isSupported) return 0;

    let cleared = 0;
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (key.startsWith(this.keyPrefix)) {
        localStorage.removeItem(key);
        cleared++;
      }
    }

    console.log(`🗑️ 전체 localStorage 캐시 ${cleared}개 정리 완료`);
    return cleared;
  }

  // 캐시 통계
  getStats() {
    if (!this.isSupported) {
      return {
        supported: false,
        count: 0,
        totalSize: 0,
        categories: {}
      };
    }

    const stats = {
      supported: true,
      count: 0,
      totalSize: 0,
      categories: {}
    };

    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (!key.startsWith(this.keyPrefix)) continue;
      
      try {
        const cached = localStorage.getItem(key);
        if (!cached) continue;

        const size = cached.length;
        stats.count++;
        stats.totalSize += size;

        // 카테고리 추출
        const category = key.replace(this.keyPrefix, '').split('_')[0];
        if (!stats.categories[category]) {
          stats.categories[category] = { count: 0, size: 0 };
        }
        stats.categories[category].count++;
        stats.categories[category].size += size;
      } catch (error) {
        // 손상된 캐시는 통계에서 제외
      }
    }

    return stats;
  }

  // 크기 포맷팅 유틸리티
  formatSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  // 캐시 상태 리포트
  printStats() {
    const stats = this.getStats();
    
    if (!stats.supported) {
      console.log('📊 localStorage 지원되지 않음');
      return;
    }

    console.log(`📊 localStorage 캐시 통계:`);
    console.log(`   총 ${stats.count}개 항목 (${this.formatSize(stats.totalSize)})`);
    
    Object.entries(stats.categories).forEach(([category, data]) => {
      console.log(`   ${category}: ${data.count}개 (${this.formatSize(data.size)})`);
    });
  }
}

// 싱글톤 인스턴스들
export const restaurantCache = new LocalStorageCache('kushu_restaurant_', 60 * 60 * 1000); // 1시간
export const hotplaceCache = new LocalStorageCache('kushu_hotplace_', 60 * 60 * 1000); // 1시간
export const reviewCache = new LocalStorageCache('kushu_review_', 24 * 60 * 60 * 1000); // 24시간
export const generalCache = new LocalStorageCache('kushu_general_', 30 * 60 * 1000); // 30분

export default LocalStorageCache; 