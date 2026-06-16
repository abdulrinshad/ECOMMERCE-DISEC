import dotenv from 'dotenv'
// Load environment variables immediately
dotenv.config()

import app from './src/app.js'
import connectDB from './src/config/db.js'

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...')
  console.error(err.name, err.message)
  console.error(err.stack)
  process.exit(1)
})

// Connect database
connectDB()

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...')
  console.error(err.name, err.message)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
})
