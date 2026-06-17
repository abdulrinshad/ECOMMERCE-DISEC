import { create } from 'zustand'

const mapBackendToFrontend = (backendItems = []) => {
  return backendItems.map((item) => ({
    id: item.product?._id || item.product,
    _id: item._id, // Cart Item MongoDB ID
    name: item.name,
    title: item.name,
    price: item.price,
    images: [item.image],
    thumbnail: item.image,
    selectedSize: item.size,
    selectedColor: item.color,
    quantity: item.quantity,
    subtotal: item.subtotal
  }))
}

export const useCartStore = create((set, get) => ({
  cartItems: [],
  cartSummary: {
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    grandTotal: 0
  },
  isDrawerOpen: false,
  isLoading: false,
  error: null,
  
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  fetchCart: async (token) => {
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const responseData = await res.json()
      if (res.ok) {
        set({
          cartItems: mapBackendToFrontend(responseData.data?.items || []),
          cartSummary: responseData.data?.cartSummary || {
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            shipping: 0,
            tax: 0,
            grandTotal: 0
          },
          isLoading: false
        })
      } else {
        set({ error: responseData.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  addToCart: async (product, size, color, addedQuantity = 1, token) => {
    if (!token) {
      set({ error: 'Authentication required to modify cart.' })
      return
    }

    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id || product._id,
          size,
          color,
          quantity: addedQuantity
        })
      })
      const responseData = await res.json()
      if (res.ok) {
        set({
          cartItems: mapBackendToFrontend(responseData.data?.items || []),
          cartSummary: responseData.data?.cartSummary || {
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            shipping: 0,
            tax: 0,
            grandTotal: 0
          },
          isLoading: false
        })
      } else {
        set({ error: responseData.message, isLoading: false })
        throw new Error(responseData.message || 'Failed to add item to cart')
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  // Keep addItem as alias for backward compatibility
  addItem: async (product, size, color, addedQuantity = 1, token) => {
    return get().addToCart(product, size, color, addedQuantity, token)
  },

  removeItem: async (productId, size, color, token) => {
    const previousItems = get().cartItems
    const targetItem = previousItems.find(
      (item) => item.id === productId && item.selectedSize === size && item.selectedColor === color
    )
    if (!targetItem) return

    if (!token) return

    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/cart/items/${targetItem._id || targetItem.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const responseData = await res.json()
      if (res.ok) {
        set({
          cartItems: mapBackendToFrontend(responseData.data?.items || []),
          cartSummary: responseData.data?.cartSummary || {
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            shipping: 0,
            tax: 0,
            grandTotal: 0
          },
          isLoading: false
        })
      } else {
        set({ error: responseData.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  updateQuantity: async (productId, size, color, quantity, token) => {
    if (quantity <= 0) {
      get().removeItem(productId, size, color, token)
      return
    }

    const previousItems = get().cartItems
    const targetItem = previousItems.find(
      (item) => item.id === productId && item.selectedSize === size && item.selectedColor === color
    )
    if (!targetItem) return

    if (!token) return

    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/cart/items/${targetItem._id || targetItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      })
      const responseData = await res.json()
      if (res.ok) {
        set({
          cartItems: mapBackendToFrontend(responseData.data?.items || []),
          cartSummary: responseData.data?.cartSummary || {
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            shipping: 0,
            tax: 0,
            grandTotal: 0
          },
          isLoading: false
        })
      } else {
        set({ error: responseData.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  clearCart: async (token) => {
    if (!token) return

    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const responseData = await res.json()
      if (res.ok) {
        set({
          cartItems: mapBackendToFrontend(responseData.data?.items || []),
          cartSummary: responseData.data?.cartSummary || {
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            shipping: 0,
            tax: 0,
            grandTotal: 0
          },
          isLoading: false
        })
      } else {
        set({ error: responseData.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  getCartTotal: () => {
    const { cartSummary } = get()
    return cartSummary.subtotal
  },

  getCartCount: () => {
    const { cartSummary } = get()
    return cartSummary.totalItems
  }
}))
