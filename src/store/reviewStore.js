import { create } from 'zustand'

export const useReviewStore = create((set, get) => ({
  reviews: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },
  averageRating: 0,
  reviewCount: 0,
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  isLoading: false,
  error: null,

  fetchReviews: async (productId, filters = {}) => {
    if (!productId) return
    set({ isLoading: true, error: null })
    try {
      const queryParams = new URLSearchParams()
      if (filters.page) queryParams.append('page', filters.page)
      if (filters.limit) queryParams.append('limit', filters.limit)
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

      const res = await fetch(`/api/products/${productId}/reviews?${queryParams.toString()}`)
      const data = await res.json()

      if (res.ok) {
        set({
          reviews: data.data?.reviews || [],
          pagination: data.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 },
          isLoading: false
        })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  createReview: async (token, reviewData) => {
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })
      const data = await res.json()

      if (res.ok) {
        // Optimistic addition or manual refetch is handled on the page, but let's update locally
        set((state) => ({
          reviews: [data.data, ...state.reviews],
          isLoading: false
        }))
        return data.data
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message || 'Failed to submit review')
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  updateReview: async (token, reviewId, updateData) => {
    if (!token || !reviewId) return
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })
      const data = await res.json()

      if (res.ok) {
        set((state) => ({
          reviews: state.reviews.map((r) => (r._id === reviewId ? data.data : r)),
          isLoading: false
        }))
        return data.data
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message || 'Failed to update review')
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  deleteReview: async (token, reviewId) => {
    if (!token || !reviewId) return
    set({ isLoading: true, error: null })
    
    const previousReviews = get().reviews
    set((state) => ({
      reviews: state.reviews.filter((r) => r._id !== reviewId)
    }))

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete review')
      }
      set({ isLoading: false })
    } catch (err) {
      set({ reviews: previousReviews, error: err.message, isLoading: false })
      throw err
    }
  }
}))
