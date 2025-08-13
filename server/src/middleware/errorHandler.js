import { logger } from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    error: err.stack,
    requestId: req.id,
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Default error response
  let error = {
    success: false,
    message: 'Sunucu hatası',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.message = 'Geçersiz veri'
    error.details = err.errors
    return res.status(400).json(error)
  }

  if (err.name === 'UnauthorizedError' || err.message.includes('jwt')) {
    error.message = 'Yetkisiz erişim'
    return res.status(401).json(error)
  }

  if (err.name === 'CastError') {
    error.message = 'Geçersiz ID formatı'
    return res.status(400).json(error)
  }

  if (err.code === 11000) {
    error.message = 'Bu veriler zaten mevcut'
    return res.status(409).json(error)
  }

  if (err.name === 'RateLimitError') {
    error.message = 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.'
    return res.status(429).json(error)
  }

  // Default 500 server error
  res.status(500).json(error)
}

export const notFound = (req, res, next) => {
  const error = new Error(`Route bulunamadı - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export default { errorHandler, notFound }