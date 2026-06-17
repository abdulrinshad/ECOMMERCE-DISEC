/**
 * Frontend Order Service for communicating with backend orders and dashboard endpoints
 */

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
})

export const createOrder = async (orderData, token) => {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(orderData)
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to place order')
    }
    return data
  } catch (error) {
    console.error('Error in createOrder:', error)
    throw error
  }
}

export const getMyOrders = async (token) => {
  try {
    const response = await fetch('/api/orders/my-orders', {
      method: 'GET',
      headers: getHeaders(token)
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders')
    }
    return data
  } catch (error) {
    console.error('Error in getMyOrders:', error)
    throw error
  }
}

export const getOrderDetails = async (orderId, token) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'GET',
      headers: getHeaders(token)
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order details')
    }
    return data
  } catch (error) {
    console.error('Error in getOrderDetails:', error)
    throw error
  }
}

export const getDashboardStats = async (token) => {
  try {
    const response = await fetch('/api/account/dashboard', {
      method: 'GET',
      headers: getHeaders(token)
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard statistics')
    }
    return data
  } catch (error) {
    console.error('Error in getDashboardStats:', error)
    throw error
  }
}

export default {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getDashboardStats
}
