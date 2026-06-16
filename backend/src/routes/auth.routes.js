import express from 'express'
import { body } from 'express-validator'
import rateLimit from 'express-rate-limit'
import {
  register,
  login,
  verifyOTP,
  resendOTP,
  refresh,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  checkEmail
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

// Specific Rate Limiters
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many registration attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many verification attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

const resendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many OTP requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

// Validation rules
const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Full name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-]+$/).withMessage('Full name can only contain letters, spaces, and hyphens'),
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character')
]

const loginValidation = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
]

const verifyOTPValidation = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('otp')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
    .isNumeric().withMessage('OTP must be numeric')
]

const resendOTPValidation = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail()
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
    .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('New password must contain at least one number')
    .matches(/[^A-Za-z0-9]/).withMessage('New password must contain at least one special character'),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
]

// Routes
router.post('/register', registerLimiter, registerValidation, validate, register)
router.post('/verify-otp', verifyOtpLimiter, verifyOTPValidation, validate, verifyOTP)
router.post('/resend-otp', resendOtpLimiter, resendOTPValidation, validate, resendOTP)
router.post('/login', loginLimiter, loginValidation, validate, login)
router.post('/refresh', refresh)
router.post('/logout', protect, logout)
router.get('/check-email', checkEmail)

// Protected routes
router.get('/me', protect, getProfile)
router.patch('/me', protect, updateProfileValidation, validate, updateProfile)
router.patch('/change-password', protect, changePasswordValidation, validate, changePassword)

export default router
