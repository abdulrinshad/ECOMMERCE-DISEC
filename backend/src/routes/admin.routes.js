import express from 'express'
import {
  getDashboardKPIs,
  getAnalytics,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateOrderStatus,
  getAdminCustomers,
  blockCustomer,
  unblockCustomer,
  getAdminReviews,
  approveReview,
  rejectReview,
  deleteReviewAdmin,
  getAdminInventory,
  updateInventory,
  getAuditLogs
} from '../controllers/admin.controller.js'
import { protect, authorize } from '../middleware/auth.middleware.js'
import { validateZod } from '../validations/product.validation.js'
import { createProductSchema, updateProductSchema } from '../validations/product.validation.js'
import { adminUpdateOrderStatusSchema } from '../validations/order.validation.js'
import { z } from 'zod'

const router = express.Router()

// Enforce JWT protect and strict admin role check on all admin API calls
router.use(protect)
router.use(authorize('admin'))

// KPI & Analytics
router.get('/dashboard', getDashboardKPIs)
router.get('/analytics', getAnalytics)
router.get('/audit-logs', getAuditLogs)

// Product CRUD
router.get('/products', getAdminProducts)
router.post('/products', validateZod(createProductSchema), createAdminProduct)
router.put('/products/:id', validateZod(updateProductSchema), updateAdminProduct)
router.delete('/products/:id', deleteAdminProduct)

// Order Management
router.get('/orders', getAdminOrders)
router.patch('/orders/:id/status', validateZod(adminUpdateOrderStatusSchema), updateOrderStatus)

// Customer Management
router.get('/customers', getAdminCustomers)
router.patch('/customers/:id/block', blockCustomer)
router.patch('/customers/:id/unblock', unblockCustomer)

// Review Moderation
router.get('/reviews', getAdminReviews)
router.patch('/reviews/:id/approve', approveReview)
router.patch('/reviews/:id/reject', rejectReview)
router.delete('/reviews/:id', deleteReviewAdmin)

// Inventory
router.get('/inventory', getAdminInventory)
const updateInventorySchema = z.object({
  stock: z.number({ required_error: 'Stock count is required' }).int().min(0, 'Stock cannot be negative')
})
router.patch('/inventory/:productId', validateZod(updateInventorySchema), updateInventory)

export default router
export { router as adminRouter }
