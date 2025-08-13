import express from 'express'
import cors from 'cors'
import authController from './controllers/authController.js'

const app = express()
const PORT = 5000

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serpyx API is running',
    timestamp: new Date().toISOString()
  })
})

// Auth routes
app.post('/api/register', authController.register)
app.post('/api/login', authController.login)
app.get('/api/verify-email', authController.verifyEmail)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Serpyx Server running on port ${PORT}`)
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`)
  console.log(`🔗 Client URL: http://localhost:3000`)
})

export default app








