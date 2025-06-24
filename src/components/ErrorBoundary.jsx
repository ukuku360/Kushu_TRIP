import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    })
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI를 커스텀하여 렌더링할 수 있습니다
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>🚨 앗! 뭔가 잘못되었습니다</h2>
            <p>예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
            
            {/* 개발 환경에서만 상세 에러 정보 표시 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>상세 에러 정보 (개발용)</summary>
                <div className="error-info">
                  <strong>Error:</strong> {this.state.error.toString()}
                  <br />
                  <strong>Component Stack:</strong>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
            
            <div className="error-actions">
              <button 
                className="error-reset-button"
                onClick={this.handleReset}
              >
                🔄 다시 시도
              </button>
              <button 
                className="error-home-button"
                onClick={() => window.location.reload()}
              >
                🏠 새로고침
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 