import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js'
import { protect, authorize } from '../middleware/auth.middleware.js'
import { createProductSchema, updateProductSchema, validateZod } from '../validations/product.validation.js'

const router = express.Router()

// Middleware to optionally decode JWT if provided, allowing admins to query draft products
const optionalProtect = async (req, res, next) => {
  try {
    let token
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }

    if (!token) {
      return next()
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (user) {
      req.user = user
    }
    next()
  } catch (error) {
    // Fail silently to treat as normal public request if token is invalid
    next()
  }
}

// Public Routes
router.get('/', optionalProtect, getProducts)
router.get('/:slug', optionalProtect, getProductBySlug)
router.get('/:slug/related', getRelatedProducts)

// Admin Routes (JWT protect + role verification required)
router.post('/', protect, authorize('admin'), validateZod(createProductSchema), createProduct)
router.put('/:id', protect, authorize('admin'), validateZod(updateProductSchema), updateProduct)
router.delete('/:id', protect, authorize('admin'), deleteProduct)

export default router
