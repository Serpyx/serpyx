const express = require('express');

const app = express();
const PORT = 9000;

// Basit endpoint
app.get('/test', (req, res) => {
  res.send('CommonJS Server çalışıyor!');
});

// Listen
app.listen(PORT, () => {
  console.log(`CommonJS Server port ${PORT} üzerinde çalışıyor.`);
});
























