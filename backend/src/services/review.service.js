import mongoose from 'mongoose'
import { Review } from '../models/review.model.js'
import { Product } from '../models/product.model.js'
import { Order } from '../models/order.model.js'
import { ApiError } from '../utils/ApiResponse.js'

/**
 * Resolve product identifier (slug or ID) to product ObjectId
 * @param {string} identifier 
 * @returns {Promise<mongoose.Types.ObjectId>}
 */
const resolveProductObjectId = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return new mongoose.Types.ObjectId(identifier)
  }
  const prod = await Product.findOne({ slug: identifier })
  if (!prod) {
    throw new ApiError(404, 'Product not found')
  }
  return prod._id
}

/**
 * Recalculate averageRating, reviewCount, and ratingDistribution for a product
 * @param {string} productId 
 */
export const calculateProductRatings = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
        // Create counts for each rating value
        r1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        r2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        r3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        r4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        r5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } }
      }
    }
  ])

  if (stats.length > 0) {
    const { averageRating, reviewCount, r1, r2, r3, r4, r5 } = stats[0]
    await Product.findByIdAndUpdate(productId, {
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount,
      ratingDistribution: {
        1: r1,
        2: r2,
        3: r3,
        4: r4,
        5: r5
      }
    })
  } else {
    // Reset defaults if all reviews are deleted
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
    })
  }
}

/**
 * Create a new review (restricted to verified purchasers)
 * @param {string} userId 
 * @param {Object} reviewData 
 * @returns {Promise<Object>}
 */
export const createReview = async (userId, reviewData) => {
  const { productId, rating, title, comment } = reviewData
  const resolvedProductId = await resolveProductObjectId(productId)

  // 1. Check if user already reviewed this product
  const existingReview = await Review.findOne({ user: userId, product: resolvedProductId })
  if (existingReview) {
    throw new ApiError(400, 'You have already submitted a review for this product. Edit your existing review instead.')
  }

  // 2. Verified Purchaser Check:
  // Find a delivered order belonging to this user that contains the product
  const order = await Order.findOne({
    user: userId,
    status: 'delivered',
    'items.product': resolvedProductId
  })

  if (!order) {
    throw new ApiError(400, 'Only verified purchasers with a delivered order may review this product.')
  }

  // 3. Create Review
  const review = await Review.create({
    user: userId,
    product: resolvedProductId,
    order: order._id,
    rating,
    title,
    comment,
    isVerifiedPurchase: true
  })

  // 4. Update Product aggregation metrics
  await calculateProductRatings(resolvedProductId)

  return review
}

/**
 * Get product reviews with sorting and pagination
 * @param {string} productId 
 * @param {Object} queryOptions 
 * @returns {Promise<Object>}
 */
export const getReviews = async (productId, queryOptions = {}) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = queryOptions
  const resolvedProductId = await resolveProductObjectId(productId)

  const filter = { product: resolvedProductId, status: 'approved' }
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
  const skip = (page - 1) * limit

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user', 'fullName avatar'),
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
 * Update review comments/ratings
 * @param {string} userId 
 * @param {string} reviewId 
 * @param {Object} updateData 
 * @param {string} userRole 
 * @returns {Promise<Object>}
 */
export const updateReview = async (userId, reviewId, updateData, userRole) => {
  const review = await Review.findById(reviewId)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  // Authorize: owner of review or admin
  if (review.user.toString() !== userId && userRole !== 'admin') {
    throw new ApiError(403, 'Unauthorized to modify this review')
  }

  // Allow modifications
  if (updateData.rating !== undefined) review.rating = updateData.rating
  if (updateData.title !== undefined) review.title = updateData.title
  if (updateData.comment !== undefined) review.comment = updateData.comment

  await review.save()

  // Recalculate average ratings
  await calculateProductRatings(review.product)

  return review
}

/**
 * Delete a review
 * @param {string} userId 
 * @param {string} reviewId 
 * @param {string} userRole 
 * @returns {Promise<Object>}
 */
export const deleteReview = async (userId, reviewId, userRole) => {
  const review = await Review.findById(reviewId)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  // Authorize: owner of review or admin
  if (review.user.toString() !== userId && userRole !== 'admin') {
    throw new ApiError(403, 'Unauthorized to delete this review')
  }

  const productId = review.product
  await Review.findByIdAndDelete(reviewId)

  // Recalculate average ratings
  await calculateProductRatings(productId)

  return { deleted: true }
}
