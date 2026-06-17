import { Cart } from '../models/cart.model.js'
import { Product } from '../models/product.model.js'
import { ApiError } from '../utils/ApiResponse.js'

/**
 * Get the active cart for a user, or create one if it doesn't exist
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId, status: 'active' })
  if (!cart) {
    cart = new Cart({ user: userId, items: [] })
    await cart.save()
  }
  return cart
}

/**
 * Add an item to the user's active cart
 * @param {string} userId 
 * @param {Object} itemData 
 * @returns {Promise<Object>}
 */
export const addItemToCart = async (userId, itemData) => {
  const { productId, size, color, quantity } = itemData

  // 1. Fetch and validate product
  const product = await Product.findOne({ _id: productId, status: 'active' })
  if (!product) {
    throw new ApiError(404, 'Product not found, unavailable, or archived')
  }

  // 2. Validate product variants
  if (!product.sizes.includes(size)) {
    throw new ApiError(400, `Size ${size} is not available for this product`)
  }

  const requestedColorUpper = color.trim().toUpperCase()
  if (!product.colors.includes(requestedColorUpper)) {
    throw new ApiError(400, `Color ${color} is not available for this product`)
  }

  // 3. Verify stock
  if (product.stock < quantity) {
    throw new ApiError(400, `Insufficient stock. Only ${product.stock} items remaining.`)
  }

  // 4. Retrieve or create cart
  const cart = await getOrCreateCart(userId)

  // 5. Check if matching item exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === requestedColorUpper
  )

  if (existingItemIndex > -1) {
    // Increment quantity, capping at 10
    const newQty = cart.items[existingItemIndex].quantity + quantity
    if (newQty > 10) {
      throw new ApiError(400, `Cannot add quantity. Cart item maximum quantity is 10. (Current: ${cart.items[existingItemIndex].quantity})`)
    }
    
    // Check if total new quantity is within inventory stock limits
    if (product.stock < newQty) {
      throw new ApiError(400, `Insufficient stock for the requested quantity. Stock: ${product.stock}`)
    }

    cart.items[existingItemIndex].quantity = newQty
  } else {
    // Get product snapshot details
    const productImage = product.images && product.images.length > 0 ? product.images[0] : ''
    
    const productSnapshot = {
      product: product._id,
      name: product.name,
      image: productImage,
      price: product.price,
      sku: product.sku || ''
    }

    // Add new item
    cart.items.push({
      product: product._id,
      productSnapshot,
      sku: product.sku || '',
      name: product.name,
      image: productImage,
      price: product.price,
      size,
      color: requestedColorUpper,
      quantity,
      subtotal: product.price * quantity
    })
  }

  await cart.save()
  return cart
}

/**
 * Update the quantity of an item in the cart
 * @param {string} userId 
 * @param {string} itemId 
 * @param {number} quantity 
 * @returns {Promise<Object>}
 */
export const updateCartItemQuantity = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ user: userId, status: 'active' })
  if (!cart) {
    throw new ApiError(404, 'Cart not found')
  }

  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId)
  if (itemIndex === -1) {
    throw new ApiError(404, 'Cart item not found')
  }

  const item = cart.items[itemIndex]

  // Validate inventory
  const product = await Product.findOne({ _id: item.product, status: 'active' })
  if (!product) {
    throw new ApiError(404, 'Product associated with this cart item is no longer available')
  }

  if (product.stock < quantity) {
    throw new ApiError(400, `Insufficient stock. Only ${product.stock} items remaining.`)
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity
  await cart.save()
  
  return cart
}

/**
 * Remove an item from the cart
 * @param {string} userId 
 * @param {string} itemId 
 * @returns {Promise<Object>}
 */
export const removeCartItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId, status: 'active' })
  if (!cart) {
    throw new ApiError(404, 'Cart not found')
  }

  const itemExists = cart.items.some((item) => item._id.toString() === itemId)
  if (!itemExists) {
    throw new ApiError(404, 'Cart item not found')
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId)
  await cart.save()
  
  return cart
}

/**
 * Clear all items from user's active cart
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export const clearActiveCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId, status: 'active' })
  if (!cart) {
    throw new ApiError(404, 'Cart not found')
  }

  cart.items = []
  await cart.save()
  
  return cart
}
