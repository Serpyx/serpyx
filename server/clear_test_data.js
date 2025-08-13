import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Database İncelemesi ve Temizleme')
console.log('===================================')

try {
  const dbPath = path.join(__dirname, 'database.sqlite')
  console.log('📍 Database path:', dbPath)
  
  const db = new Database(dbPath)
  
  // Mevcut kullanıcıları listele
  const users = db.prepare('SELECT email, username, isVerified, createdAt FROM users').all()
  console.log('\n👥 Mevcut Kullanıcılar:')
  if (users.length === 0) {
    console.log('   Hiç kullanıcı yok')
  } else {
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. Email: ${user.email}, Username: ${user.username}, Verified: ${user.isVerified}`)
    })
  }
  
  // Mevcut tokenları listele
  const tokens = db.prepare('SELECT email, expiresAt FROM verification_tokens').all()
  console.log('\n🔑 Mevcut Doğrulama Tokenları:')
  if (tokens.length === 0) {
    console.log('   Hiç token yok')
  } else {
    tokens.forEach((token, index) => {
      console.log(`   ${index + 1}. Email: ${token.email}, Expires: ${token.expiresAt}`)
    })
  }
  
  // Test verilerini temizle
  if (users.length > 0 || tokens.length > 0) {
    console.log('\n🧹 Test verilerini temizliyorum...')
    db.prepare('DELETE FROM verification_tokens').run()
    db.prepare('DELETE FROM users').run()
    console.log('✅ Tüm test verileri temizlendi!')
  }
  
  db.close()
  
} catch (error) {
  console.error('❌ Hata:', error.message)
}

console.log('\n🚀 Artık yeni kayıt deneyebilirsiniz!')

