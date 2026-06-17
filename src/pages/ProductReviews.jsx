import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useReviewStore } from '../store/reviewStore'
import RatingBreakdown from '../components/reviews/RatingBreakdown'
import ReviewCard from '../components/reviews/ReviewCard'
import ReviewForm from '../components/reviews/ReviewForm'
import { toast } from 'react-hot-toast'
import gsap from 'gsap'

export const ProductReviews = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { user, accessToken } = useAuth()
  const { reviews, pagination, fetchReviews, createReview, updateReview, deleteReview, isLoading, error } = useReviewStore()

  // Local state
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isEditingReview, setIsEditingReview] = useState(null) // holds review object being edited
  const [productData, setProductData] = useState(null)
  const [isEligible, setIsEligible] = useState(false)
  const [checkingEligibility, setCheckingEligibility] = useState(false)

  // Sorting configurations
  const sortOptions = [
    { label: 'NEWEST', value: 'createdAt-desc' },
    { label: 'OLDEST', value: 'createdAt-asc' },
    { label: 'HIGHEST RATING', value: 'rating-desc' },
    { label: 'LOWEST RATING', value: 'rating-asc' }
  ]

  // Fetch product meta details
  useEffect(() => {
    if (productId) {
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setProductData(data.data)
        })
        .catch(console.error)
    }
  }, [productId])

  // Fetch reviews listing
  useEffect(() => {
    if (productId) {
      fetchReviews(productId, {
        page: currentPage,
        limit: 5,
        sortBy,
        sortOrder
      })
    }
  }, [productId, currentPage, sortBy, sortOrder, fetchReviews])

  // Check verified purchase eligibility for current user
  useEffect(() => {
    if (accessToken && productId) {
      setCheckingEligibility(true)
      fetch(`/api/orders?limit=100&status=delivered`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const hasPurchased = data.data.orders.some(order => 
              order.items.some(item => (item.product?._id || item.product) === productId)
            )
            setIsEligible(hasPurchased)
          }
        })
        .catch(console.error)
        .finally(() => setCheckingEligibility(false))
    }
  }, [accessToken, productId])

  // GSAP animations
  useEffect(() => {
    const titleWords = document.querySelectorAll('.reviews-title-word')
    gsap.fromTo(titleWords,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    )
  }, [productData])

  // Check if current user has already reviewed the product
  const hasUserReviewed = useMemo(() => {
    if (!user) return false
    return reviews.some(review => {
      const reviewerId = review.user?._id || review.user
      return reviewerId.toString() === user.id.toString()
    })
  }, [reviews, user])

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-')
    setSortBy(field)
    setSortOrder(order)
    setCurrentPage(1)
  }

  // Handle Review Submission
  const handleReviewSubmit = async (reviewValues) => {
    try {
      if (isEditingReview) {
        await updateReview(accessToken, isEditingReview._id, reviewValues)
        toast.success('REVIEW PROTOCOL UPDATED')
        setIsEditingReview(null)
      } else {
        await createReview(accessToken, { productId, ...reviewValues })
        toast.success('REVIEW PROTOCOL SUBMITTED')
      }
      // Re-fetch reviews to update aggregations
      fetchReviews(productId, { page: currentPage, limit: 5, sortBy, sortOrder })
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(accessToken, reviewId)
      toast.success('REVIEW LOG TERMINATED')
      fetchReviews(productId, { page: currentPage, limit: 5, sortBy, sortOrder })
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  const handleEditInit = (review) => {
    setIsEditingReview(review)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation back link */}
        <div className="flex justify-between items-center border-b border-[#D8D3CA] pb-6">
          <button
            onClick={() => navigate(`/product/${productId}`)}
            className="font-display text-[10px] font-bold uppercase tracking-widest text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors cursor-pointer"
          >
            ← BACK TO PRODUCT
          </button>
        </div>

        {/* Title Header */}
        <div className="overflow-hidden">
          <span className="reviews-title-word font-body text-xs font-bold uppercase tracking-widest text-[#5C5C5C] block mb-2">
            {productData?.name || 'DESIGN PIECE'}
          </span>
          <h1 className="reviews-title-word font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#0A0A0A] leading-none">
            REVIEWS & FEEDBACK
          </h1>
        </div>

        {/* Breakdown Dashboard */}
        <RatingBreakdown
          averageRating={productData?.averageRating || 0}
          reviewCount={productData?.reviewCount || 0}
          ratingDistribution={productData?.ratingDistribution || {}}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left panel: list of reviews (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header controls (Sort by) */}
            <div className="flex justify-between items-center border-b border-[#D8D3CA]/60 pb-3">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-widest text-[#0A0A0A]">
                REVIEWS ARCHIVE
              </h3>
              
              <div className="flex items-center space-x-2">
                <span className="font-body text-[9px] uppercase tracking-widest text-[#7C766C]">
                  Sort By:
                </span>
                <select
                  onChange={handleSortChange}
                  value={`${sortBy}-${sortOrder}`}
                  className="bg-transparent border-b border-[#D8D3CA] text-xs font-body tracking-wider focus:outline-none uppercase py-0.5 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List */}
            {isLoading && reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-t-[#1A3C2E] border-r-transparent border-b-[#1A3C2E] border-l-transparent rounded-full animate-spin mx-auto mb-4" />
                <span className="font-display text-[9px] font-extrabold tracking-widest text-[#7C766C] uppercase">
                  Reading reviews vault...
                </span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="border border-dashed border-[#D8D3CA] p-12 text-center bg-white/30">
                <h4 className="font-display text-xs font-extrabold uppercase tracking-widest text-[#0A0A0A]">
                  NO REVIEWS YET
                </h4>
                <p className="font-body text-[10px] text-[#7C766C] uppercase tracking-wide mt-2">
                  Be the first to review this piece.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <ReviewCard
                    key={rev._id}
                    review={rev}
                    currentUserId={user?.id}
                    userRole={user?.role}
                    onEdit={handleEditInit}
                    onDelete={handleDeleteReview}
                  />
                ))}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-[#D8D3CA]">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 font-display text-[9px] font-extrabold uppercase tracking-widest border border-[#D8D3CA] bg-white disabled:opacity-40 cursor-pointer"
                    >
                      ← Previous
                    </button>
                    <span className="font-display text-[10px] font-extrabold uppercase tracking-widest text-[#7C766C]">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      disabled={currentPage === pagination.totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      className="px-3 py-1.5 font-display text-[9px] font-extrabold uppercase tracking-widest border border-[#D8D3CA] bg-white disabled:opacity-40 cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel: review form (5 cols) */}
          <div className="lg:col-span-5">
            {!accessToken ? (
              <div className="bg-white border border-[#D8D3CA] p-6 text-center space-y-3">
                <p className="font-body text-xs text-[#7C766C] uppercase tracking-wide">
                  Sign in to submit product reviews.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#0A0A0A] text-white py-3 font-display text-[10px] font-bold uppercase tracking-widest transition-transform cursor-pointer"
                >
                  DE-AUTHORIZE / SIGN IN
                </button>
              </div>
            ) : checkingEligibility ? (
              <div className="text-center py-6">
                <div className="w-5 h-5 border border-t-[#1A3C2E] border-r-transparent border-b-[#1A3C2E] border-l-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="font-display text-[8px] font-bold tracking-widest text-[#7C766C] uppercase">
                  Verifying eligibility...
                </span>
              </div>
            ) : isEditingReview ? (
              <ReviewForm
                initialData={isEditingReview}
                onSubmit={handleReviewSubmit}
                onCancel={() => setIsEditingReview(null)}
                isSubmitting={isLoading}
              />
            ) : hasUserReviewed ? (
              <div className="bg-white border border-[#D8D3CA] p-6 text-center space-y-2">
                <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[#0A0A0A]">
                  REVIEW PROTOCOL SECURED
                </h4>
                <p className="font-body text-[10px] text-[#7C766C] uppercase tracking-wide leading-relaxed">
                  You have already logged your review for this item. Click edit on your card to update it.
                </p>
              </div>
            ) : isEligible ? (
              <ReviewForm
                onSubmit={handleReviewSubmit}
                isSubmitting={isLoading}
              />
            ) : (
              <div className="bg-[#E8E4DC] border border-[#D8D3CA] p-6 text-center space-y-2 select-none">
                <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[#7C766C]">
                  UNVERIFIED PURCHASER
                </h4>
                <p className="font-body text-[10px] text-[#7C766C] uppercase tracking-wide leading-relaxed">
                  Only verified purchasers with a completed delivery logs record can submit reviews for this design piece.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default React.memo(ProductReviews)
