import http from 'http';

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'Test server çalışıyor! 🚀',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  }));
});

const PORT = 8080;
const HOST = '0.0.0.0'; // Tüm IP'lerden erişim

console.log('Starting server...');

server.listen(PORT, HOST, () => {
  console.log(`🚀 Test server running on http://${HOST}:${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}`);
  console.log(`🌐 Test: http://127.0.0.1:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  console.error('Error code:', err.code);
  console.error('Error message:', err.message);
});

