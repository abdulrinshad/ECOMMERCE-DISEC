import { create } from 'zustand'

export const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchWishlist: async (token) => {
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (res.ok) {
        set({ items: data.data?.items || [], isLoading: false })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  addToWishlist: async (token, productId, productSnapshot) => {
    // Optimistic UI Update
    const previousItems = get().items
    const newItem = {
      product: productId,
      productSnapshot: productSnapshot || {
        name: 'Loading...',
        slug: 'loading',
        image: '',
        price: 0,
        badge: ''
      },
      addedAt: new Date().toISOString()
    }

    set({ items: [...previousItems, newItem] })

    try {
      const res = await fetch('/api/wishlist/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add to wishlist')
      }
      // Re-sync with backend data
      set({ items: data.data?.items || [] })
    } catch (err) {
      // Revert optimistic update
      set({ items: previousItems, error: err.message })
      throw err
    }
  },

  removeFromWishlist: async (token, productId) => {
    // Optimistic UI Update
    const previousItems = get().items
    set({ items: previousItems.filter(item => item.product !== productId) })

    try {
      const res = await fetch(`/api/wishlist/items/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to remove from wishlist')
      }
      set({ items: data.data?.items || [] })
    } catch (err) {
      set({ items: previousItems, error: err.message })
      throw err
    }
  },

  toggleWishlist: async (token, productId, productSnapshot) => {
    const isSaved = get().items.some(item => item.product === productId)
    if (isSaved) {
      await get().removeFromWishlist(token, productId)
      return false // indicates removed
    } else {
      await get().addToWishlist(token, productId, productSnapshot)
      return true // indicates added
    }
  },

  clearWishlist: async (token) => {
    const previousItems = get().items
    set({ items: [] })
    try {
      const res = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to clear wishlist')
      }
    } catch (err) {
      set({ items: previousItems, error: err.message })
      throw err
    }
  },

  moveToCart: async (token, productId, size, color) => {
    const previousItems = get().items
    set({ items: previousItems.filter(item => item.product !== productId) })

    try {
      const res = await fetch(`/api/wishlist/move-to-cart/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ size, color })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to move to cart')
      }
      set({ items: data.data?.items || [] })
      return true
    } catch (err) {
      set({ items: previousItems, error: err.message })
      throw err
    }
  }
}))
