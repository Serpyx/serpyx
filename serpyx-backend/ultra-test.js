const http = require('http');

const server = http.createServer((req, res) => {
  console.log('🔥 Request received:', req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'ULTRA TEST SERVER ÇALIŞIYOR! 🚀',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  }));
});

const PORT = 9999; // Tamamen farklı port!
const HOST = '127.0.0.1';

console.log('🔥 Starting ULTRA TEST server...');

server.listen(PORT, HOST, () => {
  console.log(`🔥 ULTRA TEST server running on http://${HOST}:${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}`);
  console.log(`🌐 Test: http://127.0.0.1:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  console.error('🔧 Error code:', err.code);
});





