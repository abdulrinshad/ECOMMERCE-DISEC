import express from 'express'
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  moveToCart
} from '../controllers/wishlist.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { validateZod } from '../validations/product.validation.js'
import {
  addToWishlistSchema,
  removeFromWishlistSchema,
  toggleWishlistSchema,
  moveToCartSchema
} from '../validations/wishlist.validation.js'

const router = express.Router()

// All wishlist routes require JWT authentication
router.use(protect)

router.get('/', getWishlist)
router.post('/items', validateZod(addToWishlistSchema), addToWishlist)
router.delete('/items/:productId', validateZod(removeFromWishlistSchema), removeFromWishlist)
router.post('/toggle/:productId', validateZod(toggleWishlistSchema), toggleWishlist)
router.post('/move-to-cart/:productId', validateZod(moveToCartSchema), moveToCart)
router.delete('/', clearWishlist)

export default router
