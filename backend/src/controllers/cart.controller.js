import * as cartService from '../services/cart.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

/**
 * View active shopping cart for the authenticated user
 * GET /api/cart
 */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id
    const cart = await cartService.getOrCreateCart(userId)

    return res.status(200).json(
      new ApiResponse(200, cart, 'Cart retrieved successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Add a product item to the shopping cart
 * POST /api/cart/items
 */
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id
    const cart = await cartService.addItemToCart(userId, req.body)

    return res.status(200).json(
      new ApiResponse(200, cart, 'Item added to cart successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Update the quantity of a specific item in the cart
 * PATCH /api/cart/items/:itemId
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { itemId } = req.params
    const { quantity } = req.body
    
    const cart = await cartService.updateCartItemQuantity(userId, itemId, quantity)

    return res.status(200).json(
      new ApiResponse(200, cart, 'Cart item quantity updated successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Remove an item from the cart
 * DELETE /api/cart/items/:itemId
 */
export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { itemId } = req.params

    const cart = await cartService.removeCartItem(userId, itemId)

    return res.status(200).json(
      new ApiResponse(200, cart, 'Item removed from cart successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Clear all items in the cart
 * DELETE /api/cart
 */
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id
    const cart = await cartService.clearActiveCart(userId)

    return res.status(200).json(
      new ApiResponse(200, cart, 'Cart cleared successfully')
    )
  } catch (error) {
    next(error)
  }
}
