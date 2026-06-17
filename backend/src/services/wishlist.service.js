import { Wishlist } from '../models/wishlist.model.js'
import { Product } from '../models/product.model.js'
import { ApiError } from '../utils/ApiResponse.js'
import { addItemToCart } from './cart.service.js'

/**
 * Get the user's wishlist or create an empty one
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId })
  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, items: [] })
    await wishlist.save()
  }
  return wishlist
}

/**
 * Add a product to the wishlist
 * @param {string} userId 
 * @param {string} productId 
 * @returns {Promise<Object>}
 */
export const addToWishlist = async (userId, productId) => {
  const product = await Product.findOne({ _id: productId, status: 'active' })
  if (!product) {
    throw new ApiError(404, 'Product not found, unavailable, or archived')
  }

  const wishlist = await getWishlist(userId)

  const isAlreadyInWishlist = wishlist.items.some(
    (item) => item.product.toString() === productId
  )

  if (isAlreadyInWishlist) {
    throw new ApiError(400, 'Product is already in wishlist')
  }

  const productImage = product.images && product.images.length > 0 ? product.images[0] : ''

  wishlist.items.push({
    product: product._id,
    productSnapshot: {
      name: product.name,
      slug: product.slug,
      image: productImage,
      price: product.price,
      badge: product.badge || ''
    }
  })

  await wishlist.save()
  return wishlist
}

/**
 * Remove a product from the wishlist
 * @param {string} userId 
 * @param {string} productId 
 * @returns {Promise<Object>}
 */
export const removeFromWishlist = async (userId, productId) => {
  const wishlist = await getWishlist(userId)

  wishlist.items = wishlist.items.filter(
    (item) => item.product.toString() !== productId
  )

  await wishlist.save()
  return wishlist
}

/**
 * Toggle a product in the wishlist (add if missing, remove if present)
 * @param {string} userId 
 * @param {string} productId 
 * @returns {Promise<Object>}
 */
export const toggleWishlist = async (userId, productId) => {
  const wishlist = await getWishlist(userId)

  const isAlreadyInWishlist = wishlist.items.some(
    (item) => item.product.toString() === productId
  )

  if (isAlreadyInWishlist) {
    return await removeFromWishlist(userId, productId)
  } else {
    return await addToWishlist(userId, productId)
  }
}

/**
 * Clear the entire wishlist
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export const clearWishlist = async (userId) => {
  const wishlist = await getWishlist(userId)
  wishlist.items = []
  await wishlist.save()
  return wishlist
}

/**
 * Move an item from wishlist to cart
 * @param {string} userId 
 * @param {string} productId 
 * @param {string} size 
 * @param {string} color 
 * @returns {Promise<Object>}
 */
export const moveToCart = async (userId, productId, size, color) => {
  const wishlist = await getWishlist(userId)

  const itemIndex = wishlist.items.findIndex(
    (item) => item.product.toString() === productId
  )

  if (itemIndex === -1) {
    throw new ApiError(404, 'Product not found in wishlist')
  }

  // Attempt to add to cart
  try {
    // Determine size and color if not provided
    let finalSize = size
    let finalColor = color

    // If variants aren't provided, try to pick the first available ones
    if (!finalSize || !finalColor) {
      const product = await Product.findById(productId)
      if (!product) throw new ApiError(404, 'Product not found')

      if (!finalSize && product.sizes && product.sizes.length > 0) {
        finalSize = product.sizes[0]
      }
      if (!finalColor && product.colors && product.colors.length > 0) {
        finalColor = product.colors[0]
      }
    }

    // This will throw if the cart logic rejects it (e.g. stock, invalid size)
    await addItemToCart(userId, {
      productId,
      size: finalSize,
      color: finalColor,
      quantity: 1
    })

    // Remove from wishlist only if add to cart succeeds
    wishlist.items.splice(itemIndex, 1)
    await wishlist.save()

    return wishlist
  } catch (error) {
    throw error // Let the controller handle the ApiError
  }
}
