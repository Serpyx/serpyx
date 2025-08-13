import databaseService from './services/databaseService.js'

console.log('📊 Database Kontrolü:')
console.log('==================')

try {
  const users = databaseService.db.prepare('SELECT email, username, isVerified, createdAt FROM users').all()
  console.log('👥 Kullanıcılar:')
  console.table(users)
  
  const tokens = databaseService.db.prepare('SELECT email, expiresAt FROM verification_tokens').all()
  console.log('\n🔑 Doğrulama Tokenları:')
  console.table(tokens)
  
  // Clear all data if needed
  console.log('\n🧹 Tüm test verilerini temizlemek için:')
  console.log('DELETE FROM users; DELETE FROM verification_tokens;')
  
} catch (error) {
  console.error('❌ Database kontrol hatası:', error)
}

process.exit(0)

