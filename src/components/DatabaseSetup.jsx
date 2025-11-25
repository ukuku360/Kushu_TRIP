import React, { useState, useEffect } from 'react';
import databaseService from '../services/databaseService.js';

const DatabaseSetup = () => {
  const [status, setStatus] = useState('초기화 중...');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await databaseService.testConnection();
        if (result.success) {
          setStatus('✅ 프론트엔드 전용 모드 - 정상 작동');
          setIsConnected(true);
        } else {
          setStatus('❌ 초기화 실패');
          setIsConnected(false);
        }
      } catch (error) {
        setStatus('❌ 오류 발생: ' + error.message);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="database-setup">
      <h3>🗄️ 데이터베이스 상태</h3>
      <div className="status-grid">
        <div className="status-item">
          <span className="label">모드:</span>
          <span className="value">프론트엔드 전용 (백엔드 불필요)</span>
        </div>
        <div className="status-item">
          <span className="label">상태:</span>
          <span className="value">{status}</span>
        </div>
        <div className="status-item">
          <span className="label">캐시:</span>
          <span className="value">메모리 기반 임시 저장</span>
        </div>
        <div className="status-item">
          <span className="label">연결:</span>
          <span className="value">{isConnected ? '✅ 활성' : '❌ 비활성'}</span>
        </div>
      </div>
      
      {isConnected && (
        <div className="info-box">
          <p>💡 <strong>프론트엔드 전용 모드</strong></p>
          <p>• 백엔드 서버 연결 불필요</p>
          <p>• 메모리 기반 캐시 사용</p>
          <p>• 페이지 새로고침 시 캐시 초기화</p>
        </div>
      )}
    </div>
  );
};

export default DatabaseSetup; 