import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import databaseService from '../services/databaseService.js';
import { restaurantCache, hotplaceCache, reviewCache, generalCache } from '../utils/localStorageCache.js';

const QuotaMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    connected: true,
    restaurants: 0,
    hotplaces: 0,
    quota: { used: 0, limit: 1000 },
    lastUpdate: new Date().toISOString()
  });

  // localStorage 캐시 통계
  const [cacheStats, setCacheStats] = useState({
    restaurants: { count: 0, size: 0 },
    hotplaces: { count: 0, size: 0 },
    reviews: { count: 0, size: 0 },
    general: { count: 0, size: 0 },
    totalSize: 0
  });

  // Mock API usage tracking for frontend-only mode
  const [apiUsage, setApiUsage] = useState({
    places: { used: 0, limit: 1000 },
    gemini: { used: 0, limit: 1000 }
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        // 데이터베이스 통계
        const dbStats = await databaseService.getStats();
        setStats(dbStats);

        // localStorage 캐시 통계
        const restaurantStats = restaurantCache.getStats();
        const hotplaceStats = hotplaceCache.getStats();
        const reviewStats = reviewCache.getStats();
        const generalStats = generalCache.getStats();

        setCacheStats({
          restaurants: {
            count: Object.values(restaurantStats.categories).reduce((sum, cat) => sum + cat.count, 0),
            size: restaurantStats.totalSize
          },
          hotplaces: {
            count: Object.values(hotplaceStats.categories).reduce((sum, cat) => sum + cat.count, 0),
            size: hotplaceStats.totalSize
          },
          reviews: {
            count: Object.values(reviewStats.categories).reduce((sum, cat) => sum + cat.count, 0),
            size: reviewStats.totalSize
          },
          general: {
            count: Object.values(generalStats.categories).reduce((sum, cat) => sum + cat.count, 0),
            size: generalStats.totalSize
          },
          totalSize: restaurantStats.totalSize + hotplaceStats.totalSize + reviewStats.totalSize + generalStats.totalSize
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCleanup = async () => {
    try {
      // 데이터베이스 캐시 정리
      const dbRemoved = await databaseService.cleanupExpiredData();
      
      // localStorage 캐시 정리
      const restaurantRemoved = restaurantCache.cleanupExpired();
      const hotplaceRemoved = hotplaceCache.cleanupExpired();
      const reviewRemoved = reviewCache.cleanupExpired();
      const generalRemoved = generalCache.cleanupExpired();
      
      const totalRemoved = dbRemoved + restaurantRemoved + hotplaceRemoved + reviewRemoved + generalRemoved;
      
      alert(`🧹 총 ${totalRemoved}개의 만료된 캐시 항목을 정리했습니다.\n` +
            `- 데이터베이스: ${dbRemoved}개\n` +
            `- localStorage: ${restaurantRemoved + hotplaceRemoved + reviewRemoved + generalRemoved}개`);
      
      // 통계 새로고침
      const dbStats = await databaseService.getStats();
      setStats(dbStats);
    } catch (error) {
      alert('정리 중 오류가 발생했습니다: ' + error.message);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-600 transition-colors"
        title="시스템 상태 확인"
      >
        📊
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-xl p-4 z-50 max-w-md w-80"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg flex items-center">
          📊 시스템 상태
        </h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">연결 상태</span>
            <span className="text-green-600 font-bold">
              {stats.connected ? '✅ 정상' : '❌ 오류'}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            프론트엔드 전용 모드
          </div>
        </div>

        {/* Cache Statistics */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium mb-2">캐시 통계</h4>
          <div className="space-y-2 text-sm">
            <div className="border-b pb-1">
              <div className="font-medium text-gray-700">메모리 캐시</div>
              <div className="flex justify-between">
                <span>레스토랑:</span>
                <span>{stats.restaurants}개</span>
              </div>
              <div className="flex justify-between">
                <span>핫플레이스:</span>
                <span>{stats.hotplaces}개</span>
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-700">localStorage 백업</div>
              <div className="flex justify-between">
                <span>레스토랑:</span>
                <span>{cacheStats.restaurants.count}개 ({formatSize(cacheStats.restaurants.size)})</span>
              </div>
              <div className="flex justify-between">
                <span>핫플레이스:</span>
                <span>{cacheStats.hotplaces.count}개 ({formatSize(cacheStats.hotplaces.size)})</span>
              </div>
              <div className="flex justify-between">
                <span>리뷰:</span>
                <span>{cacheStats.reviews.count}개 ({formatSize(cacheStats.reviews.size)})</span>
              </div>
              <div className="flex justify-between font-medium text-blue-600 border-t pt-1">
                <span>총 용량:</span>
                <span>{formatSize(cacheStats.totalSize)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* API Quota (Mock) */}
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h4 className="font-medium mb-2">API 사용량 (추정)</h4>
          <div className="space-y-2 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <span>Google Places:</span>
                <span>{apiUsage.places.used}/{apiUsage.places.limit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(apiUsage.places.used / apiUsage.places.limit) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Gemini AI:</span>
                <span>{apiUsage.gemini.used}/{apiUsage.gemini.limit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(apiUsage.gemini.used / apiUsage.gemini.limit) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleCleanup}
            className="w-full bg-orange-500 text-white px-3 py-2 rounded text-sm hover:bg-orange-600 transition-colors"
          >
            🧹 전체 캐시 정리
          </button>
          <button
            onClick={() => {
              restaurantCache.printStats();
              hotplaceCache.printStats();
              reviewCache.printStats();
              generalCache.printStats();
            }}
            className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
          >
            📊 캐시 상세 통계 (콘솔)
          </button>
        </div>

        {/* Last Update */}
        <div className="text-xs text-gray-500 text-center">
          마지막 업데이트: {new Date(stats.lastUpdate).toLocaleTimeString('ko-KR')}
        </div>
      </div>
    </motion.div>
  );

  // 크기 포맷팅 유틸리티
  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }
};

export default QuotaMonitor; 