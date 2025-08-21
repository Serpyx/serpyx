import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../hooks/useAuthStore'
import { useSound } from '../hooks/useSound'

const DeleteAccount = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [snakePosition, setSnakePosition] = useState({ x: 0, y: 0 })
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { playButtonClick, playHoverSound, playSuccessSound, playErrorSound } = useSound()

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
    if (!formData.email || !formData.password) {
      setError('Tüm alanları doldurun')
      return false
    }
    
    if (formData.email !== user?.email) {
      setError('E-posta adresi hesabınızla eşleşmiyor')
      return false
    }
    
    return true
  }

  const clearUserLocalStorage = (username) => {
    // Kullanıcıya ait tüm localStorage verilerini temizle
    const keysToRemove = []
    
    // Ana kullanıcı verisi
    keysToRemove.push(`serpyx-user-${username}`)
    
    // SPX ürünleri
    keysToRemove.push(`spxItems-${username}`)
    
    // Görevler
    keysToRemove.push(`dailyTasks-${username}`)
    
    // Başarımlar
    keysToRemove.push(`achievements-${username}`)
    
    // Günlük bonus
    keysToRemove.push(`dailyBonus-${username}`)
    
    // İstatistikler
    keysToRemove.push(`userStats-${username}`)
    
    // Tema ve karakter seçimleri
    keysToRemove.push(`userPreferences-${username}`)
    
    // Süreli ürünler
    keysToRemove.push(`activeTimers-${username}`)
    
    // Bir oyunluk ürünler
    keysToRemove.push(`oneGameItems-${username}`)
    
    // Tüm anahtarı temizle
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log('Removed localStorage key:', key)
    })
    
    console.log('Cleared all user data from localStorage for:', username)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    setError('')

    try {
      const API_BASE_URL = import.meta.env.PROD ? 'https://serpyx.com' : 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        playSuccessSound()
        
        // localStorage'ı temizle
        if (user?.username) {
          clearUserLocalStorage(user.username)
        }
        
        // Zustand store'u temizle
        logout()
        
        // Ana sayfaya yönlendir
        navigate('/')
      } else {
        playErrorSound()
        setError(data.message || 'Hesap silme başarısız')
      }
    } catch (err) {
      console.error('API Error:', err)
      playErrorSound()
      setError('Sunucu bağlantısında hata oluştu. Lütfen daha sonra tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = () => {
    setShowConfirmation(true)
  }

  const handleCancelDelete = () => {
    setShowConfirmation(false)
    setFormData({ email: '', password: '' })
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-snake-500/10 rounded-full blur-3xl"
          animate={{
            x: [snakePosition.x * 10, (snakePosition.x + 20) * 10],
            y: [snakePosition.y * 10, (snakePosition.y + 20) * 10],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center">
                            <img src="/yazı.png" alt="Serpyx Yazı" className="h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">⚠️ Hesap Silme</h2>
            <p className="text-gray-400">
              Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
            </p>
          </div>

          {/* Warning Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">🚨</span>
              <h3 className="text-lg font-bold text-red-400">Dikkat!</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Tüm oyun verileriniz silinecek</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Coin ve SPX bakiyeleriniz kaybolacak</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Başarımlarınız ve istatistikleriniz silinecek</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Bu işlem geri alınamaz</span>
              </li>
            </ul>
          </motion.div>

          {!showConfirmation ? (
            /* Initial Confirmation */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  Hesabınızı silmek istediğinizden emin misiniz?
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleConfirmDelete}
                    onMouseEnter={playHoverSound}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    Evet, Hesabımı Sil
                  </button>
                  <Link
                    to="/dashboard"
                    onClick={playButtonClick}
                    onMouseEnter={playHoverSound}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    İptal
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Delete Form */
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        focusedField === 'email' 
                          ? 'border-red-500 ring-red-500/20' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      placeholder="E-posta adresinizi girin"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        focusedField === 'password' 
                          ? 'border-red-500 ring-red-500/20' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      placeholder="Şifrenizi girin"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={playButtonClick}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Hesap Siliniyor...</span>
                    </div>
                  ) : (
                    'Hesabımı Kalıcı Olarak Sil'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  onMouseEnter={playHoverSound}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  İptal Et
                </button>
              </div>
            </motion.form>
          )}

          {/* Back to Dashboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link
              to="/dashboard"
              onClick={playButtonClick}
              onMouseEnter={playHoverSound}
              className="text-gray-400 hover:text-snake-400 transition-colors text-sm"
            >
              ← Dashboard'a Dön
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default DeleteAccount
