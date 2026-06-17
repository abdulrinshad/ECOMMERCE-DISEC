import React, { useState } from 'react'

export const StarRating = ({ rating, onChange, interactive = false, size = 18 }) => {
  const [hoverRating, setHoverRating] = useState(0)

  const stars = [1, 2, 3, 4, 5]

  const handleStarClick = (val) => {
    if (interactive && onChange) {
      onChange(val)
    }
  }

  const handleMouseEnter = (val) => {
    if (interactive) {
      setHoverRating(val)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div 
      className="flex items-center space-x-1" 
      onMouseLeave={handleMouseLeave}
    >
      {stars.map((star) => {
        const isFilled = star <= displayRating
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 active:scale-95 transition-transform' : 'cursor-default'} focus:outline-none bg-transparent border-none p-0 flex items-center justify-center`}
            style={{ width: size, height: size }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFilled ? '#1A3C2E' : 'none'}
              stroke={isFilled ? '#1A3C2E' : '#7C766C'}
              strokeWidth="1.5"
              className="w-full h-full transition-colors duration-150"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499c.15-.427.77-.427.92 0l1.986 5.641a.5.5 0 0 0 .476.342h5.992c.451 0 .637.58.273.876l-4.847 3.522a.5.5 0 0 0-.177.545l1.987 5.64a.5.5 0 0 1-.722.525l-4.847-3.523a.5.5 0 0 0-.583 0l-4.847 3.523a.5.5 0 0 1-.722-.525l1.987-5.64a.5.5 0 0 0-.177-.545L3.92 10.858c-.364-.296-.178-.876.273-.876h5.992a.5.5 0 0 0 .475-.342L11.48 3.5z"
              />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

export default React.memo(StarRating)
