const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://serpyx.com', 'https://www.serpyx.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:80'],
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serpyx API is running',
    timestamp: new Date().toISOString()
  })
})

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/dist')))

// SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Serpyx Server running on port ${PORT}`)
  console.log(`🔗 Client URL: http://localhost:${PORT}`)
  console.log(`🌐 Domain URL: http://serpyx.com`)
  console.log(`✅ All systems ready!`)
})
