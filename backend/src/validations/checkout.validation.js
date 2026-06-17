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
  
  paymentMethod: z.enum(['COD', 'CARD'], {
    required_error: 'Payment method is required'
  }),
  
  paymentData: z.object({
    cardNumber: z.string().trim().optional(),
    expiry: z.string().trim().optional(),
    cvv: z.string().trim().optional(),
    cardName: z.string().trim().optional()
  }).optional(),

  promoCode: z.string().trim().optional().nullable()
}).refine(data => {
  if (data.paymentMethod === 'CARD') {
    return (
      data.paymentData &&
      data.paymentData.cardNumber && data.paymentData.cardNumber.trim().length >= 13 &&
      data.paymentData.expiry &&
      data.paymentData.cvv &&
      data.paymentData.cardName
    )
  }
  return true
}, {
  message: 'Card details are required when choosing CARD payment method',
  path: ['paymentData']
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
    error_map: () => ({ message: "Status must be one of: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'" })
  })
})
