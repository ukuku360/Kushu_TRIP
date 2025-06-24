import React from 'react'

const ErrorMessage = ({ message, onRetry, retryLabel = "다시 시도" }) => {
  return (
    <div className="error-container">
      <p>❌ {message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
