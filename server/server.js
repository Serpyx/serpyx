import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import authController from './controllers/authController.js'
import { authenticateToken } from './middleware/auth.js'
import emailService from './services/emailService.js'
import databaseService from './services/databaseService.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.'
  }
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serpyx API is running',
    timestamp: new Date().toISOString()
  })
})

// Email service test
app.get('/api/test-email', async (req, res) => {
  try {
    const isConnected = await emailService.testConnection()
    res.json({
      success: isConnected,
      message: isConnected ? 'Email service is ready' : 'Email service is not configured'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email service error',
      error: error.message
    })
  }
})

// Auth routes
app.post('/api/register', authController.register)
app.post('/api/login', authController.login)
app.get('/api/verify-email', authController.verifyEmail)
app.post('/api/forgot-password', authController.forgotPassword)
app.post('/api/reset-password', authController.resetPassword)
app.post('/api/delete-account', authController.deleteAccount)
app.post('/api/change-password', authenticateToken, authController.changePassword)
app.get('/api/profile', authenticateToken, authController.getProfile)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Serpyx Server running on port ${PORT}`)
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`)
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  databaseService.close()
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  databaseService.close()
  process.exit(0)
})
