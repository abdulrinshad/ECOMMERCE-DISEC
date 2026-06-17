import { create } from 'zustand'

export const useAdminStore = create((set, get) => ({
  kpis: null,
  analytics: null,
  products: [],
  orders: [],
  customers: [],
  reviews: [],
  inventory: [],
  auditLogs: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },
  isLoading: false,
  error: null,

  // Reset errors
  clearError: () => set({ error: null }),

  fetchDashboardKPIs: async (token) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set({ kpis: data.data, isLoading: false })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchAnalytics: async (token) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set({ analytics: data.data, isLoading: false })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchProducts: async (token, filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const query = new URLSearchParams()
      if (filters.page) query.append('page', filters.page)
      if (filters.limit) query.append('limit', filters.limit)
      if (filters.search) query.append('search', filters.search)
      if (filters.category) query.append('category', filters.category)
      if (filters.status) query.append('status', filters.status)

      const res = await fetch(`/api/products?${query.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set({
          products: data.data.products,
          pagination: data.data.pagination,
          isLoading: false
        })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  createProduct: async (token, productValues) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productValues)
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          products: [data.data, ...state.products],
          isLoading: false
        }))
        return data.data
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message)
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  updateProduct: async (token, productId, productValues) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productValues)
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          products: state.products.map(p => p._id === productId ? data.data : p),
          isLoading: false
        }))
        return data.data
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message)
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  deleteProduct: async (token, productId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          products: state.products.filter(p => p._id !== productId),
          isLoading: false
        }))
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message)
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  fetchOrders: async (token, filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const query = new URLSearchParams()
      if (filters.page) query.append('page', filters.page)
      if (filters.limit) query.append('limit', filters.limit)
      if (filters.status) query.append('status', filters.status)

      const res = await fetch(`/api/admin/orders?${query.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set({
          orders: data.data.orders,
          pagination: data.data.pagination,
          isLoading: false
        })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  updateOrderStatus: async (token, orderId, status, message = '') => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, message })
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          orders: state.orders.map(o => o._id === orderId ? data.data : o),
          isLoading: false
        }))
        return data.data
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message)
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  fetchCustomers: async (token, filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const query = new URLSearchParams()
      if (filters.page) query.append('page', filters.page)
      if (filters.limit) query.append('limit', filters.limit)
      if (filters.search) query.append('search', filters.search)

      const res = await fetch(`/api/admin/customers?${query.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set({
          customers: data.data.customers,
          pagination: data.data.pagination,
          isLoading: false
        })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  blockCustomer: async (token, customerId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/block`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          customers: state.customers.map(c => c._id === customerId ? { ...c, loginLockUntil: new Date(Date.now() + 365*24*60*60*1000).toISOString() } : c),
          isLoading: false
        }))
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message)
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  unblockCustomer: async (token, customerId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/unblock`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          customers: state.customers.map(c => c._id === customerId ? { ...c, loginLockUntil: null } : c),
          isLoading: false
        }))
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message)
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  fetchReviews: async (token, filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const query = new URLSearchParams()
      if (filters.page) query.append('page', filters.page)
      if (filters.limit) query.append('limit', filters.limit)
      if (filters.status) query.append('status', filters.status)

      const res = await fetch(`/api/admin/reviews?${query.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set({
          reviews: data.data.reviews,
          pagination: data.data.pagination,
          isLoading: false
        })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  approveReview: async (token, reviewId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          reviews: state.reviews.map(r => r._id === reviewId ? { ...r, status: 'approved' } : r),
          isLoading: false
        }))
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message)
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  rejectReview: async (token, reviewId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/reject`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          reviews: state.reviews.map(r => r._id === reviewId ? { ...r, status: 'rejected' } : r),
          isLoading: false
        }))
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message)
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  deleteReview: async (token, reviewId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          reviews: state.reviews.filter(r => r._id !== reviewId),
          isLoading: false
        }))
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message)
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  fetchInventory: async (token, filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const query = new URLSearchParams()
      if (filters.page) query.append('page', filters.page)
      if (filters.limit) query.append('limit', filters.limit)
      if (filters.search) query.append('search', filters.search)

      const res = await fetch(`/api/admin/inventory?${query.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set({
          inventory: data.data.inventory,
          pagination: data.data.pagination,
          isLoading: false
        })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  updateStock: async (token, productId, stock) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stock })
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          inventory: state.inventory.map(item => item._id === productId ? { ...item, stock } : item),
          isLoading: false
        }))
      } else {
        set({ error: data.message, isLoading: false })
        throw new Error(data.message)
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  fetchAuditLogs: async (token, filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const query = new URLSearchParams()
      if (filters.page) query.append('page', filters.page)
      if (filters.limit) query.append('limit', filters.limit)

      const res = await fetch(`/api/admin/audit-logs?${query.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        set({
          auditLogs: data.data.logs,
          pagination: data.data.pagination,
          isLoading: false
        })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  }
}))
