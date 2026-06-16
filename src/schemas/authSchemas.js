import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Secret key is required')
})

export const registerSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string()
    .min(8, "Must be 8+ characters")
    .regex(/[A-Z]/, "Must contain 1 uppercase letter")
    .regex(/[a-z]/, "Must contain 1 lowercase letter")
    .regex(/[0-9]/, "Must contain 1 number")
    .regex(/[^A-Za-z0-9]/, "Must contain 1 special character"),
  confirmPassword: z.string().min(1, 'Please confirm your secret key'),
  agreedToTerms: z.boolean().refine((val) => val === true, 'You must agree to continue')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Keys do not match',
  path: ['confirmPassword']
})

export const otpSchema = z.object({
  otp: z.string().length(6, "Enter all 6 digits").regex(/^\d+$/, "Numbers only")
})

