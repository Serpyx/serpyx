import express from 'express';

const app = express();
const PORT = 8000;

// Basit endpoint
app.get('/test', (req, res) => {
  res.send('Server çalışıyor!');
});

// Listen
app.listen(PORT, () => {
  console.log(`Server port ${PORT} üzerinde çalışıyor.`);
});
























