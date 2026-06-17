import * as orderService from '../services/order.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

/**
 * Get all orders for the authenticated user (with pagination, filtering, sorting)
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
 * Cancel an order (requires cancelReason in body)
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
 * Get all orders for Admin (with pagination, filtering, sorting)
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
