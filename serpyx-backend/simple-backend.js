const http = require('http');

const server = http.createServer((req, res) => {
  console.log('✅ Request received:', req.url);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API routes
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: true,
      message: 'Serpyx Backend çalışıyor! 🚀',
      timestamp: new Date().toISOString()
    }));
  }
  else if (req.url === '/api/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { email, password } = JSON.parse(body);
      console.log('Yeni kayıt:', email);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Kayıt başarılı!',
        email: email
      }));
    });
  }
  else if (req.url === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { email, password } = JSON.parse(body);
      console.log('Giriş denemesi:', email);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Giriş başarılı!',
        email: email
      }));
    });
  }
  else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Serpyx Backend API çalışıyor! 🚀',
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    }));
  }
});

const PORT = 3000;
const HOST = '127.0.0.1';

console.log('🚀 Starting Serpyx Backend...');

server.listen(PORT, HOST, () => {
  console.log(`✅ Serpyx Backend running on http://${HOST}:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Register: http://localhost:${PORT}/api/register`);
  console.log(`🔗 Login: http://localhost:${PORT}/api/login`);
  console.log(`🔧 Windows binding: IPv4`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
});





