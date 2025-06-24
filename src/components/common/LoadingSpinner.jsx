import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ message = "로딩 중..." }) => {
  return (
    <div className="loading-container">
      <motion.div 
        className="loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        🍜
      </motion.div>
      <p>{message}</p>
    </div>
  )
}

export default LoadingSpinner 