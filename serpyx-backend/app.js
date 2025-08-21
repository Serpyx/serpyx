const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serpyx Backend çalışıyor! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Register endpoint
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  console.log('Yeni kayıt:', email);
  
  res.json({
    success: true,
    message: 'Kayıt başarılı!',
    email: email
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Giriş denemesi:', email);
  
  res.json({
    success: true,
    message: 'Giriş başarılı!',
    email: email
  });
});

const PORT = process.env.PORT || 5000; // Production için port 5000
const HOST = '0.0.0.0'; // Tüm IP'lerden erişim için

app.listen(PORT, HOST, () => {
  console.log(`🚀 Serpyx Backend running on http://${HOST}:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🌐 Network access: http://127.0.0.1:${PORT}/api/health`);
  console.log(`🔧 Windows binding: Server listening on IPv4`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
});
