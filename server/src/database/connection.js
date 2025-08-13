import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db = null

export const connectDB = async () => {
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