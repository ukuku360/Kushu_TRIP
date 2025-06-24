// 성능 모니터링 유틸리티
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.isEnabled = import.meta.env.DEV; // 개발 환경에서만 활성화
    this.observers = new Map();
    this.renderTimes = [];
    this.maxRenderTimeHistory = 100;
  }

  // 렌더링 시간 측정 시작
  startRender(componentName) {
    if (!this.isEnabled) return null;
    
    const startTime = performance.now();
    const markName = `${componentName}-render-start`;
    performance.mark(markName);
    
    return {
      componentName,
      startTime,
      markName,
      end: () => this.endRender(componentName, startTime, markName)
    };
  }

  // 렌더링 시간 측정 종료
  endRender(componentName, startTime, markName) {
    if (!this.isEnabled) return;
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const endMarkName = `${componentName}-render-end`;
    
    performance.mark(endMarkName);
    performance.measure(`${componentName}-render`, markName, endMarkName);
    
    // 메트릭 저장
    this.recordMetric('render', {
      component: componentName,
      duration,
      timestamp: endTime
    });

    // 긴 렌더링 시간 경고
    if (duration > 16) { // 60fps 기준
      console.warn(`🐌 느린 렌더링 감지: ${componentName} (${duration.toFixed(2)}ms)`);
    }

    // 렌더링 시간 히스토리 관리
    this.renderTimes.push({ componentName, duration, timestamp: endTime });
    if (this.renderTimes.length > this.maxRenderTimeHistory) {
      this.renderTimes.shift();
    }
  }

  // API 호출 시간 측정
  async measureAPI(operation, apiCall) {
    if (!this.isEnabled) {
      return await apiCall();
    }

    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      
      this.recordMetric('api', {
        operation,
        duration,
        success: true,
        timestamp: Date.now()
      });

      if (duration > 2000) { // 2초 이상
        console.warn(`🐌 느린 API 호출: ${operation} (${duration.toFixed(2)}ms)`);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.recordMetric('api', {
        operation,
        duration,
        success: false,
        error: error.message,
        timestamp: Date.now()
      });

      throw error;
    }
  }

  // 메트릭 기록
  recordMetric(type, data) {
    if (!this.isEnabled) return;
    
    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }
    
    this.metrics.get(type).push({
      ...data,
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    // 메트릭 개수 제한 (메모리 누수 방지)
    const typeMetrics = this.metrics.get(type);
    if (typeMetrics.length > 1000) {
      typeMetrics.splice(0, 100); // 가장 오래된 100개 제거
    }
  }

  // 메모리 사용량 측정
  measureMemory() {
    if (!this.isEnabled || !performance.memory) return null;
    
    const memory = {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
      timestamp: Date.now()
    };

    this.recordMetric('memory', memory);

    // 메모리 사용량 경고
    const usagePercent = (memory.used / memory.limit) * 100;
    if (usagePercent > 80) {
      console.warn(`⚠️ 높은 메모리 사용량: ${usagePercent.toFixed(1)}% (${memory.used}MB/${memory.limit}MB)`);
    }

    return memory;
  }

  // FPS 측정
  startFPSMonitoring() {
    if (!this.isEnabled) return;
    
    let frames = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        
        this.recordMetric('fps', {
          fps,
          timestamp: Date.now()
        });

        if (fps < 30) {
          console.warn(`📉 낮은 FPS 감지: ${fps} fps`);
        }

        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  // 번들 크기 분석
  analyzeBundleSize() {
    if (!this.isEnabled || typeof window === 'undefined') return;
    
    // 스크립트 태그들의 크기 추정
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const totalScripts = scripts.length;
    
    console.log(`📦 번들 분석: ${totalScripts}개의 스크립트 로드됨`);
    
    return {
      scriptCount: totalScripts,
      timestamp: Date.now()
    };
  }

  // 성능 리포트 생성
  generateReport() {
    if (!this.isEnabled) return null;
    
    const report = {
      timestamp: new Date().toISOString(),
      metrics: {}
    };

    // 각 메트릭 타입별 통계
    for (const [type, data] of this.metrics.entries()) {
      if (data.length === 0) continue;
      
      const durations = data
        .filter(item => typeof item.duration === 'number')
        .map(item => item.duration);
      
      if (durations.length > 0) {
        report.metrics[type] = {
          count: data.length,
          avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
          minDuration: Math.min(...durations),
          maxDuration: Math.max(...durations),
          lastUpdated: Math.max(...data.map(item => item.timestamp || 0))
        };
      }
    }

    // 최근 렌더링 성능
    if (this.renderTimes.length > 0) {
      const recentRenders = this.renderTimes.slice(-10);
      report.recentRenderPerformance = {
        components: recentRenders.map(r => ({
          name: r.componentName,
          duration: r.duration
        })),
        averageDuration: recentRenders.reduce((a, b) => a + b.duration, 0) / recentRenders.length
      };
    }

    return report;
  }

  // 성능 경고 설정
  setPerformanceThresholds(thresholds) {
    this.thresholds = {
      renderTime: 16, // ms
      apiCallTime: 2000, // ms
      memoryUsage: 80, // percent
      fps: 30,
      ...thresholds
    };
  }

  // 메트릭 초기화
  clearMetrics() {
    this.metrics.clear();
    this.renderTimes = [];
  }

  // 성능 모니터링 활성화/비활성화
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  // 성능 데이터 내보내기
  exportMetrics() {
    const data = {
      metrics: Object.fromEntries(this.metrics),
      renderTimes: this.renderTimes,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

// 싱글톤 인스턴스
const performanceMonitor = new PerformanceMonitor();

// React 컴포넌트 성능 측정을 위한 HOC
export const withPerformanceMonitoring = (Component) => {
  const WrappedComponent = React.forwardRef((props, ref) => {
    const renderMeasure = performanceMonitor.startRender(Component.displayName || Component.name);
    
    React.useEffect(() => {
      if (renderMeasure) {
        renderMeasure.end();
      }
    });

    return React.createElement(Component, { ...props, ref });
  });

  WrappedComponent.displayName = `withPerformanceMonitoring(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default performanceMonitor; 