import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 5000

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite')
const db = new Database(dbPath)

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    isVerified BOOLEAN DEFAULT 0,
    coins INTEGER DEFAULT 0,
    highScore INTEGER DEFAULT 0,
    totalScore INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    lastLogin TEXT
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS verification_tokens (
    token TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    email TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
  )
`)

// Middleware
app.use(cors({ 
  origin: ['http://localhost:3000', 'https://serpyx.com', 'https://www.serpyx.com'], 
  credentials: true 
}))
app.use(express.json())

// Mock email service (works without SMTP)
const mockEmailService = {
  sendVerificationEmail: async (email, username, token) => {
    console.log('📧 MOCK EMAIL SENT:')
    console.log(`To: ${email}`)
    console.log(`Subject: Verify your email`)
    console.log(`Token: ${token}`)
    console.log(`Link: http://localhost:3000/verify-email?token=${token}`)
    return { success: true, messageId: 'mock-' + Date.now() }
  }
}

// Database helpers
const findUserByEmail = (email) => {
  try {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

const findUserByUsername = (username) => {
  try {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

const createUserWithToken = (user, verificationToken, expiresAt) => {
  const transaction = db.transaction((user, token, expires) => {
    // Check duplicates
    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(user.email)
    const existingUsername = db.prepare('SELECT id FROM users WHERE username = ?').get(user.username)
    
    if (existingEmail || existingUsername) {
      throw new Error('Bu e-posta adresi veya kullanıcı adı zaten kullanılıyor')
    }

    // Create user
    const userStmt = db.prepare(`
      INSERT INTO users (id, username, email, password, isVerified, coins, highScore, totalScore, createdAt, lastLogin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const userResult = userStmt.run(
      user.id, user.username, user.email, user.password,
      user.isVerified ? 1 : 0, user.coins, user.highScore,
      user.totalScore, user.createdAt, user.lastLogin
    )

    // Create verification token
    const tokenStmt = db.prepare(`
      INSERT INTO verification_tokens (token, userId, email, expiresAt)
      VALUES (?, ?, ?, ?)
    `)
    
    const tokenResult = tokenStmt.run(token, user.id, user.email, expires)

    return { userResult, tokenResult }
  })

  return transaction(user, verificationToken, expiresAt)
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serpyx API is running',
    timestamp: new Date().toISOString()
  })
})

// Register
app.post('/api/register', async (req, res) => {
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user data
    const userId = uuidv4()
    const verificationToken = uuidv4()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    
    const user = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      coins: 0,
      highScore: 0,
      totalScore: 0,
      createdAt: new Date().toISOString(),
      lastLogin: null
    }

    // Create user and token atomically
    try {
      createUserWithToken(user, verificationToken, expiresAt)
      console.log('✅ User created successfully:', email)
    } catch (dbError) {
      console.error('❌ Database error:', dbError.message)
      
      if (dbError.message.includes('kullanılıyor') || dbError.message.includes('UNIQUE constraint')) {
        return res.status(400).json({
          success: false,
          message: 'Bu e-posta adresi veya kullanıcı adı zaten kullanılıyor'
        })
      }
      
      return res.status(500).json({
        success: false,
        message: 'Veritabanı hatası. Lütfen daha sonra tekrar deneyin.'
      })
    }

    // ✅ HEMEN RESPONSE DÖNDÜR - Mail gönderimini bekletme!
    res.status(201).json({
      success: true,
      message: 'Hesap başarıyla oluşturuldu. E-posta doğrulaması console\'da görüntüleniyor.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified
      }
    })

    // 🔥 ASYNC: Mail gönderimini arka planda yap (response'dan sonra)
    mockEmailService.sendVerificationEmail(email, username, verificationToken)
      .then(emailResult => {
        if (emailResult.success) {
          console.log('✅ Verification email sent successfully to:', email)
        } else {
          console.error('❌ Email sending failed (non-blocking):', emailResult.error)
          // Mail başarısız olsa bile kullanıcı kayıtlı kalır
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
})

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'E-posta ve şifre gereklidir'
      })
    }

    // Find user
    const user = findUserByEmail(email)

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

    // For demo purposes, allow login without email verification
    // In production, uncomment this:
    /*
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Lütfen önce e-posta adresinizi doğrulayın'
      })
    }
    */

    // Update last login
    db.prepare('UPDATE users SET lastLogin = ? WHERE id = ?')
      .run(new Date().toISOString(), user.id)

    res.json({
      success: true,
      message: 'Giriş başarılı',
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
})

// Email verification
app.get('/api/verify-email', (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Doğrulama token\'ı gereklidir'
      })
    }

    const verificationData = db.prepare('SELECT * FROM verification_tokens WHERE token = ?').get(token)

    if (!verificationData) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş doğrulama linki'
      })
    }

    if (new Date() > new Date(verificationData.expiresAt)) {
      db.prepare('DELETE FROM verification_tokens WHERE token = ?').run(token)
      return res.status(400).json({
        success: false,
        message: 'Doğrulama linkinin süresi dolmuş'
      })
    }

    // Mark user as verified
    db.prepare('UPDATE users SET isVerified = 1 WHERE id = ?').run(verificationData.userId)
    db.prepare('DELETE FROM verification_tokens WHERE token = ?').run(token)

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
})

// Clear test data
app.post('/api/clear-test-data', (req, res) => {
  try {
    db.prepare('DELETE FROM verification_tokens').run()
    db.prepare('DELETE FROM users').run()
    
    res.json({
      success: true,
      message: 'Test verileri temizlendi'
    })
  } catch (error) {
    console.error('Clear data error:', error)
    res.status(500).json({
      success: false,
      message: 'Temizleme hatası'
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Serpyx Server running on port ${PORT}`)
  console.log(`📧 Email service: MOCK MODE (console output)`)
  console.log(`🔗 Client URL: http://localhost:3000`)
  console.log(`💾 Database: SQLite (${dbPath})`)
  console.log(`✅ All systems ready!`)
})

export default app

