import * as orderService from '../services/order.service.js'
import { processCheckout } from '../services/checkout.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

/**
 * Place a new order (Checkout submission)
 * POST /api/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id
    const order = await processCheckout(userId, req.body)

    return res.status(201).json(
      new ApiResponse(201, order, 'Order created successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get all orders for the authenticated user
 * GET /api/orders
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { orders, pagination } = await orderService.getUserOrders(userId, req.query)

    return res.status(200).json(
      new ApiResponse(200, { orders, pagination }, 'Orders retrieved successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get a specific order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const order = await orderService.getOrderById(orderId, req.user)

    return res.status(200).json(
      new ApiResponse(200, order, 'Order retrieved successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Cancel an order
 * PATCH /api/orders/:id/cancel
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { cancelReason } = req.body
    const order = await orderService.cancelOrder(orderId, cancelReason, req.user)

    return res.status(200).json(
      new ApiResponse(200, order, 'Order cancelled successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get all orders for Admin
 * GET /api/admin/orders
 */
export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { orders, pagination } = await orderService.getAllOrdersAdmin(req.query)

    return res.status(200).json(
      new ApiResponse(200, { orders, pagination }, 'All orders retrieved successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Update order status (Admin only)
 * PATCH /api/admin/orders/:id/status
 */
export const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { status, message } = req.body
    const order = await orderService.updateOrderStatusAdmin(orderId, status, message)

    return res.status(200).json(
      new ApiResponse(200, order, `Order status updated to ${status} successfully`)
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get Customer Dashboard Statistics
 * GET /api/account/dashboard
 */
export const getAccountDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id
    const stats = await orderService.getAccountDashboardStats(userId)

    return res.status(200).json(
      new ApiResponse(200, stats, 'Dashboard statistics retrieved successfully')
    )
  } catch (error) {
    next(error)
  }
}
