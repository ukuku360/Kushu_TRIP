import trendingDataService from './trendingDataService.js';

class DataUpdateScheduler {
  constructor() {
    this.updateInterval = 24 * 60 * 60 * 1000; // 24시간
    this.isUpdating = false;
    this.updateProgress = 0;
    this.totalTasks = 0;
    
    // 업데이트할 데이터 정의
    this.updateTasks = [
      // 맛집 데이터
      { type: 'restaurants', cityId: 'fukuoka', category: 'ramen' },
      { type: 'restaurants', cityId: 'fukuoka', category: 'mentaiko' },
      { type: 'restaurants', cityId: 'fukuoka', category: 'motsunabe' },
      { type: 'restaurants', cityId: 'kurume', category: 'yakitori' },
      { type: 'restaurants', cityId: 'kurume', category: 'ramen' },
      { type: 'restaurants', cityId: 'kurume', category: 'udon' },
      { type: 'restaurants', cityId: 'kumamoto', category: 'basashi' },
      { type: 'restaurants', cityId: 'kumamoto', category: 'tonkotsu' },
      { type: 'restaurants', cityId: 'kumamoto', category: 'karashi' },
      { type: 'restaurants', cityId: 'nagasaki', category: 'champon' },
      { type: 'restaurants', cityId: 'nagasaki', category: 'sara_udon' },
      { type: 'restaurants', cityId: 'nagasaki', category: 'kasutera' },
      { type: 'restaurants', cityId: 'sasebo', category: 'burger' },
      { type: 'restaurants', cityId: 'sasebo', category: 'kujira' },
      { type: 'restaurants', cityId: 'sasebo', category: 'oyster' },
      { type: 'restaurants', cityId: 'oita', category: 'bungo_beef' },
      { type: 'restaurants', cityId: 'oita', category: 'jigoku_mushi' },
      { type: 'restaurants', cityId: 'oita', category: 'dango' },
      
      // 핫플레이스 데이터
      { type: 'hotplaces', cityId: 'fukuoka', category: 'ohori_park' },
      { type: 'hotplaces', cityId: 'fukuoka', category: 'dazaifu' },
      { type: 'hotplaces', cityId: 'fukuoka', category: 'canal_city' },
      { type: 'hotplaces', cityId: 'kurume', category: 'inari_shrine' },
      { type: 'hotplaces', cityId: 'kurume', category: 'chikugo_river' },
      { type: 'hotplaces', cityId: 'kurume', category: 'ishibashi_bunka' },
      { type: 'hotplaces', cityId: 'kumamoto', category: 'kumamoto_castle' },
      { type: 'hotplaces', cityId: 'kumamoto', category: 'suizenji' },
      { type: 'hotplaces', cityId: 'kumamoto', category: 'aso_shrine' },
      { type: 'hotplaces', cityId: 'nagasaki', category: 'glover_garden' },
      { type: 'hotplaces', cityId: 'nagasaki', category: 'peace_park' },
      { type: 'hotplaces', cityId: 'nagasaki', category: 'dejima' },
      { type: 'hotplaces', cityId: 'sasebo', category: 'kujukushima' },
      { type: 'hotplaces', cityId: 'sasebo', category: 'sasebo_navy' },
      { type: 'hotplaces', cityId: 'sasebo', category: 'huis_ten_bosch' },
      { type: 'hotplaces', cityId: 'oita', category: 'beppu_onsen' },
      { type: 'hotplaces', cityId: 'oita', category: 'yufuin' },
      { type: 'hotplaces', cityId: 'oita', category: 'usuki' }
    ];
    
    this.totalTasks = this.updateTasks.length;
  }

  getLastUpdateTime() {
    const stored = localStorage.getItem('lastDataUpdate');
    return stored ? parseInt(stored) : 0;
  }

  setLastUpdateTime(timestamp = Date.now()) {
    localStorage.setItem('lastDataUpdate', timestamp.toString());
  }

  shouldUpdate() {
    const lastUpdate = this.getLastUpdateTime();
    const now = Date.now();
    return (now - lastUpdate) > this.updateInterval;
  }

  async initialize() {
    // 캐시 복원
    trendingDataService.loadCacheFromStorage();
    
    // 업데이트 필요 여부 확인
    if (this.shouldUpdate()) {
      console.log('데이터가 오래되었습니다. 백그라운드 업데이트를 시작합니다.');
      this.updateInBackground();
    } else {
      const lastUpdate = new Date(this.getLastUpdateTime());
      console.log('데이터가 최신입니다. 마지막 업데이트:', lastUpdate.toLocaleString());
    }
  }

  async updateInBackground() {
    if (this.isUpdating) {
      console.log('이미 업데이트 중입니다.');
      return;
    }

    this.isUpdating = true;
    this.updateProgress = 0;
    
    console.log('🔄 트렌딩 데이터 업데이트 시작');
    
    try {
      for (let i = 0; i < this.updateTasks.length; i++) {
        const task = this.updateTasks[i];
        
        try {
          await this.updateSingleTask(task);
          this.updateProgress = Math.round(((i + 1) / this.totalTasks) * 100);
          
          console.log(`✅ ${task.type} ${task.cityId}/${task.category} 완료 (${this.updateProgress}%)`);
          
          // API 호출 간격 조절 (과부하 방지)
          await this.delay(1000);
          
        } catch (error) {
          console.warn(`❌ ${task.type} ${task.cityId}/${task.category} 실패:`, error.message);
          // 실패해도 계속 진행
        }
      }
      
      this.setLastUpdateTime();
      console.log('🎉 트렌딩 데이터 업데이트 완료');
      
    } catch (error) {
      console.error('전체 업데이트 프로세스 실패:', error);
    } finally {
      this.isUpdating = false;
      this.updateProgress = 100;
    }
  }

  async updateSingleTask(task) {
    const { type, cityId, category } = task;
    
    let data;
    if (type === 'restaurants') {
      data = await trendingDataService.fetchTrendingRestaurants(cityId, category);
    } else if (type === 'hotplaces') {
      data = await trendingDataService.fetchTrendingHotplaces(cityId, category);
    }
    
    if (data && data.length > 0) {
      const cacheKey = trendingDataService.getCacheKey(type, cityId, category);
      trendingDataService.setCache(cacheKey, data);
    }
  }

  async forceUpdate() {
    // 강제 업데이트 (테스트용)
    console.log('🔧 강제 업데이트 시작');
    await this.updateInBackground();
  }

  async updateSpecificData(type, cityId, category) {
    // 특정 데이터만 업데이트
    try {
      await this.updateSingleTask({ type, cityId, category });
      console.log(`✅ ${type} ${cityId}/${category} 개별 업데이트 완료`);
    } catch (error) {
      console.error(`❌ ${type} ${cityId}/${category} 개별 업데이트 실패:`, error);
      throw error;
    }
  }

  getUpdateStatus() {
    return {
      isUpdating: this.isUpdating,
      progress: this.updateProgress,
      lastUpdate: new Date(this.getLastUpdateTime()),
      nextUpdate: new Date(this.getLastUpdateTime() + this.updateInterval),
      shouldUpdate: this.shouldUpdate()
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 개발용 메서드들
  clearAllCache() {
    localStorage.clear();
    trendingDataService.cache.clear();
    console.log('🗑️ 모든 캐시 삭제됨');
  }

  setCacheExpiry(hours) {
    this.updateInterval = hours * 60 * 60 * 1000;
    console.log(`⏰ 캐시 만료 시간이 ${hours}시간으로 설정됨`);
  }
}

const dataUpdateScheduler = new DataUpdateScheduler();

export default dataUpdateScheduler; 