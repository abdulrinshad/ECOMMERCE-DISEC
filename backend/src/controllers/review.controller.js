import * as reviewService from '../services/review.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

/**
 * Submit a product review
 * POST /api/reviews
 */
export const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id
    const review = await reviewService.createReview(userId, req.body)

    return res.status(201).json(
      new ApiResponse(201, review, 'Review submitted successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get reviews of a specific product
 * GET /api/products/:productId/reviews
 */
export const getReviews = async (req, res, next) => {
  try {
    const { productId } = req.params
    const { reviews, pagination } = await reviewService.getReviews(productId, req.query)

    return res.status(200).json(
      new ApiResponse(200, { reviews, pagination }, 'Reviews retrieved successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Update a review
 * PATCH /api/reviews/:id
 */
export const updateReview = async (req, res, next) => {
  try {
    const userId = req.user.id
    const reviewId = req.params.id
    const review = await reviewService.updateReview(userId, reviewId, req.body, req.user.role)

    return res.status(200).json(
      new ApiResponse(200, review, 'Review updated successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a review
 * DELETE /api/reviews/:id
 */
export const deleteReview = async (req, res, next) => {
  try {
    const userId = req.user.id
    const reviewId = req.params.id
    const response = await reviewService.deleteReview(userId, reviewId, req.user.role)

    return res.status(200).json(
      new ApiResponse(200, response, 'Review deleted successfully')
    )
  } catch (error) {
    next(error)
  }
}
