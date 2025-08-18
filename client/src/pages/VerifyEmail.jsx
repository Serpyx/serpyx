import React, { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSound } from '../hooks/useSound'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { playSuccessSound, playErrorSound } = useSound()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [snakePosition, setSnakePosition] = useState({ x: 0, y: 0 })

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

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setError('Doğrulama linki geçersiz')
        setIsLoading(false)
        playErrorSound()
        return
      }

      try {
        const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://serpyx.com' : 'http://localhost:80'
        const response = await fetch(`${API_BASE_URL}/api/verify-email?token=${token}`)
        const data = await response.json()

        if (data.success) {
          setIsSuccess(true)
          playSuccessSound()
        } else {
          setError(data.message || 'Doğrulama başarısız')
          playErrorSound()
        }
      } catch (error) {
        setError('Sunucu hatası. Lütfen daha sonra tekrar deneyin.')
        playErrorSound()
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams, playSuccessSound, playErrorSound])

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
            <p className="text-snake-400 text-lg">E-posta Doğrulama</p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
          >
            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-snake-400 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-white mb-2">Doğrulanıyor...</h3>
                <p className="text-gray-400">E-posta adresiniz doğrulanıyor, lütfen bekleyin.</p>
              </div>
            ) : isSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-green-400">✅</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Doğrulama Başarılı!</h3>
                <p className="text-gray-300 mb-6">
                  E-posta adresiniz başarıyla doğrulandı. Artık Serpyx'i tam olarak kullanabilirsiniz!
                </p>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                  <h4 className="text-green-400 font-bold mb-2">🎁 Hoş Geldin Bonusu</h4>
                  <p className="text-gray-300 text-sm">
                    Hesabınızda <strong>1000 coin</strong> bonus bulunmaktadır!
                  </p>
                </div>
                <Link 
                  to="/login" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-snake-500 to-snake-600 text-white font-bold rounded-xl hover:from-snake-600 hover:to-snake-700 transition-all duration-300 shadow-lg"
                >
                  Giriş Yap
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-red-400">❌</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Doğrulama Başarısız</h3>
                <p className="text-gray-300 mb-6">
                  {error}
                </p>
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-snake-500 to-snake-600 text-white font-bold rounded-xl hover:from-snake-600 hover:to-snake-700 transition-all duration-300 shadow-lg"
                  >
                    Giriş Sayfasına Dön
                  </Link>
                  <div>
                    <Link 
                      to="/forgot-password" 
                      className="text-snake-400 hover:text-snake-300 text-sm underline"
                    >
                      Yeni doğrulama e-postası gönder
                    </Link>
                  </div>
                </div>
              </div>
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
            >
              ← Ana Sayfaya Dön
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
