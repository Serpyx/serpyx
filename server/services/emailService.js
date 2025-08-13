import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

class EmailService {
  constructor() {
    // Check if we have real email credentials
    const hasRealCredentials = process.env.SMTP_USER && 
                              process.env.SMTP_PASS && 
                              process.env.SMTP_USER !== 'your-email@gmail.com' &&
                              process.env.SMTP_PASS !== 'your-app-password'
    
    if (hasRealCredentials) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        // ⚡ TIMEOUT VE CONNECTION YÖNETİMİ
        connectionTimeout: 10000, // 10 saniye connection timeout
        greetingTimeout: 5000,    // 5 saniye greeting timeout
        socketTimeout: 15000,     // 15 saniye socket timeout
        // Pool yönetimi
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        // Retry yönetimi
        retryDelay: 3000          // 3 saniye retry delay
      })
      console.log('📧 Email service configured with real credentials')
    } else {
      console.log('📧 Email service running in TEST MODE - emails will be logged to console')
      console.log('💡 To send real emails, configure EMAIL_USER and EMAIL_PASS in .env file')
      this.transporter = null
    }
    
    // Mail gönderim timeout süresi (milisaniye)
    this.EMAIL_TIMEOUT = parseInt(process.env.EMAIL_TIMEOUT) || 30000 // 30 saniye default
  }

  // Test email connection
  async testConnection() {
    if (!this.transporter) {
      console.log('✅ Email service is ready (TEST MODE)')
      return true
    }
    
    try {
      await this.transporter.verify()
      console.log('✅ Email service is ready')
      return true
    } catch (error) {
      console.error('❌ Email service error:', error.message)
      return false
    }
  }

  // Helper method to log email content in test mode
  logEmailContent(subject, to, htmlContent) {
    console.log('\n📧 EMAIL SENT (TEST MODE)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📨 To: ${to}`)
    console.log(`📋 Subject: ${subject}`)
    console.log('📄 Content:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(htmlContent)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  }

  // 🔥 TIMEOUT YÖNETİMİ - Mail gönderimini timeout ile sar
  async sendEmailWithTimeout(mailOptions, timeoutMs = this.EMAIL_TIMEOUT) {
    return new Promise((resolve, reject) => {
      // Timeout timer
      const timeout = setTimeout(() => {
        reject(new Error(`Email timeout: ${timeoutMs}ms süresi aşıldı`))
      }, timeoutMs)

      // Mail gönderimi
      this.transporter.sendMail(mailOptions)
        .then(result => {
          clearTimeout(timeout)
          resolve(result)
        })
        .catch(error => {
          clearTimeout(timeout)
          reject(error)
        })
    })
  }

  // 🔄 RETRY MEKANİZMASI - Mail gönderimini retry ile sar
  async sendEmailWithRetry(mailOptions, maxRetries = 3, retryDelay = 3000) {
    let lastError = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📤 Email gönderimi denemesi ${attempt}/${maxRetries} - ${mailOptions.to}`)
        
        const result = await this.sendEmailWithTimeout(mailOptions)
        console.log(`✅ Email başarıyla gönderildi (deneme ${attempt}):`, mailOptions.to)
        return { success: true, messageId: result.messageId, attempt }
        
      } catch (error) {
        lastError = error
        console.error(`❌ Email gönderim hatası (deneme ${attempt}/${maxRetries}):`, error.message)
        
        // Son deneme değilse bekle
        if (attempt < maxRetries) {
          console.log(`⏳ ${retryDelay}ms bekleyip tekrar denenecek...`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }
    }
    
    // Tüm denemeler başarısız
    console.error(`💥 Email gönderimi ${maxRetries} denemede başarısız oldu:`, lastError.message)
    return { 
      success: false, 
      error: lastError.message,
      attempts: maxRetries,
      finalError: lastError
    }
  }

  // Send email verification
  async sendVerificationEmail(email, username, verificationToken) {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Serpyx <noreply@serpyx.com>',
      to: email,
      subject: 'Serpyx - E-posta Adresinizi Doğrulayın',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Serpyx - E-posta Doğrulama</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">🐍 Serpyx</h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Oyna, Kazan, Geleceği İnşa Et</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">E-posta Adresinizi Doğrulayın</h2>
                      
                      <p style="color: #4b5563; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
                        Merhaba <strong style="color: #1f2937;">${username}</strong>,
                      </p>
                      
                      <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6;">
                        Serpyx hesabınızı oluşturduğunuz için teşekkürler! Hesabınızı aktifleştirmek ve oyuna başlamak için aşağıdaki butona tıklayın.
                      </p>
                      
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                        <tr>
                          <td align="center">
                            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); transition: all 0.3s ease;">
                              E-posta Adresimi Doğrula
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 32px 0;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">
                          <strong>Güvenlik Notu:</strong> Bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın. Bu bağlantı 24 saat süreyle geçerlidir.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                        © 2024 Serpyx. Tüm hakları saklıdır.
                      </p>
                      <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
                        Bu e-posta Serpyx hesabınızla ilişkili olarak gönderilmiştir.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    }

    if (!this.transporter) {
      this.logEmailContent(mailOptions.subject, mailOptions.to, mailOptions.html)
      console.log('✅ Verification email logged to console (TEST MODE)')
      return { success: true, messageId: 'test-mode-' + Date.now() }
    }

    try {
      // 🔥 RETRY VE TIMEOUT İLE GÜVENLİ GÖNDERIM
      const result = await this.sendEmailWithRetry(mailOptions)
      return result
    } catch (error) {
      console.error('❌ Critical error in verification email service:', error)
      return { success: false, error: error.message }
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, username, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Serpyx <noreply@serpyx.com>',
      to: email,
      subject: 'Serpyx - Şifre Sıfırlama',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Serpyx - Şifre Sıfırlama</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">🐍 Serpyx</h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Oyna, Kazan, Geleceği İnşa Et</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">Şifre Sıfırlama</h2>
                      
                      <p style="color: #4b5563; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
                        Merhaba <strong style="color: #1f2937;">${username}</strong>,
                      </p>
                      
                      <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6;">
                        Şifrenizi sıfırlama talebinde bulundunuz. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.
                      </p>
                      
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                        <tr>
                          <td align="center">
                            <a href="${resetUrl}" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); transition: all 0.3s ease;">
                              Şifremi Sıfırla
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 32px 0;">
                        <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
                          <strong>Önemli:</strong> Bu bağlantı 1 saat süreyle geçerlidir. Bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                        © 2024 Serpyx. Tüm hakları saklıdır.
                      </p>
                      <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
                        Bu e-posta Serpyx hesabınızla ilişkili olarak gönderilmiştir.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    }

    if (!this.transporter) {
      this.logEmailContent(mailOptions.subject, mailOptions.to, mailOptions.html)
      console.log('✅ Password reset email logged to console (TEST MODE)')
      return { success: true, messageId: 'test-mode-' + Date.now() }
    }

    try {
      // 🔥 RETRY VE TIMEOUT İLE GÜVENLİ GÖNDERIM
      const result = await this.sendEmailWithRetry(mailOptions)
      return result
    } catch (error) {
      console.error('❌ Critical error in password reset email service:', error)
      return { success: false, error: error.message }
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email, username) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Serpyx <noreply@serpyx.com>',
      to: email,
      subject: 'Serpyx - Hoş Geldiniz!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Serpyx - Hoş Geldiniz!</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">🐍 Serpyx</h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Oyna, Kazan, Geleceği İnşa Et</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">Hoş Geldiniz! 🎉</h2>
                      
                      <p style="color: #4b5563; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
                        Merhaba <strong style="color: #1f2937;">${username}</strong>,
                      </p>
                      
                      <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6;">
                        Serpyx ailesine hoş geldiniz! Artık oyunu oynayabilir, puanlar kazanabilir ve diğer oyuncularla yarışabilirsiniz.
                      </p>
                      
                      <div style="background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 12px; padding: 24px; margin: 32px 0;">
                        <h3 style="color: #166534; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">🎮 Başlamak İçin:</h3>
                        <ul style="color: #166534; padding-left: 20px; margin: 0; line-height: 1.8;">
                          <li>Oyunu oynayın ve yüksek skorlar elde edin</li>
                          <li>Günlük görevleri tamamlayın</li>
                          <li>Başarıları açın</li>
                          <li>Arkadaşlarınızla yarışın</li>
                        </ul>
                      </div>
                      
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                        <tr>
                          <td align="center">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); transition: all 0.3s ease;">
                              Oyunu Başlat
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                        © 2024 Serpyx. Tüm hakları saklıdır.
                      </p>
                      <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
                        Bu e-posta Serpyx hesabınızla ilişkili olarak gönderilmiştir.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    }

    if (!this.transporter) {
      this.logEmailContent(mailOptions.subject, mailOptions.to, mailOptions.html)
      console.log('✅ Welcome email logged to console (TEST MODE)')
      return { success: true, messageId: 'test-mode-' + Date.now() }
    }

    try {
      const result = await this.transporter.sendMail(mailOptions)
      console.log('✅ Welcome email sent to:', email)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('❌ Error sending welcome email:', error)
      return { success: false, error: error.message }
    }
  }

  // Send security alert email
  async sendSecurityAlertEmail(email, username, loginInfo) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Serpyx <noreply@serpyx.com>',
      to: email,
      subject: 'Serpyx - Güvenlik Uyarısı',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Serpyx - Güvenlik Uyarısı</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">🐍 Serpyx</h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Güvenlik Uyarısı</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">🚨 Şüpheli Giriş Tespit Edildi</h2>
                      
                      <p style="color: #4b5563; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
                        Merhaba <strong style="color: #1f2937;">${username}</strong>,
                      </p>
                      
                      <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6;">
                        Hesabınıza yeni bir cihazdan giriş yapıldığını tespit ettik. Bu girişi siz yapmadıysanız, lütfen hemen şifrenizi değiştirin.
                      </p>
                      
                      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px; margin: 32px 0;">
                        <h3 style="color: #dc2626; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Giriş Bilgileri:</h3>
                        <ul style="color: #dc2626; padding-left: 20px; margin: 0; line-height: 1.8;">
                          <li><strong>Tarih:</strong> ${loginInfo.date}</li>
                          <li><strong>IP Adresi:</strong> ${loginInfo.ip}</li>
                          <li><strong>Cihaz:</strong> ${loginInfo.device}</li>
                          <li><strong>Konum:</strong> ${loginInfo.location}</li>
                        </ul>
                      </div>
                      
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                        <tr>
                          <td align="center">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/forgot-password" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); transition: all 0.3s ease;">
                              Şifremi Değiştir
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                        © 2024 Serpyx. Tüm hakları saklıdır.
                      </p>
                      <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
                        Bu e-posta Serpyx hesabınızla ilişkili olarak gönderilmiştir.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    }

    if (!this.transporter) {
      this.logEmailContent(mailOptions.subject, mailOptions.to, mailOptions.html)
      console.log('✅ Security alert email logged to console (TEST MODE)')
      return { success: true, messageId: 'test-mode-' + Date.now() }
    }

    try {
      const result = await this.transporter.sendMail(mailOptions)
      console.log('✅ Security alert email sent to:', email)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('❌ Error sending security alert email:', error)
      return { success: false, error: error.message }
    }
  }

  // Send account deletion confirmation
  async sendAccountDeletionEmail(email, username) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Serpyx <noreply@serpyx.com>',
      to: email,
      subject: 'Serpyx - Hesap Silme Onayı',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Serpyx - Hesap Silme Onayı</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">🐍 Serpyx</h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Hesap Silme Onayı</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">⚠️ Hesabınız Silindi</h2>
                      
                      <p style="color: #4b5563; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
                        Merhaba <strong style="color: #1f2937;">${username}</strong>,
                      </p>
                      
                      <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6;">
                        Hesap silme talebiniz onaylandı ve hesabınız kalıcı olarak silindi. Bu işlem geri alınamaz.
                      </p>
                      
                      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 32px 0;">
                        <h3 style="color: #92400e; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Silinen Veriler:</h3>
                        <ul style="color: #92400e; padding-left: 20px; margin: 0; line-height: 1.8;">
                          <li>Kullanıcı profili</li>
                          <li>Oyun istatistikleri</li>
                          <li>Coin ve başarımlar</li>
                          <li>Kişisel veriler</li>
                        </ul>
                      </div>
                      
                      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 32px 0;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">
                          <strong>Not:</strong> Yeni bir hesap oluşturmak isterseniz, tekrar kayıt olabilirsiniz. Tüm verileriniz kalıcı olarak silinmiştir.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                        © 2024 Serpyx. Tüm hakları saklıdır.
                      </p>
                      <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
                        Bu e-posta Serpyx hesabınızla ilişkili olarak gönderilmiştir.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    }

    if (!this.transporter) {
      this.logEmailContent(mailOptions.subject, mailOptions.to, mailOptions.html)
      console.log('✅ Account deletion email logged to console (TEST MODE)')
      return { success: true, messageId: 'test-mode-' + Date.now() }
    }

    try {
      const result = await this.transporter.sendMail(mailOptions)
      console.log('✅ Account deletion email sent to:', email)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('❌ Error sending account deletion email:', error)
      return { success: false, error: error.message }
    }
  }
}

export default new EmailService()
