import React, { useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import Roadmap from './pages/Roadmap'
import Store from './pages/Store'
import Tasks from './pages/Tasks'
import DeleteAccount from './pages/DeleteAccount'
import Profile from './pages/Profile'

// Components
import Navbar from './components/Navbar'
import MusicControl from './components/MusicControl'
import ErrorBoundary from './components/ErrorBoundary'
import { useAuthStore } from './hooks/useAuthStore'
import useTheme from './hooks/useTheme'

// Contexts
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  const { isAuthenticated } = useAuthStore()
  const { currentThemeData, isInitialized, currentTheme } = useTheme()

  // Tema class'ını optimize et
  const containerClassName = useMemo(() => {
    if (!isInitialized || !currentThemeData) {
      return 'min-h-screen theme-purple relative overflow-hidden pt-32'
    }
    return `min-h-screen ${currentThemeData.bgClass} relative overflow-hidden pt-32`
  }, [currentTheme, currentThemeData, isInitialized])

  // Tema değişikliğini izle ve container'ı güncelle
  useEffect(() => {
    if (isInitialized && currentThemeData) {
      const mainContainer = document.querySelector('#app-container')
      if (mainContainer) {
        // Tüm tema class'larını temizle
        const allThemeClasses = [
          'theme-purple', 'theme-blue', 'theme-green', 'theme-red', 
          'theme-orange', 'theme-pink', 'theme-cyan', 'theme-yellow', 
          'theme-lime', 'theme-violet'
        ]
        allThemeClasses.forEach(className => {
          mainContainer.classList.remove(className)
        })
        // Yeni tema class'ını ekle
        mainContainer.classList.add(currentThemeData.bgClass)
      }
    }
  }, [currentTheme, currentThemeData, isInitialized])

  // Tema yüklenene kadar loading göster
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div id="app-container" className={containerClassName}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-indigo-500/40 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-600/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-indigo-500/30 rounded-full animate-ping"></div>
          <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/6 left-1/6 w-2 h-2 bg-purple-500/30 rounded-full animate-ping"></div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-600/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/8 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-bl from-purple-400/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-tr from-indigo-400/5 to-transparent rounded-full blur-3xl"></div>
        </div>
        <Navbar />
        <MusicControl />
        <AnimatePresence mode="wait">
          <Routes>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Home />
            </motion.div>
          } />
          
          <Route path="/login" element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Login />
            </motion.div>
          } />
          
          <Route path="/register" element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Register />
            </motion.div>
          } />
          
          <Route path="/forgot-password" element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ForgotPassword />
            </motion.div>
          } />
          
          <Route path="/terms" element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Terms />
            </motion.div>
          } />
          
          <Route path="/privacy" element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Privacy />
            </motion.div>
          } />
          
          <Route path="/verify-email" element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <VerifyEmail />
            </motion.div>
          } />
          
          <Route path="/reset-password" element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ResetPassword />
            </motion.div>
          } />
          
          <Route path="/dashboard" element={
            isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Giriş Yapmanız Gerekiyor</h2>
                    <p className="text-gray-400 mb-6">Dashboard'a erişmek için lütfen giriş yapın.</p>
                    <a href="/login" className="btn-primary">Giriş Yap</a>
                  </div>
                </div>
              </motion.div>
            )
          } />
          
          <Route path="/play" element={
            isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Game />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Oyun İçin Giriş Yapın</h2>
                    <p className="text-gray-400 mb-6">Oyun oynamak ve coin kazanmak için lütfen giriş yapın.</p>
                    <a href="/login" className="btn-primary">Giriş Yap</a>
                  </div>
                </div>
              </motion.div>
            )
          } />
          
          <Route path="/leaderboard" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard />
            </motion.div>
          } />
          
          <Route path="/roadmap" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Roadmap />
            </motion.div>
          } />

          <Route path="/store" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Store />
            </motion.div>
          } />

          <Route path="/tasks" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Tasks />
            </motion.div>
          } />

          <Route path="/delete-account" element={
            isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <DeleteAccount />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Giriş Yapmanız Gerekiyor</h2>
                    <p className="text-gray-400 mb-6">Hesap silme işlemi için lütfen giriş yapın.</p>
                    <a href="/login" className="btn-primary">Giriş Yap</a>
                  </div>
                </div>
              </motion.div>
            )
          } />

          <Route path="/profile" element={
            isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Profile />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Giriş Yapmanız Gerekiyor</h2>
                    <p className="text-gray-400 mb-6">Profil sayfasına erişmek için lütfen giriş yapın.</p>
                    <a href="/login" className="btn-primary">Giriş Yap</a>
                  </div>
                </div>
              </motion.div>
            )
          } />
        </Routes>
      </AnimatePresence>
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App 