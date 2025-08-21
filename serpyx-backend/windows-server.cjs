console.log('Windows Server starting...');

const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify({ message: 'Server is running!' }));
});

// Windows'ta localhost yerine 0.0.0.0 kullan
server.listen(8080, '0.0.0.0', () => {
  console.log('Windows Server running at http://localhost:8080/');
  console.log('Press Ctrl+C to stop');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
