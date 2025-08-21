import nodemailer from 'nodemailer';

const required = (k) => {
  if (!process.env[k]) {
    throw new Error(`[EMAIL] Missing env: ${k}`);
  }
  return process.env[k];
};

const isMock = String(process.env.EMAIL_MOCK || 'false').toLowerCase() === 'true';

let transporter = null;

function initTransporter() {
  if (transporter) return transporter;
  
  if (!isMock) {
    const host = required('SMTP_HOST');
    const port = Number(required('SMTP_PORT'));
    const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: required('SMTP_USER'),
        pass: required('SMTP_PASS'),
      },
    });

    console.log(`[EMAIL] REAL SMTP → ${host}:${port} secure=${secure}`);
  } else {
    console.warn('[EMAIL] MOCK MODE → E-posta gönderilmiyor!');
    transporter = {
      sendMail: async (opts) => {
        console.log('[EMAIL][MOCK] To:', opts.to, 'Subject:', opts.subject, 'Text:', opts.text);
        return { messageId: 'MOCK-' + Date.now() };
      }
    };
  }
  
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  if (!to) throw new Error('[EMAIL] "to" gerekli');
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;

  const currentTransporter = initTransporter();
  const info = await currentTransporter.sendMail({ from, to, subject, text, html });
  console.log('[EMAIL] sent messageId=', info.messageId);
  return info;
}

export async function sendVerificationEmail(email, token, username) {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
      <title>Serpyx - Email Doğrulama</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
        </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🐍 Serpyx</h1>
          <p>Email Adresinizi Doğrulayın</p>
                      </div>
        <div class="content">
          <h2>Merhaba ${username}!</h2>
          <p>Serpyx hesabınızı doğrulamak için aşağıdaki butona tıklayın:</p>
          <a href="${verificationUrl}" class="button">Email Adresimi Doğrula</a>
          <p>Veya bu linki tarayıcınıza kopyalayın:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>Bu link 24 saat geçerlidir.</p>
          <p>Eğer bu email'i siz talep etmediyseniz, lütfen dikkate almayın.</p>
                      </div>
        <div class="footer">
          <p>© 2024 Serpyx. Tüm hakları saklıdır.</p>
                      </div>
                      </div>
        </body>
        </html>
  `;

  return await sendMail({
    to: email,
    subject: 'Serpyx - Email Adresinizi Doğrulayın',
    html: htmlTemplate,
  });
}

export async function testConnection() {
  try {
    await transporter.verify();
    return true;
    } catch (error) {
    console.error('[EMAIL] Connection test failed:', error);
    return false;
  }
}

// Default export for backward compatibility
export default {
  sendMail,
  sendVerificationEmail,
  testConnection
};

