import express from 'express'
import {
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from '../controllers/order.controller.js'
import { protect, authorize } from '../middleware/auth.middleware.js'
import { validateZod } from '../validations/product.validation.js'
import { ApiError } from '../utils/ApiResponse.js'
import { z } from 'zod'
import {
  getOrdersQuerySchema,
  cancelOrderSchema,
  adminUpdateOrderStatusSchema
} from '../validations/order.validation.js'

// Custom validator for query parameters
const validateZodQuery = (schema) => {
  return async (req, res, next) => {
    try {
      req.query = await schema.parseAsync(req.query)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))
        return next(new ApiError(400, 'Query Validation Error', formattedErrors))
      }
      next(error)
    }
  }
}

const userRouter = express.Router()
const adminRouter = express.Router()

// User Order Routes
userRouter.use(protect)
userRouter.get('/', validateZodQuery(getOrdersQuerySchema), getUserOrders)
userRouter.get('/:id', getOrderById)
userRouter.patch('/:id/cancel', validateZod(cancelOrderSchema), cancelOrder)

// Admin Order Routes
adminRouter.use(protect)
adminRouter.use(authorize('admin'))
adminRouter.get('/', validateZodQuery(getOrdersQuerySchema), getAllOrdersAdmin)
adminRouter.patch('/:id/status', validateZod(adminUpdateOrderStatusSchema), updateOrderStatusAdmin)

export { userRouter as orderRouter, adminRouter as adminOrderRouter }
export default userRouter
