import { Product } from '../models/product.model.js'
import { Order } from '../models/order.model.js'
import { User } from '../models/User.js'
import { Review } from '../models/review.model.js'
import { AuditLog } from '../models/auditLog.model.js'
import { ApiError } from '../utils/ApiResponse.js'
import { calculateProductRatings } from './review.service.js'

/**
 * Record an administrative action in the Audit Log
 * @param {string} adminId 
 * @param {string} action 
 * @param {Object} details 
 * @param {string} ipAddress 
 */
export const createAuditLog = async (adminId, action, details = {}, ipAddress = '') => {
  try {
    await AuditLog.create({
      admin: adminId,
      action,
      details,
      ipAddress
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
  }
}

/**
 * Get all Audit Logs
 * @param {Object} queryOptions 
 * @returns {Promise<Object>}
 */
export const getAuditLogs = async (queryOptions = {}) => {
  const { page = 1, limit = 20 } = queryOptions
  const skip = (page - 1) * limit

  const [logs, total] = await Promise.all([
    AuditLog.find()
      .populate('admin', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments()
  ])

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get Dashboard KPIs
 * @returns {Promise<Object>}
 */
export const getDashboardKPIs = async () => {
  const [
    revenueAgg,
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    pendingReviews,
    lowStockCount,
    refundRequests
  ] = await Promise.all([
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$pricing.grandTotal' } } }
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Product.countDocuments(),
    Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'processing'] } }),
    Review.countDocuments({ status: 'pending' }),
    Product.countDocuments({ stock: { $lte: 5 } }),
    Order.countDocuments({ status: 'refunded' })
  ])

  const totalRevenue = revenueAgg.length > 0 ? Number(revenueAgg[0].total.toFixed(2)) : 0

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    pendingReviews,
    lowStockProducts: lowStockCount,
    refundRequests
  }
}

/**
 * Get Analytics chart datasets
 * @returns {Promise<Object>}
 */
export const getAnalytics = async () => {
  // 1. Revenue & Orders Trend (Last 7 Days)
  const last7Days = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$pricing.grandTotal', 0] } },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  // 2. Top Categories
  const topCategories = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: '$stock' }, avgPrice: { $avg: '$price' } } }
  ])

  // 3. Top Selling Products
  const topSelling = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        unitsSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.subtotal' }
      }
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 5 }
  ])

  // 4. Customer Growth (Last 6 Months)
  const customerGrowth = await User.aggregate([
    { $match: { role: 'user' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  // 5. Review Distribution
  const reviewsDist = await Review.aggregate([
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ])

  return {
    revenueTrend: last7Days,
    topCategories,
    topSelling,
    customerGrowth,
    reviewsDist
  }
}

/**
 * Get Products for Admin
 * @param {Object} queryOptions 
 * @returns {Promise<Object>}
 */
export const getAdminProducts = async (queryOptions = {}) => {
  const { page = 1, limit = 10, search = '', category, status } = queryOptions
  
  const filter = {}
  if (search) {
    filter.name = { $regex: search, $options: 'i' }
  }
  if (category) {
    filter.category = category
  }
  if (status) {
    filter.status = status
  }

  const skip = (page - 1) * limit
  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter)
  ])

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get Customers for Admin
 * @param {Object} queryOptions 
 * @returns {Promise<Object>}
 */
export const getAdminCustomers = async (queryOptions = {}) => {
  const { page = 1, limit = 10, search = '' } = queryOptions

  const filter = { role: 'user' }
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }

  const skip = (page - 1) * limit
  const [customers, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter)
  ])

  // Enrich with order counts and total spends
  const enrichedCustomers = await Promise.all(
    customers.map(async (cust) => {
      const orders = await Order.find({ user: cust._id })
      const totalSpend = orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.pricing.grandTotal, 0)
      
      return {
        ...cust.toObject(),
        orderCount: orders.length,
        totalSpend: Number(totalSpend.toFixed(2))
      }
    })
  )

  return {
    customers: enrichedCustomers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * Block/Disable a customer
 * @param {string} customerId 
 * @param {string} adminId 
 * @param {string} ipAddress 
 * @returns {Promise<Object>}
 */
export const blockCustomer = async (customerId, adminId, ipAddress) => {
  const customer = await User.findById(customerId)
  if (!customer) {
    throw new ApiError(404, 'Customer not found')
  }

  customer.failedLoginAttempts = 9999 // Effectively lock account
  customer.loginLockUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year lock
  await customer.save()

  await createAuditLog(adminId, 'BLOCK_USER', { customerId, customerName: customer.fullName, email: customer.email }, ipAddress)
  return customer
}

/**
 * Unblock a customer
 * @param {string} customerId 
 * @param {string} adminId 
 * @param {string} ipAddress 
 * @returns {Promise<Object>}
 */
export const unblockCustomer = async (customerId, adminId, ipAddress) => {
  const customer = await User.findById(customerId)
  if (!customer) {
    throw new ApiError(404, 'Customer not found')
  }

  customer.failedLoginAttempts = 0
  customer.loginLockUntil = null
  await customer.save()

  await createAuditLog(adminId, 'UNBLOCK_USER', { customerId, customerName: customer.fullName, email: customer.email }, ipAddress)
  return customer
}

/**
 * Get Reviews for Admin Moderation
 * @param {Object} queryOptions 
 * @returns {Promise<Object>}
 */
export const getAdminReviews = async (queryOptions = {}) => {
  const { page = 1, limit = 10, status } = queryOptions

  const filter = {}
  if (status) {
    filter.status = status
  }

  const skip = (page - 1) * limit
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'fullName email')
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter)
  ])

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * Approve a Review
 * @param {string} reviewId 
 * @param {string} adminId 
 * @param {string} ipAddress 
 * @returns {Promise<Object>}
 */
