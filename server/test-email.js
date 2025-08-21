import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'serpyx0@gmail.com',
    pass: 'yiln rnds dabs axjw'
  }
});

const mailOptions = {
  from: 'serpyx0@gmail.com',
  to: 'test@test.com',
  subject: 'Test Email - Serpyx',
  html: `
    <h2>Test Email</h2>
    <p>Bu bir test email'idir.</p>
    <p>Gönderim zamanı: ${new Date().toISOString()}</p>
  `
};

console.log('📧 Sending test email...');

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Email sending failed:', error);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  }
});




















