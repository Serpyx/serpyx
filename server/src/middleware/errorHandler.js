import { logger } from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = { message, statusCode: 404 }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = { message, statusCode: 400 }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    error = { message, statusCode: 401 }
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired'
    error = { message, statusCode: 401 }
  }

  // PostgreSQL errors
  if (err.code === '23505') { // unique_violation
    const message = 'Duplicate entry - this value already exists'
    error = { message, statusCode: 400 }
  }

  if (err.code === '23503') { // foreign_key_violation
    const message = 'Referenced record does not exist'
    error = { message, statusCode: 400 }
  }

  if (err.code === '23502') { // not_null_violation
    const message = 'Required field is missing'
    error = { message, statusCode: 400 }
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests, please try again later'
    error = { message, statusCode: 429 }
  }

  // Default error
  const statusCode = error.statusCode || err.statusCode || 500
  const message = error.message || 'Server Error'

  // Don't leak error details in production
  const response = {
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : message
  }

  // Add error details in development
  if (process.env.NODE_ENV === 'development') {
    response.error = {
      stack: err.stack,
      code: err.code,
      name: err.name
    }
  }

  res.status(statusCode).json(response)
}

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// 404 handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Validation error handler
export const validationError = (errors) => {
  const error = new Error('Validation failed')
  error.statusCode = 400
  error.errors = errors
  return error
}

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}
    const message = 'Required field is missing'
    error = { message, statusCode: 400 }
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests, please try again later'
    error = { message, statusCode: 429 }
  }

  // Default error
  const statusCode = error.statusCode || err.statusCode || 500
  const message = error.message || 'Server Error'

  // Don't leak error details in production
  const response = {
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : message
  }

  // Add error details in development
  if (process.env.NODE_ENV === 'development') {
    response.error = {
      stack: err.stack,
      code: err.code,
      name: err.name
    }
  }

  res.status(statusCode).json(response)
}

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// 404 handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Validation error handler
export const validationError = (errors) => {
  const error = new Error('Validation failed')
  error.statusCode = 400
  error.errors = errors
  return error
}

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}
export default { errorHandler, notFound }