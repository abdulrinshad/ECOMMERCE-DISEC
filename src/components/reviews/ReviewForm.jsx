import React, { useState, useEffect } from 'react'
import StarRating from './StarRating'

export const ReviewForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  // Populates data on edit modes
  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 0)
      setTitle(initialData.title || '')
      setComment(initialData.comment || '')
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a star rating between 1 and 5.')
      return
    }
    if (!title.trim() || !comment.trim()) {
      setError('Title and comment are required.')
      return
    }
    setError('')
    onSubmit({ rating, title: title.trim(), comment: comment.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#D8D3CA] p-6 space-y-6">
      <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-[#0A0A0A] border-b border-[#D8D3CA]/60 pb-2">
        {initialData ? 'EDIT YOUR REVIEW PROTOCOL' : 'WRITE AN ACQUISITION REVIEW'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 text-[10px] text-red-800 font-display font-extrabold uppercase tracking-widest">
          {error}
        </div>
      )}

      {/* Star picker */}
      <div className="space-y-2">
        <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
          Your Rating *
        </label>
        <StarRating rating={rating} onChange={setRating} interactive={true} size={22} />
      </div>

      {/* Review Title */}
      <div className="space-y-2">
        <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
          Review Title *
        </label>
        <input
          type="text"
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
          placeholder="E.G. EXCELLENT SHELL CONSTRUCTION / PERFECT DRAPING"
        />
      </div>

      {/* Comment Textarea */}
      <div className="space-y-2">
        <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
          Review Comments * (max 2000 characters)
        </label>
        <textarea
          required
          rows={5}
          maxLength={2000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
          placeholder="PROVIDE DETAILED FEEDBACK REGARDING FIT, MATERIAL QUALITY, AND DESIGN..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-grow bg-transparent hover:bg-neutral-100 text-[#0A0A0A] border border-[#D8D3CA] py-4 font-display text-[10px] font-bold uppercase tracking-widest transition-colors duration-200"
          >
            CANCEL
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-grow bg-[#1A3C2E] hover:bg-[#2D6B4F] text-white border-none py-4 font-display text-[10px] font-extrabold uppercase tracking-widest transition-colors duration-200 active:scale-[0.98]"
        >
          {isSubmitting ? 'SUBMITTING PROTOCOL...' : 'SUBMIT REVIEW'}
        </button>
      </div>
    </form>
  )
}

export default React.memo(ReviewForm)
