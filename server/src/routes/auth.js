import express from 'express'
import authController from '../../controllers/authController.js'
import { authenticateToken } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'

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
router.post('/register', asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
router.get('/verify-email', asyncHandler(authController.verifyEmail))
router.post('/forgot-password', asyncHandler(authController.forgotPassword))
router.post('/reset-password', asyncHandler(authController.resetPassword))
router.post('/delete-account', asyncHandler(authController.deleteAccount))

// Protected routes
router.get('/profile', authenticateToken, asyncHandler(authController.getProfile))
router.post('/change-password', authenticateToken, asyncHandler(authController.changePassword))
router.post('/refresh-token', asyncHandler(authController.refreshToken))

export default router

export default router
