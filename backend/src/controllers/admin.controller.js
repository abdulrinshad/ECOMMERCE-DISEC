import * as adminService from '../services/admin.service.js'
import { Product } from '../models/product.model.js'
import { Review } from '../models/review.model.js'
import { Order } from '../models/order.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiResponse.js'

/**
 * Helper to extract IP Address from request
 */
const getIp = (req) => {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
}

export const getDashboardKPIs = async (req, res, next) => {
  try {
    const kpis = await adminService.getDashboardKPIs()
    return res.status(200).json(new ApiResponse(200, kpis, 'KPIs retrieved successfully'))
  } catch (error) {
    next(error)
  }
}

export const getAnalytics = async (req, res, next) => {
  try {
    const charts = await adminService.getAnalytics()
    return res.status(200).json(new ApiResponse(200, charts, 'Analytics data retrieved successfully'))
  } catch (error) {
    next(error)
  }
}

export const getAdminProducts = async (req, res, next) => {
  try {
    const data = await adminService.getAdminProducts(req.query)
    return res.status(200).json(new ApiResponse(200, data, 'Products retrieved successfully'))
  } catch (error) {
    next(error)
  }
}

export const createAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body)
    await adminService.createAuditLog(
      req.user.id,
      'CREATE_PRODUCT',
      { productId: product._id, productName: product.name, price: product.price },
      getIp(req)
    )
    return res.status(201).json(new ApiResponse(201, product, 'Product created successfully'))
  } catch (error) {
    next(error)
  }
}

export const updateAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) throw new ApiError(404, 'Product not found')

    await adminService.createAuditLog(
      req.user.id,
      'UPDATE_PRODUCT',
      { productId: product._id, productName: product.name },
      getIp(req)
    )
    return res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'))
  } catch (error) {
    next(error)
  }
}

export const deleteAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) throw new ApiError(404, 'Product not found')

    await adminService.createAuditLog(
      req.user.id,
      'DELETE_PRODUCT',
      { productId: product._id, productName: product.name },
      getIp(req)
    )
    return res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'))
  } catch (error) {
    next(error)
  }
}

export const getAdminOrders = async (req, res, next) => {
  try {
    // Reuse order.service or admin.service order lookups
    const orderService = await import('../services/order.service.js')
    const data = await orderService.getAllOrdersAdmin(req.query)
    return res.status(200).json(new ApiResponse(200, data, 'All orders retrieved successfully'))
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const orderService = await import('../services/order.service.js')
    const { status, message } = req.body
    const order = await orderService.updateOrderStatusAdmin(req.params.id, status, message)
    
    await adminService.createAuditLog(
      req.user.id,
      'UPDATE_ORDER_STATUS',
      { orderId: order._id, orderNumber: order.orderNumber, status },
      getIp(req)
    )
    return res.status(200).json(new ApiResponse(200, order, `Order status updated to ${status}`))
  } catch (error) {
    next(error)
  }
}

export const getAdminCustomers = async (req, res, next) => {
  try {
    const data = await adminService.getAdminCustomers(req.query)
    return res.status(200).json(new ApiResponse(200, data, 'Customers retrieved successfully'))
  } catch (error) {
    next(error)
  }
}

export const blockCustomer = async (req, res, next) => {
  try {
    const customer = await adminService.blockCustomer(req.params.id, req.user.id, getIp(req))
    return res.status(200).json(new ApiResponse(200, customer, 'Customer accounts successfully locked'))
  } catch (error) {
    next(error)
  }
}

export const unblockCustomer = async (req, res, next) => {
  try {
    const customer = await adminService.unblockCustomer(req.params.id, req.user.id, getIp(req))
    return res.status(200).json(new ApiResponse(200, customer, 'Customer accounts successfully unlocked'))
  } catch (error) {
    next(error)
  }
}

export const getAdminReviews = async (req, res, next) => {
  try {
    const data = await adminService.getAdminReviews(req.query)
    return res.status(200).json(new ApiResponse(200, data, 'Reviews retrieved successfully'))
  } catch (error) {
    next(error)
  }
}

export const approveReview = async (req, res, next) => {
  try {
    const review = await adminService.approveReview(req.params.id, req.user.id, getIp(req))
    return res.status(200).json(new ApiResponse(200, review, 'Review successfully approved and published'))
  } catch (error) {
    next(error)
  }
}

export const rejectReview = async (req, res, next) => {
  try {
    const review = await adminService.rejectReview(req.params.id, req.user.id, getIp(req))
    return res.status(200).json(new ApiResponse(200, review, 'Review successfully rejected'))
  } catch (error) {
    next(error)
  }
}

export const deleteReviewAdmin = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) throw new ApiError(404, 'Review not found')

    await Review.findByIdAndDelete(req.params.id)
    const reviewService = await import('../services/review.service.js')
    await reviewService.calculateProductRatings(review.product)

    await adminService.createAuditLog(
      req.user.id,
      'DELETE_REVIEW',
      { reviewId: review._id, productId: review.product },
      getIp(req)
    )
    return res.status(200).json(new ApiResponse(200, null, 'Review deleted successfully'))
  } catch (error) {
    next(error)
  }
}

export const getAdminInventory = async (req, res, next) => {
  try {
    const data = await adminService.getAdminInventory(req.query)
    return res.status(200).json(new ApiResponse(200, data, 'Inventory stocks retrieved successfully'))
  } catch (error) {
    next(error)
  }
}

export const updateInventory = async (req, res, next) => {
  try {
    const { stock } = req.body
    const product = await adminService.updateInventoryStock(req.params.productId, stock, req.user.id, getIp(req))
    return res.status(200).json(new ApiResponse(200, product, 'Inventory stock updated successfully'))
  } catch (error) {
    next(error)
  }
}

export const getAuditLogs = async (req, res, next) => {
  try {
    const data = await adminService.getAuditLogs(req.query)
    return res.status(200).json(new ApiResponse(200, data, 'Audit logs retrieved successfully'))
  } catch (error) {
    next(error)
  }
}
