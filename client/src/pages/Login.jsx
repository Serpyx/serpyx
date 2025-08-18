import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../hooks/useAuthStore'
import { useSound } from '../hooks/useSound'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [snakePosition, setSnakePosition] = useState({ x: 0, y: 0 })
  
  const { login, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const { playButtonClick, playHoverSound, playSuccessSound, playErrorSound } = useSound()
  const { t } = useLanguage()

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Animated snake background
  useEffect(() => {
    const interval = setInterval(() => {
      setSnakePosition({
        x: Math.random() * 100,
        y: Math.random() * 100
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')



    try {
      // ⏱️ TIMEOUT İLE FETCH - 15 saniye timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://serpyx.com' : 'http://localhost:80'
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Response'u parse et
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        throw new Error('Sunucudan geçersiz yanıt alındı')
      }

      if (response.ok && data.success) {
        playSuccessSound()
        login(data.user, data.token)
        navigate('/dashboard')
      } else {
        playErrorSound()
        
        // 🔍 DETAYLI HATA MESAJ YÖNETİMİ
        let errorMessage = data.message || t('loginFailed')
        
        if (response.status === 401 && data.message) {
          // Authentication hatası
          errorMessage = data.message
        } else if (response.status === 500) {
          // Sunucu hatası
          errorMessage = t('serverError')
        } else if (response.status >= 502 && response.status <= 504) {
          // Gateway hataları
          errorMessage = t('serverError')
        }
        
        setError(errorMessage)
      }
    } catch (err) {
      console.error('Login error:', err)
      playErrorSound()
      
      // 🔍 HATA TİPİNE GÖRE MESAJ
      let errorMessage
      
      if (err.name === 'AbortError') {
        errorMessage = t('timeoutError')
      } else if (err.message === 'Failed to fetch') {
        errorMessage = t('networkError')
      } else if (err.message.includes('Network')) {
        errorMessage = t('networkError')
      } else if (err.message.includes('geçersiz yanıt') || err.message.includes('invalid response')) {
        errorMessage = t('invalidResponse')
      } else {
        errorMessage = t('serverError')
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-snake-500/10 via-transparent to-snake-600/10"></div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            x: snakePosition.x + '%', 
            y: snakePosition.y + '%',
            rotate: [0, 360, 0]
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute w-32 h-32 opacity-20"
        >
          <div className="w-full h-full bg-gradient-to-r from-snake-400 to-snake-600 rounded-full blur-xl"></div>
        </motion.div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute top-8 right-8 z-50"
          >
            <LanguageSelector />
          </motion.div>
          {/* Title Only */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl font-bold bg-gradient-to-r from-white to-snake-300 bg-clip-text text-transparent mb-4"
            >
              Serpyx
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-300 font-medium"
            >
              Oyna, Kazan, Geleceği İnşa Et
            </motion.p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-snake-400 to-snake-600 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-bold text-white text-center mb-8"
              >
                {t('loginTitle')}
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm backdrop-blur-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">⚠️</span>
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-300">
                    {t('emailLabel')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">📧</span>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-10 pr-4 py-4 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 ${
                        focusedField === 'email' 
                          ? 'border-snake-400 shadow-lg shadow-snake-400/25' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      placeholder={t('emailPlaceholder')}
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-300">
                    {t('passwordLabel')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔒</span>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-10 pr-12 py-4 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 ${
                        focusedField === 'password' 
                          ? 'border-snake-400 shadow-lg shadow-snake-400/25' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      placeholder={t('passwordPlaceholder')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </motion.div>

                {/* Remember Me & Forgot Password */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center space-x-2 text-gray-300 hover:text-gray-200 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-snake-600 bg-gray-700 border-gray-600 rounded focus:ring-snake-500 focus:ring-2"
                    />
                    <span>{t('rememberMe')}</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-snake-400 hover:text-snake-300 transition-colors font-medium"
                    onMouseEnter={playHoverSound}
                    onClick={playButtonClick}
                  >
                    {t('forgotPassword')}
                  </Link>
                </motion.div>

                {/* Login Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-snake-500 to-snake-600 hover:from-snake-600 hover:to-snake-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-snake-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onMouseEnter={playHoverSound}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t('loginLoading')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>🚀</span>
                        <span>{t('loginButton')}</span>
                      </div>
                    )}
                  </button>
                </motion.div>

                {/* Register Link */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  className="text-center"
                >
                  <p className="text-gray-400">
                    {t('noAccount')}{' '}
                    <Link 
                      to="/register" 
                      className="text-snake-400 hover:text-snake-300 transition-colors font-medium hover:underline"
                      onClick={playButtonClick}
                      onMouseEnter={playHoverSound}
                    >
                      {t('createAccount')}
                    </Link>
                  </p>
                </motion.div>
              </form>
            </div>
          </motion.div>


        </div>
      </div>
    </div>
  )
}

export default Login 