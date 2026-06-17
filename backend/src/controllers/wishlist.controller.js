import * as wishlistService from '../services/wishlist.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

/**
 * Get user's wishlist
 * GET /api/wishlist
 */
export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id
    const wishlist = await wishlistService.getWishlist(userId)

    return res.status(200).json(
      new ApiResponse(200, wishlist, 'Wishlist retrieved successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Add a product to the wishlist
 * POST /api/wishlist/items
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { productId } = req.body

    const wishlist = await wishlistService.addToWishlist(userId, productId)

    return res.status(200).json(
      new ApiResponse(200, wishlist, 'Added to wishlist successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Remove a product from the wishlist
 * DELETE /api/wishlist/items/:productId
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { productId } = req.params

    const wishlist = await wishlistService.removeFromWishlist(userId, productId)

    return res.status(200).json(
      new ApiResponse(200, wishlist, 'Removed from wishlist successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Toggle a product in the wishlist
 * POST /api/wishlist/toggle/:productId
 */
export const toggleWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { productId } = req.params

    const wishlist = await wishlistService.toggleWishlist(userId, productId)

    return res.status(200).json(
      new ApiResponse(200, wishlist, 'Wishlist toggled successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Clear the wishlist
 * DELETE /api/wishlist
 */
export const clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id
    const wishlist = await wishlistService.clearWishlist(userId)

    return res.status(200).json(
      new ApiResponse(200, wishlist, 'Wishlist cleared successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Move wishlist item to cart
 * POST /api/wishlist/move-to-cart/:productId
 */
export const moveToCart = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { productId } = req.params
    const { size, color } = req.body

    const wishlist = await wishlistService.moveToCart(userId, productId, size, color)

    return res.status(200).json(
      new ApiResponse(200, wishlist, 'Item moved to cart successfully')
    )
  } catch (error) {
    next(error)
  }
}
