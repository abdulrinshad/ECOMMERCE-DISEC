import { z } from 'zod'

export const createReviewSchema = z.object({
  productId: z.string({
    required_error: 'Product ID is required'
  }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
  
  rating: z.number({
    required_error: 'Rating is required'
  }).int('Rating must be an integer').min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  
  title: z.string({
    required_error: 'Title is required'
  }).trim().min(1, 'Title cannot be empty').max(120, 'Title cannot exceed 120 characters'),
  
  comment: z.string({
    required_error: 'Comment is required'
  }).trim().min(1, 'Comment cannot be empty').max(2000, 'Comment cannot exceed 2000 characters')
})

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().trim().min(1).max(120).optional(),
  comment: z.string().trim().min(1).max(2000).optional()
}).refine(data => data.rating !== undefined || data.title !== undefined || data.comment !== undefined, {
  message: 'At least one field (rating, title, or comment) must be provided for update'
})

export const getReviewsQuerySchema = z.object({
  page: z.preprocess((val) => parseInt(val || '1', 10), z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => parseInt(val || '10', 10), z.number().int().min(1).max(100).default(10)),
  sortBy: z.enum(['createdAt', 'rating', 'helpfulCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})
