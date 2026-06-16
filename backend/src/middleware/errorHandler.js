import { ApiError } from '../utils/ApiResponse.js'

export const errorHandler = (err, req, res, next) => {
  let error = err

  // Check if it is a Mongoose Duplicate Key Error
  if (error.code === 11000) {
    const message = 'Email already registered'
    error = new ApiError(409, message)
  }
  // Check if it is a Mongoose Validation Error
  else if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map((val) => val.message).join(', ')
    error = new ApiError(400, message)
  }
  // JWT Errors
  else if (error.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token')
  } else if (error.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired')
  }
  // If not instance of ApiError, create a new one
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal server error'
    error = new ApiError(statusCode, message, [], err.stack)
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || []
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack
  }

  return res.status(error.statusCode || 500).json(response)
}

export default errorHandler
