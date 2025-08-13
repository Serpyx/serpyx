import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../hooks/useAuthStore'
import { useSound } from '../hooks/useSound'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [snakePosition, setSnakePosition] = useState({ x: 0, y: 0 })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const { register, isAuthenticated } = useAuthStore()
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

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Tüm alanları doldurun')
      return false
    }
    
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return false
    }
    
    if (!agreedToTerms) {
      setError('Kullanım şartlarını kabul etmelisiniz')
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
      // ⏱️ TIMEOUT İLE FETCH - 15 saniye timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const API_BASE_URL = 'https://serpyx.onrender.com'
      const response = await fetch(`${API_BASE_URL}/api/register`, {
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
        register(data.user, data.token)
        navigate('/dashboard')
      } else {
        playErrorSound()
        
        // 🔍 DETAYLI HATA MESAJ YÖNETİMİ
        let errorMessage = data.message || 'Kayıt başarısız'
        
        if (response.status === 400 && data.message) {
          // Kullanıcı hatası (email zaten var, vs.)
          errorMessage = data.message
        } else if (response.status === 500) {
          // Sunucu hatası
          errorMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
        } else if (response.status >= 502 && response.status <= 504) {
          // Gateway hataları
          errorMessage = 'Sunucu geçici olarak ulaşılamıyor. Lütfen birkaç dakika sonra tekrar deneyin.'
        }
        
        setError(errorMessage)
      }
    } catch (err) {
      console.error('API Error:', err)
      playErrorSound()
      
      // 🔍 HATA TİPİNE GÖRE MESAJ
      let errorMessage
      
      if (err.name === 'AbortError') {
        errorMessage = 'İşlem zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.'
      } else if (err.message === 'Failed to fetch') {
        errorMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.'
      } else if (err.message.includes('Network')) {
        errorMessage = 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.'
      } else if (err.message.includes('geçersiz yanıt')) {
        errorMessage = err.message
      } else {
        errorMessage = 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
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
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold text-white mb-2">Serpyx</h2>
            <p className="text-snake-400 text-lg">{t('registerTitle')}</p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('usernameLabel')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 ${
                      focusedField === 'username' 
                        ? 'border-snake-400 shadow-lg shadow-snake-400/25' 
                        : 'border-white/20 hover:border-white/30'
                    }`}
                    placeholder={t('usernamePlaceholder')}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-400">👤</span>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 ${
                      focusedField === 'email' 
                        ? 'border-snake-400 shadow-lg shadow-snake-400/25' 
                        : 'border-white/20 hover:border-white/30'
                    }`}
                    placeholder={t('emailPlaceholder')}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-400">📧</span>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 ${
                      focusedField === 'password' 
                        ? 'border-snake-400 shadow-lg shadow-snake-400/25' 
                        : 'border-white/20 hover:border-white/30'
                    }`}
                    placeholder={t('passwordPlaceholder')}
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
                  {t('confirmPasswordLabel')}
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
                    placeholder={t('confirmPasswordPlaceholder')}
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

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-snake-400 bg-white/10 border-white/20 rounded focus:ring-snake-400 focus:ring-2"
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  <Link to="/terms" className="text-snake-400 hover:text-snake-300 underline">
                    {t('termsLink')}
                  </Link>
                  {' '}ve{' '}
                  <Link to="/privacy" className="text-snake-400 hover:text-snake-300 underline">
                    {t('privacyLink')}
                  </Link>
                  'nı kabul ediyorum
                </label>
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
                    {t('registerLoading')}
                  </div>
                ) : (
                  t('registerButton')
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/5 text-gray-400">{t('or')}</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-400">
                {t('noAccount')}{' '}
                <Link 
                  to="/login" 
                  className="text-snake-400 hover:text-snake-300 font-medium transition-colors"
                  onMouseEnter={playHoverSound}
                >
                  {t('loginButton')}
                </Link>
              </p>
            </div>
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
              {t('backToHome')}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Register 