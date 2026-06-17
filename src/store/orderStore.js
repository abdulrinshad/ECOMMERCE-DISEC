import { create } from 'zustand'

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },
  isLoading: false,
  error: null,

  fetchOrders: async (token, filters = {}) => {
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams()
      if (filters.page) queryParams.append('page', filters.page)
      if (filters.limit) queryParams.append('limit', filters.limit)
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

      const res = await fetch(`/api/orders?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (res.ok) {
        set({ 
          orders: data.data?.orders || [], 
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

  fetchOrderById: async (token, orderId) => {
    if (!token || !orderId) return
    set({ isLoading: true, error: null, currentOrder: null })
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (res.ok) {
        set({ currentOrder: data.data || null, isLoading: false })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  cancelOrder: async (token, orderId, cancelReason) => {
    if (!token || !orderId) return
    set({ isLoading: true, error: null })

    // Optimistic UI update: local status change
    const previousOrders = get().orders
    const previousCurrentOrder = get().currentOrder
    
    // Perform local update
    const updatedOrders = previousOrders.map(order => 
      order._id === orderId 
        ? { ...order, status: 'cancelled', cancelReason, cancelledAt: new Date().toISOString() } 
        : order
    )
    let updatedCurrentOrder = previousCurrentOrder
    if (previousCurrentOrder && previousCurrentOrder._id === orderId) {
      updatedCurrentOrder = { 
        ...previousCurrentOrder, 
        status: 'cancelled', 
        cancelReason, 
        cancelledAt: new Date().toISOString(),
        trackingHistory: [
          ...previousCurrentOrder.trackingHistory,
          { status: 'cancelled', message: `Order cancelled. Reason: ${cancelReason}`, createdAt: new Date().toISOString() }
        ]
      }
    }

    set({ orders: updatedOrders, currentOrder: updatedCurrentOrder })

    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cancelReason })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to cancel order')
      }
      
      // Update with exact backend response
      set({ 
        currentOrder: data.data || updatedCurrentOrder,
        orders: get().orders.map(order => order._id === orderId ? data.data : order),
        isLoading: false 
      })
      return data.data
    } catch (err) {
      // Revert optimistic updates
      set({ orders: previousOrders, currentOrder: previousCurrentOrder, error: err.message, isLoading: false })
      throw err
    }
  }
}))
