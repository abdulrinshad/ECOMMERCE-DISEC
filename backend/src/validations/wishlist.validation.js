import { z } from 'zod'
import mongoose from 'mongoose'

// Helper to validate MongoDB ObjectId
const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ID format'
})

export const addToWishlistSchema = z.object({
  body: z.object({
    productId: objectIdSchema
  })
})

export const toggleWishlistSchema = z.object({
  params: z.object({
    productId: objectIdSchema
  })
})

export const removeFromWishlistSchema = z.object({
  params: z.object({
    productId: objectIdSchema
  })
})

export const moveToCartSchema = z.object({
  params: z.object({
    productId: objectIdSchema
  }),
  body: z.object({
    size: z.string().optional(),
    color: z.string().optional()
  })
})
