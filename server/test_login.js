import fetch from 'node-fetch'

console.log('🔐 Login Sistemi Test Ediliyor...')
console.log('=================================')

const baseUrl = 'http://localhost:5000'

async function testLogin() {
  try {
    // Test 1: Geçersiz email ile login
    console.log('\n❌ Test 1: Saçma email ile login')
    const response1 = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sacmasapan@mail.com',
        password: 'herhangibirsey'
      })
    })
    
    const data1 = await response1.json()
    console.log(`Status: ${response1.status}`)
    console.log(`Response:`, data1)
    console.log(`✅ Beklenen: 401 Unauthorized, Alınan: ${response1.status}`)
    
    // Test 2: Boş bilgiler ile login
    console.log('\n❌ Test 2: Boş bilgiler ile login')
    const response2 = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: '',
        password: ''
      })
    })
    
    const data2 = await response2.json()
    console.log(`Status: ${response2.status}`)
    console.log(`Response:`, data2)
    console.log(`✅ Beklenen: 400 Bad Request, Alınan: ${response2.status}`)
    
    // Test 3: Geçerli ama doğrulanmamış kullanıcı ile login
    console.log('\n❌ Test 3: Doğrulanmamış kullanıcı ile login')
    
    // Önce doğrulanmamış bir kullanıcı oluşturalım
    const registerResponse = await fetch(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'unverifieduser',
        email: 'unverified@test.com',
        password: 'Test123!'
      })
    })
    
    if (registerResponse.status === 201) {
      console.log('✅ Doğrulanmamış kullanıcı oluşturuldu')
      
      // Şimdi bu kullanıcı ile login deneyelim
      const response3 = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'unverified@test.com',
          password: 'Test123!'
        })
      })
      
      const data3 = await response3.json()
      console.log(`Status: ${response3.status}`)
      console.log(`Response:`, data3)
      console.log(`✅ Beklenen: 401 (email doğrulanmadı), Alınan: ${response3.status}`)
    }
    
  } catch (error) {
    console.error('❌ Test hatası:', error.message)
  }
}

testLogin()








