import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiResponse.js'

export const protect = async (req, res, next) => {
  try {
    let token
    const authHeader = req.headers.authorization

    
    if (authHeader && authHeader.startsWith('Bearer ')) {
  token = authHeader.split(' ')[1]
}

    if (!token) {
      return next(new ApiError(401, 'No token provided'))
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Token expired'))
      }
      return next(new ApiError(401, 'Invalid token'))
    }

    // Find user by id
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return next(new ApiError(401, 'The user belonging to this token no longer exists'))
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: You do not have permission to perform this action'))
    }
    next()
  }
}

export const authorize = restrictTo
