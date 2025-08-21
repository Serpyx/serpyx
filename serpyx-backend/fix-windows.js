const http = require('http');

const server = http.createServer((req, res) => {
  console.log('✅ Request received:', req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'Windows Node.js server çalışıyor! 🚀',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  }));
});

const PORT = 3000;
const HOST = '127.0.0.1'; // Sadece IPv4 - Windows için kritik!

console.log('🚀 Starting Windows-compatible server...');

server.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}`);
  console.log(`🌐 Test: http://127.0.0.1:${PORT}`);
  console.log(`🔧 Windows IPv4 binding: ${HOST}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  console.error('🔧 Error code:', err.code);
  
  if (err.code === 'EADDRINUSE') {
    console.error('💡 Port already in use! Try different port.');
  }
});





