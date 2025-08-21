import http from 'http';

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'Windows server çalışıyor! 🚀',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  }));
});

// Farklı port ve binding kombinasyonları dene
const configs = [
  { port: 3000, host: 'localhost' },
  { port: 3000, host: '127.0.0.1' },
  { port: 3000, host: '0.0.0.0' },
  { port: 5000, host: 'localhost' },
  { port: 5000, host: '127.0.0.1' },
  { port: 5000, host: '0.0.0.0' },
  { port: 8080, host: 'localhost' },
  { port: 8080, host: '127.0.0.1' },
  { port: 8080, host: '0.0.0.0' }
];

function tryStartServer(index = 0) {
  if (index >= configs.length) {
    console.error('❌ Hiçbir port/binding kombinasyonu çalışmadı!');
    return;
  }

  const config = configs[index];
  console.log(`🔄 Deneniyor: ${config.host}:${config.port}`);

  server.listen(config.port, config.host, () => {
    console.log(`✅ Server başarıyla başladı: http://${config.host}:${config.port}`);
    console.log(`🔗 Test: http://localhost:${config.port}`);
    console.log(`🌐 Test: http://127.0.0.1:${config.port}`);
  });

  server.on('error', (err) => {
    console.log(`❌ ${config.host}:${config.port} - ${err.code}`);
    server.close();
    setTimeout(() => tryStartServer(index + 1), 100);
  });
}

console.log('🚀 Windows server başlatılıyor...');
tryStartServer();
