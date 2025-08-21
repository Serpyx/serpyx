import { Pool } from 'pg'
import { logger } from '../utils/logger.js'

class DatabaseConnection {
  constructor() {
    this.pool = null
    this.isConnected = false
  }

  async connect() {
    try {
      this.pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'serpyx',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })

      // Test connection
      const client = await this.pool.connect()
      await client.query('SELECT NOW()')
      client.release()

      this.isConnected = true
      logger.info('✅ PostgreSQL database connected successfully')
      
      // Initialize tables
      await this.initializeTables()
      
    } catch (error) {
      logger.error('❌ Database connection failed:', error.message)
      throw error
    }
  }

  async initializeTables() {
    try {
      const client = await this.pool.connect()
      
      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          is_verified BOOLEAN DEFAULT FALSE,
          coins INTEGER DEFAULT 0,
          spx_balance INTEGER DEFAULT 0,
          high_score INTEGER DEFAULT 0,
          total_score INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP,
          profile_image VARCHAR(255),
          bio TEXT,
          preferences JSONB DEFAULT '{}'
        )
      `)

      // Verification tokens table
      await client.query(`
        CREATE TABLE IF NOT EXISTS verification_tokens (
          token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          email VARCHAR(255) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Password reset tokens table
      await client.query(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          email VARCHAR(255) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Achievements table
      await client.query(`
        CREATE TABLE IF NOT EXISTS achievements (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          achievement_type VARCHAR(100) NOT NULL,
          achievement_name VARCHAR(255) NOT NULL,
          description TEXT,
          points INTEGER DEFAULT 0,
          earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Daily tasks table
      await client.query(`
        CREATE TABLE IF NOT EXISTS daily_tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          task_type VARCHAR(100) NOT NULL,
          task_name VARCHAR(255) NOT NULL,
          description TEXT,
          progress INTEGER DEFAULT 0,
          target INTEGER DEFAULT 1,
          completed BOOLEAN DEFAULT FALSE,
          completed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Daily bonuses table
      await client.query(`
        CREATE TABLE IF NOT EXISTS daily_bonuses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          bonus_amount INTEGER NOT NULL,
          claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          day_number INTEGER NOT NULL
        )
      `)

      // Game sessions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS game_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          score INTEGER NOT NULL,
          coins_earned INTEGER DEFAULT 0,
          duration_seconds INTEGER,
          game_mode VARCHAR(50) DEFAULT 'classic',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // NFT ownership table
      await client.query(`
        CREATE TABLE IF NOT EXISTS nft_ownership (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          nft_id VARCHAR(100) NOT NULL,
          nft_name VARCHAR(255) NOT NULL,
          nft_type VARCHAR(50) NOT NULL,
          rarity VARCHAR(50) NOT NULL,
          purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          price_spx INTEGER NOT NULL
        )
      `)

      client.release()
      logger.info('✅ Database tables initialized successfully')
      
    } catch (error) {
      logger.error('❌ Database table initialization failed:', error.message)
      throw error
    }
  }

  async query(text, params) {
    if (!this.isConnected) {
      throw new Error('Database not connected')
    }
    
    try {
      const start = Date.now()
      const result = await this.pool.query(text, params)
      const duration = Date.now() - start
      
      logger.debug('Executed query', { text, duration, rows: result.rowCount })
      return result
    } catch (error) {
      logger.error('Database query error:', error.message)
      throw error
    }
  }

  async getClient() {
    if (!this.isConnected) {
      throw new Error('Database not connected')
    }
    return await this.pool.connect()
  }

  async close() {
    if (this.pool) {
      await this.pool.end()
      this.isConnected = false
      logger.info('Database connection closed')
    }
  }
}

const db = new DatabaseConnection()

export const connectDB = async () => {
  await db.connect()
}

export const closeDB = async () => {
  await db.close()
}

export default db
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          achievement_type VARCHAR(100) NOT NULL,
          achievement_name VARCHAR(255) NOT NULL,
          description TEXT,
          points INTEGER DEFAULT 0,
          earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Daily tasks table
      await client.query(`
        CREATE TABLE IF NOT EXISTS daily_tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          task_type VARCHAR(100) NOT NULL,
          task_name VARCHAR(255) NOT NULL,
          description TEXT,
          progress INTEGER DEFAULT 0,
          target INTEGER DEFAULT 1,
          completed BOOLEAN DEFAULT FALSE,
          completed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Daily bonuses table
      await client.query(`
        CREATE TABLE IF NOT EXISTS daily_bonuses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          bonus_amount INTEGER NOT NULL,
          claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          day_number INTEGER NOT NULL
        )
      `)

      // Game sessions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS game_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          score INTEGER NOT NULL,
          coins_earned INTEGER DEFAULT 0,
          duration_seconds INTEGER,
          game_mode VARCHAR(50) DEFAULT 'classic',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // NFT ownership table
      await client.query(`
        CREATE TABLE IF NOT EXISTS nft_ownership (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          nft_id VARCHAR(100) NOT NULL,
          nft_name VARCHAR(255) NOT NULL,
          nft_type VARCHAR(50) NOT NULL,
          rarity VARCHAR(50) NOT NULL,
          purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          price_spx INTEGER NOT NULL
        )
      `)

      client.release()
      logger.info('✅ Database tables initialized successfully')
      
    } catch (error) {
      logger.error('❌ Database table initialization failed:', error.message)
      throw error
    }
  }

  async query(text, params) {
    if (!this.isConnected) {
      throw new Error('Database not connected')
    }
    
    try {
      const start = Date.now()
      const result = await this.pool.query(text, params)
      const duration = Date.now() - start
      
      logger.debug('Executed query', { text, duration, rows: result.rowCount })
      return result
    } catch (error) {
      logger.error('Database query error:', error.message)
      throw error
    }
  }

  async getClient() {
    if (!this.isConnected) {
      throw new Error('Database not connected')
    }
    return await this.pool.connect()
  }

  async close() {
    if (this.pool) {
      await this.pool.end()
      this.isConnected = false
      logger.info('Database connection closed')
    }
  }
}

const db = new DatabaseConnection()

export const connectDB = async () => {
  await db.connect()
}

export const closeDB = async () => {
  await db.close()
}

export default db
  try {
    // SQLite veritabanı bağlantısı
    const dbPath = path.join(__dirname, '../../database.sqlite')
    db = new Database(dbPath)
    
    console.log('📊 SQLite veritabanı bağlantısı başarılı')
    
    // Tabloları oluştur
    createTables()
    
    return db
  } catch (error) {
    console.error('❌ Veritabanı bağlantı hatası:', error)
    throw error
  }
}

const createTables = () => {
  try {
    // Users tablosu
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

    // Verification tokens tablosu
    db.exec(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        token TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        email TEXT NOT NULL,
        expiresAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `)

    // Reset tokens tablosu
    db.exec(`
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
    throw error
  }
}

export const getDB = () => {
  if (!db) {
    throw new Error('Database not connected')
  }
  return db
}

export const closeDB = () => {
  if (db) {
    db.close()
    console.log('📊 Veritabanı bağlantısı kapatıldı')
  }
}