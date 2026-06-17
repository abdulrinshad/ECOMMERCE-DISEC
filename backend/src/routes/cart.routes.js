import express from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cart.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { validateZod } from '../validations/product.validation.js'
import { addToCartSchema, updateQuantitySchema } from '../validations/cart.validation.js'

const router = express.Router()

// All shopping cart routes require JWT authentication
router.use(protect)

router.get('/', getCart)
router.post('/items', validateZod(addToCartSchema), addToCart)
router.patch('/items/:itemId', validateZod(updateQuantitySchema), updateCartItem)
router.delete('/items/:itemId', removeCartItem)
router.delete('/', clearCart)

export default router
