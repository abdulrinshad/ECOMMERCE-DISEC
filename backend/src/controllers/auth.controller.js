import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { ApiResponse, ApiError } from '../utils/ApiResponse.js'
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie
} from '../utils/generateTokens.js'
import { generateOTP, hashOTP, compareOTP } from '../utils/otp.js'
import { sendOTPEmail, sendResetPasswordOTPEmail } from '../utils/sendEmail.js'

/**
 * Register User
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body

if (!fullName || !email || !password) {
  return next(
    new ApiError(400, 'All fields are required')
  )
}

const normalizedEmail = email.toLowerCase().trim()

    if (!fullName || !email || !password) {
      return next(new ApiError(400, 'All fields are required'))
    }

    if (password.length < 8) {
      return next(
        new ApiError(
          400,
          'Password must be at least 8 characters'
        )
      )
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail
    })
    if (existingUser) {
      if (existingUser.isVerified) {
        return next(new ApiError(409, 'An account with this email already exists'))
      } else {
        // DELETE old unverified record (allow retry), proceed
        await User.deleteOne({ _id: existingUser._id })
      }
    }

    // Create User
    const user = new User({
      fullName,
      email: normalizedEmail,
      password
    })

    // Generate OTP -> hash it -> save otp + otpExpires (Date.now() + 10*60*1000)
    const plainOtp = generateOTP()
    const hashed = await hashOTP(plainOtp)
    user.otp = hashed
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000)
    user.otpAttempts = 0
    user.otpLockedUntil = null

    await user.save()

    // Send OTP email (async, don't block response)
    sendOTPEmail(user.email, user.fullName, plainOtp).catch((err) => {
      console.error('Failed to send OTP email during registration:', err)
    })

    return res.status(201).json(
      new ApiResponse(201, {
        email: user.email,
        requiresVerification: true,
        redirectTo: '/verify-email'
      }, 'Verification code sent to your email')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Login User
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return next(
        new ApiError(400, 'Email and password are required')
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail }).select('+password +refreshToken')

    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'))
    }

    // Check account lockout
    if (user.loginLockUntil && user.loginLockUntil > Date.now()) {
      const remainingMinutes = Math.ceil((user.loginLockUntil - Date.now()) / (60 * 1000))
      return next(new ApiError(429, `Too many failed attempts. Try again in ${remainingMinutes} minutes`))
    }

    // Check verification status
    if (user.isVerified === false) {
      return next(new ApiError(403, 'Please verify your email before logging in'))
    }

    // Compare password
const isPasswordMatch = await user.comparePassword(password)

if (!isPasswordMatch) {
  console.warn(
    `Failed login attempt for ${user.email}`
  )

  user.failedLoginAttempts += 1

  if (user.failedLoginAttempts >= 5) {
    user.loginLockUntil = new Date(
      Date.now() + 15 * 60 * 1000
    )

    user.failedLoginAttempts = 0
  }

  await user.save()

  return next(
    new ApiError(401, 'Invalid credentials')
  )
}
// Reset after successful login
user.failedLoginAttempts = 0
user.loginLockUntil = null

await user.save()

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    // Save hashed refresh token to DB
    const salt = await bcrypt.genSalt(10)
    user.refreshToken = await bcrypt.hash(refreshToken, salt)
    await user.save()

    // Set cookie
    setRefreshTokenCookie(res, refreshToken)

    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      memberLevel: user.memberLevel,
      createdAt: user.createdAt
    }

    return res.status(200).json(
      new ApiResponse(200, { user: userResponse, accessToken }, 'Logged in successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Verify OTP
 * POST /api/auth/verify-otp
 */
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return next(
        new ApiError(400, 'Email and OTP are required')
      )
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+otp')
    if (!user) {
      return next(new ApiError(400, 'Invalid or expired verification code'))
    }

    if (user.isVerified) {
      return next(new ApiError(400, 'Account already verified'))
    }

    // Check lockout
    if (user.otpLockedUntil && user.otpLockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((user.otpLockedUntil - Date.now()) / (60 * 1000))
      return next(new ApiError(429, `Too many attempts. Try again in ${remainingMinutes} minutes`))
    }

    // Check otpExpires
    if (!user.otpExpires || Date.now() > user.otpExpires) {
      return next(new ApiError(400, 'Verification code expired. Please request a new one'))
    }

    // Compare OTP
    const isMatch = await compareOTP(otp, user.otp)
    if (!isMatch) {
      user.otpAttempts += 1
      if (user.otpAttempts >= 5) {
        user.otpLockedUntil = new Date(Date.now() + 15 * 60 * 1000)
        user.otpAttempts = 0
      }
      await user.save()
      return next(new ApiError(400, 'Invalid or expired verification code'))
    }

    // Correct
    user.isVerified = true
    user.otp = null
    user.otpExpires = null
    user.otpAttempts = 0
    user.otpLockedUntil = null
    await user.save()

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          email: user.email,
          redirectTo: '/login'
        },
        'Email verified successfully'
      )
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Resend OTP
 * POST /api/auth/resend-otp
 */
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body
    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail })
    if (!user || user.isVerified) {
      return res.status(200).json(
        new ApiResponse(200, null, 'If an account exists, a new code has been sent')
      )
    }

    // Rate limit: last OTP sent > 60s ago
    if (user.otpExpires && Date.now() < (user.otpExpires.getTime() - 9 * 60 * 1000)) {
      const secondsLeft = Math.ceil(((user.otpExpires.getTime() - 9 * 60 * 1000) - Date.now()) / 1000)
      return next(new ApiError(429, `Please wait ${secondsLeft} seconds before requesting a new code`))
    }

    const plainOtp = generateOTP()
    const hashed = await hashOTP(plainOtp)
    user.otp = hashed
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000)
    user.otpAttempts = 0
    user.otpLockedUntil = null
    await user.save()

    sendOTPEmail(user.email, user.fullName, plainOtp).catch((err) => {
      console.error('Failed to send resend-OTP email:', err)
    })

    return res.status(200).json(
      new ApiResponse(200, null, 'If an account exists, a new code has been sent')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Refresh Token Rotation
 * POST /api/auth/refresh
 */
export const refresh = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken

    if (!incomingRefreshToken) {
      return next(new ApiError(401, 'Refresh token not found'))
    }

    let decoded
    try {
      decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
      // Clear cookie if verification fails
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' })
      return next(new ApiError(403, 'Invalid or expired refresh token'))
    }

    const user = await User.findById(decoded.id).select('+refreshToken')
    if (!user || !user.refreshToken) {
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' })
      return next(new ApiError(403, 'Token reuse or invalid session detected'))
    }

    // Compare refresh tokens
    const isTokenMatch = await bcrypt.compare(incomingRefreshToken, user.refreshToken)
    if (!isTokenMatch) {
      // Mismatch indicates token reuse/compromise -> clear all user sessions for safety
      user.refreshToken = null
      await user.save()

      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' })
      return next(new ApiError(403, 'Compromised token session detected, revoked access'))
    }

    // Token matches -> Generate new pair (Token Rotation)
    const newAccessToken = generateAccessToken(user._id, user.role)
    const newRefreshToken = generateRefreshToken(user._id)

    // Save hashed refresh token to DB
    const salt = await bcrypt.genSalt(10)
    user.refreshToken = await bcrypt.hash(newRefreshToken, salt)
    await user.save()

    // Send new cookie
    setRefreshTokenCookie(res, newRefreshToken)

    return res.status(200).json(
      new ApiResponse(200, { accessToken: newAccessToken }, 'Token refreshed successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Logout User
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken

    if (incomingRefreshToken) {
      // Decode user ID to remove it from DB
      try {
        const decoded = jwt.decode(incomingRefreshToken)
        if (decoded?.id) {
          await User.findByIdAndUpdate(decoded.id, { refreshToken: null })
        }
      } catch (err) {
        // Ignore parsing errors on logout
      }
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return res.status(200).json(
      new ApiResponse(200, null, 'Logged out successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get Current Profile
 * GET /api/auth/me
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user was populated by protect middleware
    const user = await User.findById(req.user.id)
    if (!user) {
      return next(new ApiError(404, 'User not found'))
    }

    return res.status(200).json(
      new ApiResponse(200, user, 'Profile retrieved successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Update Profile
 * PATCH /api/auth/me
 */
export const updateProfile = async (req, res, next) => {
  try {
    // Extra guard: filter request body for allowed fields only
    const allowedUpdates = ['fullName', 'avatar', 'shippingAddress']
    const updates = {}

    // Check for disallowed fields (role, password, email, etc.)
    const bodyKeys = Object.keys(req.body)
    const isValidOperation = bodyKeys.every((key) => allowedUpdates.includes(key))

    if (!isValidOperation) {
      return next(new ApiError(400, 'Invalid fields in update payload'))
    }

    // Extract allowed keys
    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) {
        if (key === 'shippingAddress' && typeof req.body[key] === 'object') {
          // nested handling
          updates.shippingAddress = {
            line1: req.body.shippingAddress.line1 ?? '',
            line2: req.body.shippingAddress.line2 ?? '',
            city: req.body.shippingAddress.city ?? '',
            postalCode: req.body.shippingAddress.postalCode ?? '',
            country: req.body.shippingAddress.country ?? ''
          }
        } else {
          updates[key] = req.body[key]
        }
      }
    })

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return next(new ApiError(404, 'User not found'))
    }

    return res.status(200).json(
      new ApiResponse(200, updatedUser, 'Profile updated successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Change Password
 * PATCH /api/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
      return next(new ApiError(400, 'New passwords do not match'))
    }

    // Retrieve user including password field
    const user = await User.findById(req.user.id).select('+password')
    if (!user) {
      return next(new ApiError(404, 'User not found'))
    }

    // Match current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return next(new ApiError(400, 'Invalid current password'))
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword

    // Revoke all refresh tokens
    user.refreshToken = null
    await user.save()

    // Clear client cookie to force log in again
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return res.status(200).json(
      new ApiResponse(200, null, 'Password changed. Please login again.')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Check if email exists
 * GET /api/auth/check-email
 */
export const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.query
    if (!email) {
      return next(new ApiError(400, 'Email parameter is required'))
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    return res.status(200).json(
      new ApiResponse(200, { exists: !!user }, 'Email check completed')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) {
      return next(new ApiError(400, 'Email is required'))
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })

    const successResponse = new ApiResponse(
      200,
      null,
      'If an account exists, a verification code has been sent.'
    )

    if (!user) {
      return res.status(200).json(successResponse)
    }

    const plainOtp = generateOTP()
    const hashed = await hashOTP(plainOtp)

    user.resetPasswordOTP = hashed
    user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000)
    user.resetPasswordOTPAttempts = 0
    user.resetPasswordOTPLockedUntil = null
    await user.save()

    sendResetPasswordOTPEmail(user.email, user.fullName, plainOtp).catch((err) => {
      console.error('Failed to send reset password OTP email:', err)
    })

    return res.status(200).json(successResponse)
  } catch (error) {
    next(error)
  }
}

/**
 * Verify Reset OTP
 * POST /api/auth/verify-reset-otp
 */
export const verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) {
      return next(new ApiError(400, 'Email and OTP are required'))
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail }).select('+resetPasswordOTP')

    if (!user) {
      return next(new ApiError(400, 'Invalid or expired verification code'))
    }

    if (user.resetPasswordOTPLockedUntil && user.resetPasswordOTPLockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((user.resetPasswordOTPLockedUntil - Date.now()) / (60 * 1000))
      return next(new ApiError(429, `Too many attempts. Try again in ${remainingMinutes} minutes`))
    }

    if (!user.resetPasswordOTPExpires || Date.now() > user.resetPasswordOTPExpires) {
      return next(new ApiError(400, 'Verification code expired. Please request a new one'))
    }

    const isMatch = await compareOTP(otp, user.resetPasswordOTP)
    if (!isMatch) {
      user.resetPasswordOTPAttempts += 1
      if (user.resetPasswordOTPAttempts >= 5) {
        user.resetPasswordOTPLockedUntil = new Date(Date.now() + 15 * 60 * 1000)
        user.resetPasswordOTPAttempts = 0
      }
      await user.save()
      return next(new ApiError(400, 'Invalid or expired verification code'))
    }

    user.resetPasswordOTPAttempts = 0
    await user.save()

    return res.status(200).json(
      new ApiResponse(200, null, 'Verification successful')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password, confirmPassword } = req.body
    if (!email || !otp || !password || !confirmPassword) {
      return next(new ApiError(400, 'All fields are required'))
    }

    if (password !== confirmPassword) {
      return next(new ApiError(400, 'Passwords do not match'))
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail }).select('+resetPasswordOTP')

    if (!user) {
      return next(new ApiError(400, 'Invalid or expired verification code'))
    }

    if (user.resetPasswordOTPLockedUntil && user.resetPasswordOTPLockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((user.resetPasswordOTPLockedUntil - Date.now()) / (60 * 1000))
      return next(new ApiError(429, `Too many attempts. Try again in ${remainingMinutes} minutes`))
    }

    if (!user.resetPasswordOTPExpires || Date.now() > user.resetPasswordOTPExpires) {
      return next(new ApiError(400, 'Verification code expired. Please request a new one'))
    }

    const isMatch = await compareOTP(otp, user.resetPasswordOTP)
    if (!isMatch) {
      return next(new ApiError(400, 'Invalid or expired verification code'))
    }

    user.password = password
    user.resetPasswordOTP = null
    user.resetPasswordOTPExpires = null
    user.resetPasswordOTPAttempts = 0
    user.resetPasswordOTPLockedUntil = null
    user.refreshToken = null
    await user.save()

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return res.status(200).json(
      new ApiResponse(200, null, 'Password reset successful')
    )
  } catch (error) {
    next(error)
  }
}

