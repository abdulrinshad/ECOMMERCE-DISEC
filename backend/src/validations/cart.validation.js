import { z } from 'zod'
import { ALLOWED_SIZES } from '../constants/product.constants.js'

// Schema to add an item to the shopping cart
export const addToCartSchema = z.object({
  productId: z.string({
    required_error: 'Product ID is required'
  }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
  
  size: z.enum(ALLOWED_SIZES, {
    error_map: () => ({ message: `Size must be one of: ${ALLOWED_SIZES.join(', ')}` })
  }),
  
  color: z.string({
    required_error: 'Color is required'
  }).trim().min(1, 'Color cannot be empty'),
  
  quantity: z.number({
    required_error: 'Quantity is required',
    invalid_type_error: 'Quantity must be a number'
  })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Quantity cannot exceed 10')
})

// Schema to update cart item quantity
export const updateQuantitySchema = z.object({
  quantity: z.number({
    required_error: 'Quantity is required',
    invalid_type_error: 'Quantity must be a number'
  })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Quantity cannot exceed 10')
})
