import mongoose from 'mongoose'
import { Order } from '../models/order.model.js'
import { ApiError } from '../utils/ApiResponse.js'

/**
 * Generate a unique order number
 * @returns {string}
 */
export const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomStr = Math.floor(100000 + Math.random() * 900000).toString()
  return `ORD-${dateStr}-${randomStr}`
}

/**
 * Get all orders for a user with pagination, filtering, and sorting
 * @param {string} userId 
 * @param {Object} queryOptions 
 * @returns {Promise<Object>}
 */
export const getUserOrders = async (userId, queryOptions = {}) => {
  const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = queryOptions

  const filter = { user: userId }
  if (status) {
    filter.orderStatus = status
  }

  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
  const skip = (page - 1) * limit

  const [orders, total] = await Promise.all([
    Order.find(filter).sort(sort).skip(skip).limit(limit).populate('items.product'),
    Order.countDocuments(filter)
  ])

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get an order by ID (with authorization check)
 * @param {string} orderId 
 * @param {Object} user 
 * @returns {Promise<Object>}
 */
export const getOrderById = async (orderId, user) => {
  const order = await Order.findById(orderId).populate('items.product')
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  // Authorize: user must own the order or be an admin
  if (order.user.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new ApiError(403, 'Unauthorized to view this order')
  }

  return order
}

/**
 * Cancel an order
 * @param {string} orderId 
 * @param {string} cancelReason 
 * @param {Object} user 
 * @returns {Promise<Object>}
 */
export const cancelOrder = async (orderId, cancelReason, user) => {
  const order = await Order.findById(orderId)
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  // Check ownership unless admin
  if (order.user.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new ApiError(403, 'Unauthorized to cancel this order')
  }

  // Cancellation Allowed ONLY for pending statuses
  if (order.orderStatus !== 'pending') {
    throw new ApiError(400, `Cannot cancel order with status: ${order.orderStatus}.`)
  }

  // Update status and cancel reasons
  order.orderStatus = 'cancelled'
  order.cancelReason = cancelReason
  order.cancelledAt = new Date()
  order.trackingHistory.push({
    status: 'cancelled',
    message: `Order cancelled by ${user.role === 'admin' ? 'Administrator' : 'Customer'}. Reason: ${cancelReason}`
  })

  // Restore product stock
  for (const item of order.items) {
    const Product = (await import('../models/product.model.js')).default
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    })
  }

  await order.save()
  return order
}

/**
 * Get all orders with pagination and filtering (Admin only)
 * @param {Object} queryOptions 
 * @returns {Promise<Object>}
 */
export const getAllOrdersAdmin = async (queryOptions = {}) => {
  const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = queryOptions

  const filter = {}
  if (status) {
    filter.orderStatus = status
  }

  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
  const skip = (page - 1) * limit

  const [orders, total] = await Promise.all([
    Order.find(filter).sort(sort).skip(skip).limit(limit).populate('user', 'fullName email'),
    Order.countDocuments(filter)
  ])

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * Update order status and automatically append to trackingHistory (Admin only)
 * @param {string} orderId 
 * @param {string} status 
 * @param {string} message 
 * @returns {Promise<Object>}
 */
export const updateOrderStatusAdmin = async (orderId, status, message = '') => {
  const order = await Order.findById(orderId)
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  // Update status and add tracking entry
  order.orderStatus = status
  
  // Update payment status on delivery to 'paid' if it was pending
  if (status === 'delivered' && order.paymentStatus === 'pending') {
    order.paymentStatus = 'paid'
  }

  const statusMessages = {
    pending: 'Order pending review.',
    processing: 'Order is being packaged and prepared for shipping.',
    shipped: 'Order has departed our facility.',
    delivered: 'Order has been successfully delivered.',
    cancelled: 'Order has been cancelled.'
  }

  const trackingMessage = message || statusMessages[status] || `Order status updated to ${status}`

  order.trackingHistory.push({
    status,
    message: trackingMessage
  })

  await order.save()
  return order
}

/**
 * Get Account Dashboard Statistics for a customer
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export const getAccountDashboardStats = async (userId) => {
  const result = await Order.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        pendingOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] } },
        deliveredOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] } },
        cancelledOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] } },
        totalSpent: { $sum: { $cond: [{ $ne: ['$orderStatus', 'cancelled'] }, '$totalAmount', 0] } }
      }
    }
  ])

  if (result.length === 0) {
    return {
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalSpent: 0
    }
  }

  return {
    totalOrders: result[0].totalOrders || 0,
    pendingOrders: result[0].pendingOrders || 0,
    deliveredOrders: result[0].deliveredOrders || 0,
    cancelledOrders: result[0].cancelledOrders || 0,
    totalSpent: Number((result[0].totalSpent || 0).toFixed(2))
  }
}
