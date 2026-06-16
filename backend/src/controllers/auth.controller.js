import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { ApiResponse, ApiError } from '../utils/ApiResponse.js'
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie
} from '../utils/generateTokens.js'

/**
 * Register User
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new ApiError(409, 'Email already registered'))
    }

    // Create User
    const user = new User({
      fullName,
      email,
      password
    })

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    // Hash refresh token to store in DB
    const salt = await bcrypt.genSalt(10)
    user.refreshToken = await bcrypt.hash(refreshToken, salt)

    await user.save()

    // Send HTTP-Only Cookie
    setRefreshTokenCookie(res, refreshToken)

    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      memberLevel: user.memberLevel,
      createdAt: user.createdAt
    }

    return res.status(201).json(
      new ApiResponse(201, { user: userResponse, accessToken }, 'User registered successfully')
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

    // Find user (explicitly selecting password and refreshToken)
    const user = await User.findOne({ email }).select('+password +refreshToken')
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'))
    }

    // Compare passwords
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
      return next(new ApiError(401, 'Invalid credentials'))
    }

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
