import { z } from 'zod'

export const checkoutSchema = z.object({
  email: z.string({
    required_error: 'Email is required'
  }).email('Please provide a valid email address'),
  
  keepUpdated: z.boolean().optional().default(false),
  
  deliveryData: z.object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    address1: z.string().trim().min(1, 'Address is required'),
    address2: z.string().trim().optional().default(''),
    city: z.string().trim().min(1, 'City is required'),
    postalCode: z.string().trim().min(1, 'Postal code is required'),
    country: z.string().trim().min(1, 'Country is required')
  }),
  
  shippingMethod: z.enum(['standard', 'express'], {
    error_map: () => ({ message: "Shipping method must be either 'standard' or 'express'" })
  }),
  
  paymentData: z.object({
    cardNumber: z.string().trim().min(13, 'Card number must be at least 13 digits').max(19, 'Card number cannot exceed 19 digits'),
    expiry: z.string().trim().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry must be in MM/YY format'),
    cvv: z.string().trim().min(3, 'CVV must be 3 digits').max(4, 'CVV cannot exceed 4 digits'),
    cardName: z.string().trim().min(1, 'Name on card is required')
  }),

  promoCode: z.string().trim().optional().nullable()
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
    error_map: () => ({ message: "Status must be one of: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'" })
  })
})
