import { z } from 'zod'
import { ApiError } from '../utils/ApiResponse.js'
import { ALLOWED_CATEGORIES, ALLOWED_SIZES, ALLOWED_STATUSES } from '../constants/product.constants.js'

// Base validation fields schema
export const productFieldsSchema = z.object({
  name: z.string({
    required_error: 'Product name is required'
  })
    .trim()
    .min(3, 'Product name must be at least 3 characters')
    .max(120, 'Product name cannot exceed 120 characters'),
  
  description: z.string({
    required_error: 'Product description is required'
  })
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  
  shortDescription: z.string().trim().max(500, 'Short description cannot exceed 500 characters').optional().default(''),
  
  brand: z.string().trim().max(100, 'Brand name cannot exceed 100 characters').optional().default(''),
  
  category: z.enum(ALLOWED_CATEGORIES, {
    error_map: () => ({ message: `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}` })
  }),
  
  subCategory: z.string().trim().max(100, 'Subcategory name cannot exceed 100 characters').optional().default(''),
  
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number'
  }).positive('Price must be greater than 0'),
  
  compareAtPrice: z.number().positive('Compare at price must be greater than 0').nullable().optional(),
  
  currency: z.string().trim().default('USD'),
  
  images: z.array(z.string().url('Product images must be valid URLs'))
    .min(1, 'Product must have at least 1 image')
    .max(10, 'Product cannot have more than 10 images'),
  
  thumbnail: z.string().url('Thumbnail must be a valid URL').optional().default(''),
  
  stock: z.number({
    required_error: 'Stock quantity is required',
    invalid_type_error: 'Stock must be a number'
  })
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  
  sku: z.string().trim().optional(),
  
  sizes: z.array(z.enum(ALLOWED_SIZES, {
    error_map: () => ({ message: `Sizes must only contain: ${ALLOWED_SIZES.join(', ')}` })
  })).optional().default([]),
  
  colors: z.array(z.string().trim().min(1))
    .optional()
    .default([])
    .transform((val) => [...new Set(val.map(c => c.toUpperCase()))]),
  
  badge: z.string().trim().max(50, 'Badge text cannot exceed 50 characters').optional().default(''),
  
  limitedCount: z.number().int().positive().nullable().optional(),
  
  isFeatured: z.boolean().optional().default(false),
  
  status: z.enum(ALLOWED_STATUSES, {
    error_map: () => ({ message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}` })
  }).optional().default('draft'),
  
  metaTitle: z.string().trim().max(100, 'Meta title cannot exceed 100 characters').optional().default(''),
  
  metaDescription: z.string().trim().max(200, 'Meta description cannot exceed 200 characters').optional().default('')
})

// Create schema adds compareAtPrice validation on top of base fields
export const createProductSchema = productFieldsSchema.refine((data) => {
  if (data.compareAtPrice !== undefined && data.compareAtPrice !== null) {
    return data.compareAtPrice >= data.price
  }
  return true
}, {
  message: 'Compare at price must be greater than or equal to the product price',
  path: ['compareAtPrice']
})

// Update schema makes all base fields optional, then adds compareAtPrice validation
export const updateProductSchema = productFieldsSchema.partial().refine((data) => {
  // If both are provided, validate compareAtPrice >= price
  if (data.price !== undefined && data.compareAtPrice !== undefined && data.compareAtPrice !== null) {
    return data.compareAtPrice >= data.price
  }
  return true
}, {
  message: 'Compare at price must be greater than or equal to the product price',
  path: ['compareAtPrice']
})

/**
 * Express middleware to validate request bodies using Zod schemas
 * @param {z.ZodSchema} schema 
 * @returns {Function}
 */
export const validateZod = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))
        return next(new ApiError(400, 'Validation Error', formattedErrors))
      }
      next(error)
    }
  }
}
