import React, { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '../hooks/useSound'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { playButtonClick, playHoverSound, playSuccessSound, playErrorSound } = useSound()
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [snakePosition, setSnakePosition] = useState({ x: 0, y: 0 })

  const token = searchParams.get('token')

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

  const validateForm = () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Tüm alanları doldurun')
      return false
    }
    
    if (formData.newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return false
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    setError('')

    try {
      const API_BASE_URL = 'https://serpyx.onrender.com'
      const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        playSuccessSound()
      } else {
        setError(data.message || 'Şifre sıfırlama başarısız')
        playErrorSound()
      }
    } catch (error) {
      setError('Sunucu hatası. Lütfen daha sonra tekrar deneyin.')
      playErrorSound()
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-red-400">❌</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Geçersiz Link</h3>
            <p className="text-gray-300 mb-6">
              Şifre sıfırlama linki geçersiz veya eksik.
            </p>
            <Link 
              to="/forgot-password" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-snake-500 to-snake-600 text-white font-bold rounded-xl hover:from-snake-600 hover:to-snake-700 transition-all duration-300 shadow-lg"
            >
              Yeni Şifre Sıfırlama Talebi
            </Link>
          </div>
        </div>
      </div>
    )
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
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-snake-400 to-snake-600 rounded-full mb-6 shadow-2xl"
            >
                              <img src="/yazı.png" alt="Serpyx" className="w-14 h-14" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-2">Serpyx</h2>
            <p className="text-snake-400 text-lg">Şifre Sıfırlama</p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
          >
            {isSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-green-400">✅</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Şifre Güncellendi!</h3>
                <p className="text-gray-300 mb-6">
                  Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.
                </p>
                <Link 
                  to="/login" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-snake-500 to-snake-600 text-white font-bold rounded-xl hover:from-snake-600 hover:to-snake-700 transition-all duration-300 shadow-lg"
                >
                  Giriş Yap
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('newPassword')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 ${
                        focusedField === 'newPassword' 
                          ? 'border-snake-400 shadow-lg shadow-snake-400/25' 
                          : 'border-white/20 hover:border-white/30'
                      }`}
                      placeholder="Yeni şifrenizi girin"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <span className="text-gray-400 hover:text-white transition-colors">
                        {showPassword ? '🙈' : '👁️'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 ${
                        focusedField === 'confirmPassword' 
                          ? 'border-snake-400 shadow-lg shadow-snake-400/25' 
                          : 'border-white/20 hover:border-white/30'
                      }`}
                      placeholder="Şifrenizi tekrar girin"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <span className="text-gray-400 hover:text-white transition-colors">
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm"
                    >
                      ⚠️ {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 ${
                    isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-snake-500 to-snake-600 hover:from-snake-600 hover:to-snake-700 shadow-lg hover:shadow-xl'
                  }`}
                  onClick={playButtonClick}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Güncelleniyor...
                    </div>
                  ) : (
                    'Şifremi Güncelle'
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-6"
          >
            <Link 
              to="/" 
              className="text-gray-400 hover:text-white transition-colors text-sm"
              onMouseEnter={playHoverSound}
            >
              ← Ana Sayfaya Dön
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
