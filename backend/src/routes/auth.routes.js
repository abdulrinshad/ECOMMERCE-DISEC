import express from 'express'
import { body } from 'express-validator'
import {
  register,
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

// Validation rules
const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Full name must be between 2 and 50 characters'),
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
]

const loginValidation = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
]

const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Full name must be between 2 and 50 characters'),
  body('avatar')
    .optional()
    .isString().withMessage('Avatar must be a string URL'),
  body('shippingAddress')
    .optional()
    .isObject().withMessage('Shipping address must be an object')
]

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('New password must contain at least one number'),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
]

// Routes
router.post('/register', registerValidation, validate, register)
router.post('/login', loginValidation, validate, login)
router.post('/refresh', refresh)
router.post('/logout', logout)

// Protected routes
router.get('/me', protect, getProfile)
router.patch('/me', protect, updateProfileValidation, validate, updateProfile)
router.patch('/change-password', protect, changePasswordValidation, validate, changePassword)

export default router
