import React from 'react'
import StarRating from './StarRating'

export const RatingBreakdown = ({ averageRating = 0, reviewCount = 0, ratingDistribution = {} }) => {
  const defaultDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  const dist = { ...defaultDistribution, ...ratingDistribution }

  const totalReviews = reviewCount || Object.values(dist).reduce((acc, count) => acc + count, 0)

  const distributionList = [5, 4, 3, 2, 1]

  return (
    <div className="bg-white border border-[#D8D3CA] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
      
      {/* Big Score Header */}
      <div className="flex flex-col items-center justify-center text-center md:border-r border-[#D8D3CA] md:pr-12 md:py-4 w-full md:w-auto flex-shrink-0">
        <h3 className="font-display text-5xl md:text-6xl font-black text-[#0A0A0A] leading-none">
          {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
        </h3>
        <div className="mt-3">
          <StarRating rating={Math.round(averageRating)} size={16} />
        </div>
        <span className="font-body text-[9px] uppercase tracking-widest text-[#7C766C] mt-2 block">
          Based on {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
        </span>
      </div>

      {/* Progress breakdown column */}
      <div className="flex-grow w-full space-y-2.5">
        {distributionList.map((stars) => {
          const count = dist[stars] || 0
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
          
          return (
            <div key={stars} className="flex items-center gap-3">
              {/* Star count label */}
              <span className="font-display text-[10px] font-extrabold uppercase tracking-widest text-[#5C5C5C] w-6 text-right">
                {stars}★
              </span>

              {/* Progress bar container */}
              <div className="flex-grow h-2 bg-[#F2EFE9] border border-[#D8D3CA]/50 relative overflow-hidden">
                <div 
                  className="h-full bg-[#1A3C2E] transition-all duration-500 ease-out" 
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Count / Share indicator */}
              <span className="font-display text-[9px] font-extrabold uppercase tracking-widest text-[#5C5C5C] w-8 text-left">
                {count}
              </span>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default React.memo(RatingBreakdown)
