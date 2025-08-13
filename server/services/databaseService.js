import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class DatabaseService {
  constructor() {
    this.db = null
    this.init()
  }

  init() {
    try {
      // Veritabanı dosyasını server klasöründe oluştur
      const dbPath = path.join(__dirname, '..', 'database.sqlite')
      this.db = new Database(dbPath)
      
      console.log('📊 SQLite veritabanı bağlantısı başarılı')
      
      // Tabloları oluştur
      this.createTables()
      
    } catch (error) {
      console.error('❌ Veritabanı bağlantı hatası:', error)
    }
  }

  createTables() {
    try {
      // Users tablosu
      this.db.exec(`
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

      // Verification tokens tablosu
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS verification_tokens (
          token TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          email TEXT NOT NULL,
          expiresAt TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
        )
      `)

      // Reset tokens tablosu
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS reset_tokens (
          token TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          email TEXT NOT NULL,
          expiresAt TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
        )
      `)

      console.log('✅ Veritabanı tabloları oluşturuldu')
      
    } catch (error) {
      console.error('❌ Tablo oluşturma hatası:', error)
    }
  }

  // User işlemleri
  createUser(user) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO users (id, username, email, password, isVerified, coins, highScore, totalScore, createdAt, lastLogin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      return stmt.run(
        user.id,
        user.username,
        user.email,
        user.password,
        user.isVerified ? 1 : 0,
        user.coins,
        user.highScore,
        user.totalScore,
        user.createdAt,
        user.lastLogin
      )
    } catch (error) {
      console.error('❌ Database createUser error:', error)
      throw new Error(`Kullanıcı oluşturma hatası: ${error.message}`)
    }
  }

  findUserByEmail(email) {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?')
      return stmt.get(email)
    } catch (error) {
      console.error('❌ Database findUserByEmail error:', error)
      throw new Error(`Email ile kullanıcı arama hatası: ${error.message}`)
    }
  }

  findUserById(id) {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?')
      return stmt.get(id)
    } catch (error) {
      console.error('❌ Database findUserById error:', error)
      throw new Error(`ID ile kullanıcı arama hatası: ${error.message}`)
    }
  }

  findUserByUsername(username) {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?')
      return stmt.get(username)
    } catch (error) {
      console.error('❌ Database findUserByUsername error:', error)
      throw new Error(`Kullanıcı adı ile arama hatası: ${error.message}`)
    }
  }

  updateUser(user) {
    const stmt = this.db.prepare(`
      UPDATE users 
      SET username = ?, email = ?, password = ?, isVerified = ?, coins = ?, 
          highScore = ?, totalScore = ?, lastLogin = ?
      WHERE id = ?
    `)
    
    return stmt.run(
      user.username,
      user.email,
      user.password,
      user.isVerified ? 1 : 0,
      user.coins,
      user.highScore,
      user.totalScore,
      user.lastLogin,
      user.id
    )
  }

  deleteUser(id) {
    try {
      const stmt = this.db.prepare('DELETE FROM users WHERE id = ?')
      return stmt.run(id)
    } catch (error) {
      console.error('❌ Database deleteUser error:', error)
      throw new Error(`Kullanıcı silme hatası: ${error.message}`)
    }
  }

  // Transaction-based user registration
  createUserWithVerificationToken(user, verificationToken, expiresAt) {
    const transaction = this.db.transaction((user, token, expires) => {
      try {
        // Check for existing user first (within transaction)
        const existingEmail = this.db.prepare('SELECT id FROM users WHERE email = ?').get(user.email)
        const existingUsername = this.db.prepare('SELECT id FROM users WHERE username = ?').get(user.username)
        
        if (existingEmail || existingUsername) {
          throw new Error('Bu e-posta adresi veya kullanıcı adı zaten kullanılıyor')
        }

        // Create user
        const userStmt = this.db.prepare(`
          INSERT INTO users (id, username, email, password, isVerified, coins, highScore, totalScore, createdAt, lastLogin)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        
        const userResult = userStmt.run(
          user.id, user.username, user.email, user.password,
          user.isVerified ? 1 : 0, user.coins, user.highScore,
          user.totalScore, user.createdAt, user.lastLogin
        )

        // Create verification token
        const tokenStmt = this.db.prepare(`
          INSERT INTO verification_tokens (token, userId, email, expiresAt)
          VALUES (?, ?, ?, ?)
        `)
        
        const tokenResult = tokenStmt.run(token, user.id, user.email, expires)

        return { userResult, tokenResult }
      } catch (error) {
        console.error('❌ Transaction error in createUserWithVerificationToken:', error)
        throw error
      }
    })

    try {
      return transaction(user, verificationToken, expiresAt)
    } catch (error) {
      console.error('❌ Database transaction failed:', error)
      throw new Error(`Kullanıcı kayıt işlemi başarısız: ${error.message}`)
    }
  }

  // Token işlemleri
  createVerificationToken(token, userId, email, expiresAt) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO verification_tokens (token, userId, email, expiresAt)
        VALUES (?, ?, ?, ?)
      `)
      
      return stmt.run(token, userId, email, expiresAt)
    } catch (error) {
      console.error('❌ Database createVerificationToken error:', error)
      throw new Error(`Doğrulama token oluşturma hatası: ${error.message}`)
    }
  }

  findVerificationToken(token) {
    const stmt = this.db.prepare('SELECT * FROM verification_tokens WHERE token = ?')
    return stmt.get(token)
  }

  deleteVerificationToken(token) {
    try {
      const stmt = this.db.prepare('DELETE FROM verification_tokens WHERE token = ?')
      return stmt.run(token)
    } catch (error) {
      console.error('❌ Database deleteVerificationToken error:', error)
      throw new Error(`Doğrulama token silme hatası: ${error.message}`)
    }
  }

  createResetToken(token, userId, email, expiresAt) {
    const stmt = this.db.prepare(`
      INSERT INTO reset_tokens (token, userId, email, expiresAt)
      VALUES (?, ?, ?, ?)
    `)
    
    return stmt.run(token, userId, email, expiresAt)
  }

  findResetToken(token) {
    const stmt = this.db.prepare('SELECT * FROM reset_tokens WHERE token = ?')
    return stmt.get(token)
  }

  deleteResetToken(token) {
    const stmt = this.db.prepare('DELETE FROM reset_tokens WHERE token = ?')
    return stmt.run(token)
  }

  // Temizlik işlemleri
  cleanupExpiredTokens() {
    const now = new Date().toISOString()
    
    // Süresi dolmuş verification tokenları temizle
    const deleteExpiredVerification = this.db.prepare(`
      DELETE FROM verification_tokens WHERE expiresAt < ?
    `)
    deleteExpiredVerification.run(now)
    
    // Süresi dolmuş reset tokenları temizle
    const deleteExpiredReset = this.db.prepare(`
      DELETE FROM reset_tokens WHERE expiresAt < ?
    `)
    deleteExpiredReset.run(now)
  }

  // Veritabanını kapat
  close() {
    if (this.db) {
      this.db.close()
      console.log('📊 Veritabanı bağlantısı kapatıldı')
    }
  }
}

export default new DatabaseService()
