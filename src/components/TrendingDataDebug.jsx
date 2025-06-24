import React, { useState, useEffect } from 'react';
import hybridDataService from '../services/hybridDataService.js';
import dataUpdateScheduler from '../services/dataUpdateScheduler.js';
import trendingDataService from '../services/trendingDataService';
import reviewSummaryService from '../services/reviewSummaryService';
import googleMapsReviewScraper from '../services/googleMapsReviewScraper';
import googlePlacesService from '../utils/googlePlacesAPI.js';

const TrendingDataDebug = () => {
  const [status, setStatus] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});
  const [reviewTestResult, setReviewTestResult] = useState(null);
  const [geminiTestResult, setGeminiTestResult] = useState(null);
  const [restaurantTestResult, setRestaurantTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message) => {
    setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const loadStatus = async () => {
    try {
      const dataStatus = hybridDataService.getAllDataStatus();
      setStatus(dataStatus);
    } catch (error) {
      addLog(`상태 로드 실패: ${error.message}`);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5000); // 5초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const handleForceUpdate = async () => {
    setIsUpdating(true);
    addLog('전체 강제 업데이트 시작...');
    
    try {
      await hybridDataService.forceBulkUpdate();
      addLog('전체 업데이트 완료!');
      loadStatus();
    } catch (error) {
      addLog(`업데이트 실패: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSingleUpdate = async (type, cityId, category) => {
    addLog(`개별 업데이트 시작: ${type}/${cityId}/${category}`);
    
    try {
      await hybridDataService.refreshTrendingData(type, cityId, category);
      addLog(`개별 업데이트 완료: ${type}/${cityId}/${category}`);
      loadStatus();
    } catch (error) {
      addLog(`개별 업데이트 실패: ${error.message}`);
    }
  };

  const handleClearCache = () => {
    hybridDataService.clearAllCache();
    addLog('모든 캐시 삭제됨');
    loadStatus();
  };

  const handleSetApiKey = () => {
    const key = prompt('Brave Search API 키를 입력하세요:');
    if (key) {
      hybridDataService.setApiKey(key);
      addLog('API 키가 설정되었습니다');
    }
  };

  // 기존 트렌딩 데이터 테스트
  const testTrendingData = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 트렌딩 데이터 서비스 테스트 시작');
      
      const result = await trendingDataService.getFoodTrends('fukuoka');
      
      setDebugInfo({
        success: true,
        result: result,
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ 트렌딩 데이터 테스트 완료:', result);
    } catch (error) {
      console.error('❌ 트렌딩 데이터 테스트 실패:', error);
      setDebugInfo({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 리뷰 시스템 테스트
  const testReviewSystem = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 리뷰 시스템 테스트 시작');
      
      const restaurantName = '일란 라멘 본점';
      const cityName = '후쿠오카';
      const rating = 4.7;
      
      // Mock 리뷰 생성
      const mockReviews = googleMapsReviewScraper.generateRealisticMockReviews(
        restaurantName, 
        cityName, 
        rating
      );
      
      // 제미나이로 요약
      const summary = await reviewSummaryService.summarizeReviews(mockReviews, restaurantName);
      
      setReviewTestResult({
        success: true,
        restaurantName,
        cityName,
        originalRating: rating,
        generatedReviews: mockReviews.length,
        avgGeneratedRating: (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1),
        summary: summary,
        sampleReviews: mockReviews.slice(0, 3),
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ 리뷰 시스템 테스트 완료');
    } catch (error) {
      console.error('❌ 리뷰 시스템 테스트 실패:', error);
      setReviewTestResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gemini API 연결 테스트
  const testGeminiConnection = async () => {
    setIsLoading(true);
    try {
      const result = await reviewSummaryService.testGeminiConnection();
      setGeminiTestResult(result);
    } catch (error) {
      setGeminiTestResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Places API 테스트
  const testGooglePlaces = async () => {
    setIsLoading(true);
    try {
      const restaurants = await googlePlacesService.searchRestaurants('ramen restaurant', 'Fukuoka');
      setRestaurantTestResult({
        success: true,
        count: restaurants.length,
        restaurants: restaurants.slice(0, 3)
      });
    } catch (error) {
      setRestaurantTestResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 리뷰 요약 테스트
  const testReviewSummary = async () => {
    setIsLoading(true);
    try {
      const result = await reviewSummaryService.testReviewSummary('이치란 라멘', '후쿠오카');
      setRestaurantTestResult({
        success: true,
        type: 'review_summary',
        result: result
      });
    } catch (error) {
      setRestaurantTestResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!status) {
    return <div className="p-4">상태 로딩 중...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">🔧 트렌딩 데이터 디버그</h3>
        <button 
          onClick={() => setStatus(null)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* 전체 상태 */}
      <div className="mb-3 text-sm">
        <div>업데이트 중: {status.global.isUpdating ? '✅' : '❌'}</div>
        <div>진행률: {status.global.progress}%</div>
        <div>마지막 업데이트: {status.global.lastUpdate.toLocaleString()}</div>
      </div>

      {/* 제어 버튼들 */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleForceUpdate}
          disabled={isUpdating}
          className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
        >
          {isUpdating ? '업데이트 중...' : '전체 업데이트'}
        </button>
        <button
          onClick={handleClearCache}
          className="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-700"
        >
          캐시 삭제
        </button>
        <button
          onClick={handleSetApiKey}
          className="px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-700"
        >
          API 키
        </button>
      </div>

      {/* 데이터 상태 요약 */}
      <div className="mb-3 text-xs">
        <div className="mb-2 font-semibold">데이터 상태:</div>
        {Object.entries(status.restaurants).map(([city, foods]) => {
          const trendingCount = Object.values(foods).filter(f => f.source === 'trending').length;
          const totalCount = Object.values(foods).length;
          return (
            <div key={city} className="flex justify-between">
              <span>{city} 맛집:</span>
              <span>{trendingCount}/{totalCount} 트렌딩</span>
            </div>
          );
        })}
        {Object.entries(status.hotplaces).map(([city, places]) => {
          const trendingCount = Object.values(places).filter(p => p.source === 'trending').length;
          const totalCount = Object.values(places).length;
          return (
            <div key={city} className="flex justify-between">
              <span>{city} 핫플:</span>
              <span>{trendingCount}/{totalCount} 트렌딩</span>
            </div>
          );
        })}
      </div>

      {/* 빠른 테스트 */}
      <div className="mb-3">
        <div className="text-xs font-semibold mb-1">빠른 테스트:</div>
        <div className="flex gap-1">
          <button
            onClick={() => handleSingleUpdate('restaurants', 'fukuoka', 'ramen')}
            className="px-1 py-0.5 bg-yellow-600 rounded text-xs hover:bg-yellow-700"
          >
            후쿠오카 라멘
          </button>
          <button
            onClick={() => handleSingleUpdate('hotplaces', 'fukuoka', 'dazaifu')}
            className="px-1 py-0.5 bg-purple-600 rounded text-xs hover:bg-purple-700"
          >
            다자이후
          </button>
        </div>
      </div>

      {/* 로그 */}
      <div className="text-xs">
        <div className="font-semibold mb-1">최근 로그:</div>
        <div className="bg-black p-2 rounded max-h-24 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="text-green-400">{log}</div>
          ))}
        </div>
      </div>

      {/* 기존 트렌딩 데이터 결과 */}
      {debugInfo.success !== undefined && (
        <div style={{ 
          padding: '10px', 
          background: debugInfo.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${debugInfo.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <strong>📊 트렌딩 데이터:</strong>
          <div style={{ fontSize: '11px', marginTop: '5px' }}>
            {debugInfo.success ? (
              <>
                <div>✅ 성공! 트렌드 {debugInfo.result?.trends?.length || 0}개 발견</div>
                <div>API 사용: {debugInfo.result?.source}</div>
              </>
            ) : (
              <>
                <div>❌ 실패: {debugInfo.error}</div>
              </>
            )}
            <div>시간: {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}

      {/* 리뷰 시스템 테스트 결과 */}
      {reviewTestResult && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          background: reviewTestResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${reviewTestResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <strong>📝 리뷰 시스템 테스트:</strong>
          <div style={{ fontSize: '11px', marginTop: '5px' }}>
            {reviewTestResult.success ? (
              <>
                <div>✅ 테스트 성공!</div>
                <div>식당: {reviewTestResult.restaurantName}</div>
                <div>원본 평점: {reviewTestResult.originalRating} → 생성 평점: {reviewTestResult.avgGeneratedRating}</div>
                <div>생성된 리뷰: {reviewTestResult.generatedReviews}개</div>
                <div>Gemini 사용: {reviewTestResult.summary?.llmUsed ? '✅' : '❌'}</div>
                {reviewTestResult.summary?.summary && (
                  <div style={{ marginTop: '5px', padding: '5px', background: '#f8f9fa', borderRadius: '3px' }}>
                    요약: {reviewTestResult.summary.summary.substring(0, 100)}...
                  </div>
                )}
              </>
            ) : (
              <>
                <div>❌ 테스트 실패</div>
                <div>오류: {reviewTestResult.error}</div>
              </>
            )}
            <div>시간: {new Date(reviewTestResult.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}

      {/* Gemini API 테스트 결과 */}
      {geminiTestResult && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          background: geminiTestResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${geminiTestResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <strong>🤖 Gemini API 테스트:</strong>
          <div style={{ fontSize: '11px', marginTop: '5px' }}>
            {geminiTestResult.success ? (
              <>
                <div>✅ 연결 성공!</div>
                <div>응답: {geminiTestResult.response}</div>
                <div>API 키: {geminiTestResult.maskedKey}</div>
              </>
            ) : (
              <>
                <div>❌ 연결 실패</div>
                <div>오류: {geminiTestResult.error}</div>
              </>
            )}
            <div>시간: {new Date(geminiTestResult.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}

      {/* Google Places API 테스트 결과 */}
      {restaurantTestResult && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          background: restaurantTestResult.success ? '#f0f8ff' : '#f8d7da',
          border: `1px solid ${restaurantTestResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <strong>🌐 Google Places API 테스트:</strong>
          <div style={{ fontSize: '11px', marginTop: '5px' }}>
            {restaurantTestResult.success ? (
              <>
                <div>✅ 테스트 성공!</div>
                <div>검색된 맛집: {restaurantTestResult.count}개</div>
                <div>샘플 맛집: {restaurantTestResult.restaurants.map(r => r.name).join(', ')}</div>
              </>
            ) : (
              <>
                <div>❌ 테스트 실패</div>
                <div>오류: {restaurantTestResult.error}</div>
              </>
            )}
            <div>시간: {new Date(restaurantTestResult.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}

      <div style={{ fontSize: '10px', color: '#666', marginTop: '10px' }}>
        콘솔에서 자세한 로그를 확인하세요. (F12)
      </div>
    </div>
  );
};

export default TrendingDataDebug; 