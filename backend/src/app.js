import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import authRouter from './routes/auth.routes.js'
import errorHandler from './middleware/errorHandler.js'
import { ApiError } from './utils/ApiResponse.js'

const app = express()

// 1. Helmet for security headers
app.use(helmet())

// 2. CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
)

// 3. JSON body parser with limit
app.use(express.json({ limit: '10kb' }))

// 4. URL-encoded parser
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// 5. Cookie Parser
app.use(cookieParser())

// 6. Request logging with Morgan (dev mode only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// 7. Rate limiter on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, slow down'
  },
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/auth', authLimiter)

// 8. Auth Router mounting
app.use('/api/auth', authRouter)

// 9. 404 handler for unknown routes
app.all('*', (req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server`))
})

// 10. Global error handler middleware (must be registered last)
app.use(errorHandler)

export default app
export { app }
