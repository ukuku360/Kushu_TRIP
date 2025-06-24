import React, { memo, useCallback } from 'react'
import { motion } from 'framer-motion'

const FoodCard = memo(({ 
  food, 
  foodKey, 
  onClick, 
  index = 0 
}) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(foodKey)
    }
  }, [onClick, foodKey])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }, [handleClick])

  return (
    <motion.div
      className="food-card"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`${food.name} 선택`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {/* 음식 이모지 */}
      <motion.div 
        className="food-emoji"
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0] 
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2
        }}
      >
        {food.emoji}
      </motion.div>

      {/* 음식 이름 */}
      <h3 className="food-name">
        {food.name}
      </h3>

      {/* 레스토랑 개수 표시 */}
      {food.restaurants && (
        <motion.div 
          className="restaurant-count"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          {food.restaurants.length}개 맛집
        </motion.div>
      )}

      {/* 평균 평점 표시 */}
      {food.restaurants && food.restaurants.length > 0 && (
        <motion.div 
          className="average-rating"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          ⭐ {(food.restaurants.reduce((sum, r) => sum + r.rating, 0) / food.restaurants.length).toFixed(1)}
        </motion.div>
      )}

      {/* 호버 효과를 위한 배경 */}
      <div className="card-glow" />
    </motion.div>
  )
})

FoodCard.displayName = 'FoodCard'

export default FoodCard 