export const approveReview = async (reviewId, adminId, ipAddress) => {
  const review = await Review.findById(reviewId)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  review.status = 'approved'
  await review.save()

  // Recalculate stars since it is now approved and public
  await calculateProductRatings(review.product)

  await createAuditLog(adminId, 'APPROVE_REVIEW', { reviewId, productId: review.product }, ipAddress)
  return review
}

/**
 * Reject a Review
 * @param {string} reviewId 
 * @param {string} adminId 
 * @param {string} ipAddress 
 * @returns {Promise<Object>}
 */
export const rejectReview = async (reviewId, adminId, ipAddress) => {
  const review = await Review.findById(reviewId)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  review.status = 'rejected'
  await review.save()

  // Recalculate stars since it is no longer public
  await calculateProductRatings(review.product)

  await createAuditLog(adminId, 'REJECT_REVIEW', { reviewId, productId: review.product }, ipAddress)
  return review
}

/**
 * Get Inventory Stock Status
 * @param {Object} queryOptions 
 * @returns {Promise<Object>}
 */
export const getAdminInventory = async (queryOptions = {}) => {
  const { page = 1, limit = 10, search = '' } = queryOptions

  const filter = {}
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } }
    ]
  }

  const skip = (page - 1) * limit
  const [products, total] = await Promise.all([
    Product.find(filter).select('name sku stock isInStock thumbnail category').sort({ stock: 1 }).skip(skip).limit(limit),
    Product.countDocuments(filter)
  ])

  return {
    inventory: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * Update stock level directly
 * @param {string} productId 
 * @param {number} stock 
 * @param {string} adminId 
 * @param {string} ipAddress 
 * @returns {Promise<Object>}
 */
export const updateInventoryStock = async (productId, stock, adminId, ipAddress) => {
  const product = await Product.findById(productId)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const oldStock = product.stock
  product.stock = stock
  await product.save()

  await createAuditLog(
    adminId,
    'UPDATE_INVENTORY',
    { productId, productName: product.name, oldStock, newStock: stock },
    ipAddress
  )

  return product
}
