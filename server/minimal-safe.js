import express from 'express';

const app = express();
const PORT = 3000;

// Basit endpoint
app.get('/', (req, res) => {
  res.send('Minimal Safe Server çalışıyor!');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint çalışıyor!' });
});

// Listen - 127.0.0.1 kullanarak
app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Minimal Safe Server port ${PORT} üzerinde çalışıyor.`);
  console.log(`🌐 Test: http://127.0.0.1:${PORT}/test`);
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = express();
const PORT = 3000;

// Basit endpoint
app.get('/', (req, res) => {
  res.send('Minimal Safe Server çalışıyor!');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint çalışıyor!' });
});

// Listen - 127.0.0.1 kullanarak
app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Minimal Safe Server port ${PORT} üzerinde çalışıyor.`);
  console.log(`🌐 Test: http://127.0.0.1:${PORT}/test`);
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});






















