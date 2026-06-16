import { validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiResponse.js'

export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  const extractedErrors = errors.array().map((err) => ({
    field: err.path || err.param,
    message: err.msg
  }))

  return next(new ApiError(400, 'Validation Error', extractedErrors))
}

export default validate
