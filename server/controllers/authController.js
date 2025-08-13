import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import emailService from '../services/emailService.js'
import databaseService from '../services/databaseService.js'

class AuthController {
  // Register user
  async register(req, res) {
    try {
      const { username, email, password } = req.body

      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Tüm alanlar gereklidir'
        })
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Şifre en az 6 karakter olmalıdır'
        })
      }

            // Hash password first (expensive operation)
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Prepare user data
      const userId = uuidv4()
      const verificationToken = uuidv4()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      
      const user = {
        id: userId,
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        coins: 0, // No welcome bonus
        highScore: 0,
        totalScore: 0,
        createdAt: new Date().toISOString(),
        lastLogin: null
      }

      // Atomic database operation: Create user and verification token together
      try {
        databaseService.createUserWithVerificationToken(user, verificationToken, expiresAt)
        console.log('✅ User and verification token created successfully:', email)
      } catch (dbError) {
        console.error('❌ Database operation failed:', dbError.message)
        
        // Handle specific duplicate entry errors
        if (dbError.message.includes('kullanılıyor') || dbError.message.includes('UNIQUE constraint')) {
          return res.status(400).json({
            success: false,
            message: 'Bu e-posta adresi veya kullanıcı adı zaten kullanılıyor'
          })
        }
        
        // Generic database error
        return res.status(500).json({
          success: false,
          message: 'Veritabanı hatası. Lütfen daha sonra tekrar deneyin.'
        })
      }

      // ✅ HEMEN RESPONSE DÖNDÜR - Mail gönderimini bekletme!
      res.status(201).json({
        success: true,
        message: 'Hesap başarıyla oluşturuldu. Lütfen e-posta adresinizi doğrulayın.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified
        }
      })

      // 🔥 ASYNC: Mail gönderimini arka planda yap (response'dan sonra)
      emailService.sendVerificationEmail(email, username, verificationToken)
        .then(emailResult => {
          if (emailResult.success) {
            console.log('✅ Verification email sent successfully to:', email)
          } else {
            console.error('❌ Email sending failed (non-blocking):', emailResult.error)
            // Mail başarısız olsa bile kullanıcı kayıtlı kalır
            // İsteğe bağlı: Admin'e bildir veya retry mekanizması ekle
          }
        })
        .catch(emailError => {
          console.error('❌ Email service error (non-blocking):', emailError)
          // Mail servisi çökse bile kullanıcı kayıtlı kalır
        })

    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({
        success: false,
        message: 'Sunucu hatası'
      })
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'E-posta ve şifre gereklidir'
        })
      }

      // Find user in database
      const user = databaseService.findUserByEmail(email)

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Geçersiz e-posta veya şifre'
        })
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Geçersiz e-posta veya şifre'
        })
      }

      // Check if email is verified
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: 'Lütfen önce e-posta adresinizi doğrulayın'
        })
      }

      // Get client IP and device info
      const clientIP = req.ip || req.connection.remoteAddress
      const userAgent = req.get('User-Agent') || 'Unknown Device'
      
      // Check if this is a new device/location (simple check)
      const isNewLogin = !user.lastLogin || 
        (new Date() - new Date(user.lastLogin)) > (24 * 60 * 60 * 1000) // 24 hours

      // Update last login
      user.lastLogin = new Date().toISOString()
      databaseService.updateUser(user)

      // Send security alert for new logins
      if (isNewLogin) {
        const loginInfo = {
          date: new Date().toLocaleString('tr-TR'),
          ip: clientIP,
          device: userAgent,
          location: 'Türkiye' // You can use IP geolocation service here
        }
        
        // Send security alert email (non-blocking)
        emailService.sendSecurityAlertEmail(user.email, user.username, loginInfo)
          .catch(error => console.error('Security alert email error:', error))
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.TOKEN_EXPIRY || '24h' }
      )

      res.json({
        success: true,
        message: 'Giriş başarılı',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          coins: user.coins,
          highScore: user.highScore,
          totalScore: user.totalScore,
          isVerified: user.isVerified
        }
      })

    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Sunucu hatası'
      })
    }
  }

  // Verify email
  async verifyEmail(req, res) {
    try {
      const { token } = req.query

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Doğrulama token\'ı gereklidir'
        })
      }

      const verificationData = databaseService.findVerificationToken(token)

      if (!verificationData) {
        return res.status(400).json({
          success: false,
          message: 'Geçersiz veya süresi dolmuş doğrulama linki'
        })
      }

      if (new Date() > verificationData.expiresAt) {
        databaseService.deleteVerificationToken(token)
        return res.status(400).json({
          success: false,
          message: 'Doğrulama linkinin süresi dolmuş'
        })
      }

      const user = databaseService.findUserById(verificationData.userId)

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        })
      }

      // Mark user as verified
      user.isVerified = true
      databaseService.updateUser(user)

      // Remove verification token
      databaseService.deleteVerificationToken(token)

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.username)

      res.json({
        success: true,
        message: 'E-posta adresiniz başarıyla doğrulandı!'
      })

    } catch (error) {
      console.error('Email verification error:', error)
      res.status(500).json({
        success: false,
        message: 'Sunucu hatası'
      })
    }
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'E-posta adresi gereklidir'
        })
      }

      // Find user in database
      let user = databaseService.findUserByEmail(email)

      // If no user found, create a test user for demo purposes
      if (!user) {
        console.log('Creating test user for email:', email)
        const testUserId = uuidv4()
                 user = {
           id: testUserId,
           username: email.split('@')[0], // Use email prefix as username
           email: email,
           password: 'test-password',
           isVerified: true,
           coins: 0,
           highScore: 0,
           totalScore: 0,
           createdAt: new Date().toISOString(),
           lastLogin: null
         }
        databaseService.createUser(user)
      }

      // Generate reset token
      const resetToken = uuidv4()
      databaseService.createResetToken(
        resetToken,
        user.id,
        user.email,
        new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
      )

      // Send reset email
      const emailResult = await emailService.sendPasswordResetEmail(email, user.username, resetToken)

      if (!emailResult.success) {
        console.error('Password reset email sending failed:', emailResult.error)
        return res.status(500).json({
          success: false,
          message: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.'
        })
      }

      res.json({
        success: true,
        message: 'Şifre sıfırlama linki e-posta adresinize gönderildi'
      })

    } catch (error) {
      console.error('Forgot password error:', error)
      res.status(500).json({
        success: false,
        message: 'Sunucu hatası'
      })
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Token ve yeni şifre gereklidir'
        })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Şifre en az 6 karakter olmalıdır'
        })
      }

      const resetData = databaseService.findResetToken(token)

      if (!resetData) {
        return res.status(400).json({
          success: false,
          message: 'Geçersiz veya süresi dolmuş reset linki'
        })
      }

      if (new Date() > resetData.expiresAt) {
        databaseService.deleteResetToken(token)
        return res.status(400).json({
          success: false,
          message: 'Reset linkinin süresi dolmuş'
        })
      }

      const user = databaseService.findUserById(resetData.userId)

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        })
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      user.password = hashedPassword
      databaseService.updateUser(user)

      // Remove reset token
      databaseService.deleteResetToken(token)

      res.json({
        success: true,
        message: 'Şifreniz başarıyla güncellendi'
      })

    } catch (error) {
      console.error('Reset password error:', error)
      res.status(500).json({
        success: false,
        message: 'Sunucu hatası'
      })
    }
  }

  // Delete account
  async deleteAccount(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'E-posta ve şifre gereklidir'
        })
      }

      // Find user in database
      const user = databaseService.findUserByEmail(email)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        })
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Geçersiz şifre'
        })
      }

      // Send deletion confirmation email
      await emailService.sendAccountDeletionEmail(user.email, user.username)

      // Delete user from database
      databaseService.deleteUser(user.id)

      // Clean up related tokens (database will handle this with CASCADE)
      // But we can also manually clean up for safety
      databaseService.cleanupExpiredTokens()

      res.json({
        success: true,
        message: 'Hesabınız başarıyla silindi'
      })

    } catch (error) {
      console.error('Account deletion error:', error)
      res.status(500).json({
        success: false,
        message: 'Sunucu hatası'
      })
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.userId
      const user = databaseService.findUserById(userId)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        })
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          coins: user.coins,
          highScore: user.highScore,
          totalScore: user.totalScore,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      })

    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({
        success: false,
        message: 'Sunucu hatası'
      })
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body
      const userId = req.user.userId

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Mevcut şifre ve yeni şifre gereklidir'
        })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Yeni şifre en az 6 karakter olmalıdır'
        })
      }

      // Find user in database
      const user = databaseService.findUserById(userId)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        })
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)

      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Mevcut şifre yanlış'
        })
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10)

      // Update password
      user.password = hashedNewPassword
      databaseService.updateUser(user)

      res.json({
        success: true,
        message: 'Şifreniz başarıyla değiştirildi'
      })

    } catch (error) {
      console.error('Change password error:', error)
      res.status(500).json({
        success: false,
        message: 'Sunucu hatası'
      })
    }
  }
}

export default new AuthController()
