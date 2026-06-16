export class ApiResponse {
  constructor(statusCode, data = null, message = 'Success') {
    this.success = statusCode < 400
    this.message = message
    this.statusCode = statusCode
    if (data !== null) {
      this.data = data
    }
  }
}

export class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = '') {
    super(message)
    this.statusCode = statusCode
    this.success = false
    this.errors = errors

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
