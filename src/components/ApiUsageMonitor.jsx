import React, { useState, useEffect } from 'react';
import apiUsageTracker from '../services/apiUsageTracker.js';

const ApiUsageMonitor = ({ isMinimized = false, onToggle }) => {
  const [usageStats, setUsageStats] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [selectedApi, setSelectedApi] = useState('gemini');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // 초기 데이터 로드
    refreshData();

    // 자동 새로고침
    let interval;
    if (autoRefresh) {
      interval = setInterval(refreshData, 5000); // 5초마다
    }

    // 실시간 업데이트 이벤트 리스너
    const handleUsageUpdate = (event) => {
      setUsageStats(event.detail);
    };

    apiUsageTracker.onUsageUpdate(handleUsageUpdate);

    return () => {
      if (interval) clearInterval(interval);
      apiUsageTracker.offUsageUpdate(handleUsageUpdate);
    };
  }, [autoRefresh]);

  const refreshData = () => {
    const stats = apiUsageTracker.getUsageStats();
    setUsageStats(stats);
  };

  const getUsageColor = (percent) => {
    const num = parseFloat(percent);
    if (num >= 90) return '#ff4757'; // 빨강
    if (num >= 70) return '#ffa502'; // 주황
    if (num >= 50) return '#ffda79'; // 노랑
    return '#2ed573'; // 초록
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const apiDisplayNames = {
    gemini: '🤖 Gemini AI',
    googlePlaces: '📍 Google Places',
    brave: '🔍 Brave Search'
  };

  if (isMinimized) {
    return (
      <div 
        className="api-usage-mini"
        onClick={() => onToggle && onToggle()}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#1a1a1a',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          border: '1px solid #333'
        }}
      >
        📊 API Usage
      </div>
    );
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #333',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        📊
      </button>
    );
  }

  return (
    <div 
      className="api-usage-monitor"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '350px',
        maxHeight: '80vh',
        background: '#1a1a1a',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        zIndex: 1000,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        border: '1px solid #333',
        overflowY: 'auto'
      }}
    >
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center' }}>
          📊 API 사용량 모니터
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              background: autoRefresh ? '#2ed573' : '#666',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {autoRefresh ? '🔄' : '⏸️'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              background: '#666',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* API 탭 */}
      <div style={{ display: 'flex', marginBottom: '16px', background: '#2a2a2a', borderRadius: '8px', padding: '4px' }}>
        {Object.keys(apiDisplayNames).map(api => (
          <button
            key={api}
            onClick={() => setSelectedApi(api)}
            style={{
              flex: 1,
              background: selectedApi === api ? '#4a4a4a' : 'transparent',
              border: 'none',
              color: '#fff',
              padding: '8px 4px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {apiDisplayNames[api]}
          </button>
        ))}
      </div>

      {/* 선택된 API 상세 정보 */}
      {usageStats[selectedApi] && (
        <div>
          {/* 사용량 프로그래스 바 */}
          <div style={{ marginBottom: '16px' }}>
            {selectedApi === 'gemini' && (
              <>
                {/* 시간별 사용량 */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>⏱️ 시간별 (60회 한도)</span>
                    <span>{usageStats[selectedApi].thisHour}/60 ({usageStats[selectedApi].hourlyPercent}%)</span>
                  </div>
                  <div style={{ 
                    background: '#333', 
                    borderRadius: '4px', 
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: getUsageColor(usageStats[selectedApi].hourlyPercent),
                      height: '100%',
                      width: `${Math.min(usageStats[selectedApi].hourlyPercent, 100)}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </>
            )}

            {/* 일일 사용량 */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>📅 일일 한도</span>
                <span>{usageStats[selectedApi].today}/{selectedApi === 'gemini' ? '1500' : selectedApi === 'googlePlaces' ? '1000' : '2000'} ({usageStats[selectedApi].todayPercent}%)</span>
              </div>
              <div style={{ 
                background: '#333', 
                borderRadius: '4px', 
                height: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: getUsageColor(usageStats[selectedApi].todayPercent),
                  height: '100%',
                  width: `${Math.min(usageStats[selectedApi].todayPercent, 100)}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* 월별 사용량 (Gemini 제외) */}
            {selectedApi !== 'gemini' && usageStats[selectedApi].monthlyPercent && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>📊 월별 한도</span>
                  <span>{usageStats[selectedApi].thisMonth}/{selectedApi === 'googlePlaces' ? '28000' : '50000'} ({usageStats[selectedApi].monthlyPercent}%)</span>
                </div>
                <div style={{ 
                  background: '#333', 
                  borderRadius: '4px', 
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: getUsageColor(usageStats[selectedApi].monthlyPercent),
                    height: '100%',
                    width: `${Math.min(usageStats[selectedApi].monthlyPercent, 100)}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* 총 사용량 */}
          <div style={{ 
            background: '#2a2a2a', 
            borderRadius: '8px', 
            padding: '12px', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ed573' }}>
              {usageStats[selectedApi].total.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>총 API 호출</div>
          </div>

          {/* 최근 활동 */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>🕒 최근 활동</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {usageStats[selectedApi].recentActivity.length > 0 ? (
                usageStats[selectedApi].recentActivity.map((activity, index) => (
                  <div key={index} style={{
                    background: '#2a2a2a',
                    borderRadius: '6px',
                    padding: '8px',
                    marginBottom: '6px',
                    fontSize: '11px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: activity.success ? '#2ed573' : '#ff4757' }}>
                        {activity.success ? '✅' : '❌'} {activity.endpoint || 'API 호출'}
                      </span>
                      <span style={{ color: '#aaa' }}>
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                    {activity.responseSize > 0 && (
                      <div style={{ color: '#aaa', marginTop: '2px' }}>
                        응답 크기: {activity.responseSize}B
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ color: '#666', textAlign: 'center', padding: '16px' }}>
                  아직 활동이 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 하단 버튼들 */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #333'
      }}>
        <button
          onClick={refreshData}
          style={{
            flex: 1,
            background: '#4a4a4a',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            padding: '8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          🔄 새로고침
        </button>
        <button
          onClick={() => apiUsageTracker.exportData()}
          style={{
            flex: 1,
            background: '#4a4a4a',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            padding: '8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          📥 내보내기
        </button>
        <button
          onClick={() => apiUsageTracker.resetData() && refreshData()}
          style={{
            flex: 1,
            background: '#ff4757',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            padding: '8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          🗑️ 초기화
        </button>
      </div>
    </div>
  );
};

export default ApiUsageMonitor; 