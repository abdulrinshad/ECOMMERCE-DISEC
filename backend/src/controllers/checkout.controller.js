import * as checkoutService from '../services/checkout.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

/**
 * Handle checkout submission
 * POST /api/checkout
 */
export const checkout = async (req, res, next) => {
  try {
    const userId = req.user.id
    const order = await checkoutService.processCheckout(userId, req.body)

    return res.status(201).json(
      new ApiResponse(210, order, 'Acquisition order successfully processed')
    )
  } catch (error) {
    next(error)
  }
}
