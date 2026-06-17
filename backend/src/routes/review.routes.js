import express from 'express'
import {
  createReview,
  getReviews,
  updateReview,
  deleteReview
} from '../controllers/review.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { validateZod } from '../validations/product.validation.js'
import { ApiError } from '../utils/ApiResponse.js'
import { z } from 'zod'
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewsQuerySchema
} from '../validations/review.validation.js'

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

const router = express.Router()

// Public route to fetch reviews of a product
router.get('/products/:productId/reviews', validateZodQuery(getReviewsQuerySchema), getReviews)

// Protected routes to submit, update and delete reviews
router.post('/reviews', protect, validateZod(createReviewSchema), createReview)
router.patch('/reviews/:id', protect, validateZod(updateReviewSchema), updateReview)
router.delete('/reviews/:id', protect, deleteReview)

export default router
export { router as reviewRouter }
