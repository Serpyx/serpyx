import express from 'express'
import authController from '../../controllers/authController.js'
import { authenticateToken } from '../../middleware/auth.js'

const router = express.Router()

// Health check for auth routes
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes working',
    timestamp: new Date().toISOString()
  })
})

// Public routes
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/verify-email', authController.verifyEmail)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.post('/delete-account', authController.deleteAccount)

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile)
router.post('/change-password', authenticateToken, authController.changePassword)

export default router
