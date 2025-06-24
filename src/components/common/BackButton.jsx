import React from 'react'

const BackButton = ({ onClick, label = "돌아가기" }) => {
  return (
    <button className="back-button" onClick={onClick}>
      ← {label}
    </button>
  )
}

export default BackButton 