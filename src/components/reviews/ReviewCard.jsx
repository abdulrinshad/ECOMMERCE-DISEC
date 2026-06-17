import React, { useState } from 'react'
import StarRating from './StarRating'
import VerifiedPurchaseBadge from './VerifiedPurchaseBadge'

export const ReviewCard = ({ review, currentUserId, userRole, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const formattedDate = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  // Determine user details from populated object or fallback
  const reviewerName = review.user?.fullName || 'Anonymous Member'
  const reviewerId = review.user?._id || review.user
  const reviewerAvatar = review.user?.avatar

  const isOwner = currentUserId && reviewerId.toString() === currentUserId.toString()
  const isAdmin = userRole === 'admin'

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true)
      try {
        await onDelete(review._id)
      } catch (err) {
        setIsDeleting(false)
      }
    }
  }

  // Get user avatar initials
  const initials = reviewerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="bg-white border border-[#D8D3CA] p-5 md:p-6 space-y-4 hover:shadow-sm transition-shadow duration-200">
      
      {/* Header section (Reviewer metadata) */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          {reviewerAvatar ? (
            <img 
              src={reviewerAvatar} 
              alt={reviewerName} 
              className="w-8 h-8 rounded-full object-cover bg-[#F2EFE9]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1A3C2E] flex items-center justify-center font-display text-white text-[9px] font-bold select-none">
              {initials}
            </div>
          )}
          <div>
            <span className="font-display text-xs font-bold uppercase tracking-tight text-[#0A0A0A] block">
              {reviewerName}
            </span>
            <span className="font-body text-[9px] text-[#7C766C] uppercase tracking-wider block mt-0.5">
              Protocol Logged: {formattedDate}
            </span>
          </div>
        </div>

        {/* Stars */}
        <StarRating rating={review.rating} size={13} />
      </div>

      {/* Badges Row */}
      {review.isVerifiedPurchase && (
        <div>
          <VerifiedPurchaseBadge />
        </div>
      )}

      {/* Review details */}
      <div className="space-y-2">
        <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[#0A0A0A]">
          {review.title}
        </h4>
        <p className="font-body text-xs text-[#5C5C5C] leading-relaxed uppercase whitespace-pre-line">
          {review.comment}
        </p>
      </div>

      {/* Actions (Edit / Delete) */}
      {(isOwner || isAdmin) && (
        <div className="flex gap-4 pt-2 border-t border-[#D8D3CA]/60 font-display text-[9px] font-extrabold uppercase tracking-widest">
          {isOwner && onEdit && (
            <button
              onClick={() => onEdit(review)}
              disabled={isDeleting}
              className="text-[#1A3C2E] hover:text-[#2D6B4F] transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              EDIT REVIEW
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-700 hover:text-red-800 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            {isDeleting ? 'DELETING...' : 'DELETE REVIEW'}
          </button>
        </div>
      )}

    </div>
  )
}

export default React.memo(ReviewCard)
