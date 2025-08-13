import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '../hooks/useSound'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [snakePosition, setSnakePosition] = useState({ x: 0, y: 0 })
  
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        playSuccessSound()
        setSuccess(true)
        setEmail('')
      } else {
        playErrorSound()
        setError(data.message || 'Bir hata oluştu')
      }
    } catch (err) {
      console.error('API Error:', err)
      playErrorSound()
      setError('Sunucu bağlantısında hata oluştu. Lütfen daha sonra tekrar deneyin.')
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
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-snake-400 to-snake-600 rounded-full flex items-center justify-center shadow-2xl shadow-snake-500/50">
                  <span className="text-4xl">🔐</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-snake-400 to-snake-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl font-bold bg-gradient-to-r from-white to-snake-300 bg-clip-text text-transparent mb-4"
            >
              Şifremi Unuttum
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-gray-300"
            >
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-snake-400 to-snake-600 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm backdrop-blur-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">⚠️</span>
                          <span>{error}</span>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        E-posta Adresi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400">📧</span>
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                          className={`w-full pl-10 pr-4 py-4 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 ${
                            focusedField === 'email' 
                              ? 'border-snake-400 shadow-lg shadow-snake-400/25' 
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          placeholder="ornek@email.com"
                          required
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-snake-500 to-snake-600 hover:from-snake-600 hover:to-snake-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-snake-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      onMouseEnter={playHoverSound}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Gönderiliyor...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>📤</span>
                          <span>Şifre Sıfırlama Bağlantısı Gönder</span>
                        </div>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">✅</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">
                      E-posta Gönderildi!
                    </h3>
                    
                    <p className="text-gray-300 mb-6">
                      Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi. 
                      E-postanızı kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
                    </p>
                    
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <p className="text-sm text-green-400">
                        <span className="font-medium">💡 İpucu:</span> Spam klasörünüzü de kontrol edin
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Back to Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-8 text-center"
              >
                <Link 
                  to="/login" 
                  className="text-snake-400 hover:text-snake-300 transition-colors font-medium hover:underline"
                  onClick={playButtonClick}
                  onMouseEnter={playHoverSound}
                >
                  ← Giriş sayfasına dön
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <p className="text-sm text-gray-400">
                <span className="text-snake-400 font-medium">💬 Yardım:</span> Sorun yaşıyorsanız destek ekibimizle iletişime geçin
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
