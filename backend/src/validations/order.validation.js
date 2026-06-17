import { z } from 'zod'

export const getOrdersQuerySchema = z.object({
  page: z.preprocess((val) => parseInt(val || '1', 10), z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => parseInt(val || '10', 10), z.number().int().min(1).max(100).default(10)),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  sortBy: z.string().trim().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const cancelOrderSchema = z.object({
  cancelReason: z.string({
    required_error: 'Cancellation reason is required'
  }).trim().min(5, 'Cancellation reason must be at least 5 characters')
})

export const adminUpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
    error_map: () => ({ message: 'Invalid order status transition' })
  }),
  message: z.string().trim().optional()
})
