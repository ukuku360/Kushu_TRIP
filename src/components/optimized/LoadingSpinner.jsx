import React, { memo } from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = memo(({ 
  size = 'medium', 
  message = '로딩 중...', 
  showMessage = true,
  color = '#4ecdc4' 
}) => {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60
  }

  const spinnerSize = sizeMap[size] || sizeMap.medium

  return (
    <motion.div 
      className="loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* 메인 스피너 */}
      <motion.div
        className="loading-spinner"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `3px solid rgba(78, 205, 196, 0.3)`,
          borderTop: `3px solid ${color}`,
          borderRadius: '50%'
        }}
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />

      {/* 내부 작은 스피너 */}
      <motion.div
        className="inner-spinner"
        style={{
          position: 'absolute',
          width: spinnerSize * 0.6,
          height: spinnerSize * 0.6,
          border: `2px solid rgba(78, 205, 196, 0.2)`,
          borderLeft: `2px solid ${color}`,
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* 점들 애니메이션 */}
      <div className="loading-dots" style={{ marginTop: spinnerSize + 10 }}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="loading-dot"
            style={{
              width: 6,
              height: 6,
              backgroundColor: color,
              borderRadius: '50%',
              margin: '0 2px',
              display: 'inline-block'
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          />
        ))}
      </div>

      {/* 로딩 메시지 */}
      {showMessage && (
        <motion.p 
          className="loading-message"
          style={{ 
            marginTop: 15,
            color: '#666',
            fontSize: '14px',
            fontWeight: '500'
          }}
          animate={{ 
            opacity: [0.6, 1, 0.6] 
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>
      )}

      {/* 배경 글로우 효과 */}
      <motion.div
        className="loading-glow"
        style={{
          position: 'absolute',
          width: spinnerSize * 1.5,
          height: spinnerSize * 1.5,
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: -1
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner 