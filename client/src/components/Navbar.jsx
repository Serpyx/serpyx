import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../hooks/useAuthStore'
import { useSound } from '../hooks/useSound'
import useDailyTasks from '../hooks/useDailyTasks'
import useAchievements from '../hooks/useAchievements'
import useTheme from '../hooks/useTheme'
import { useLanguage } from '../contexts/LanguageContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const { isAuthenticated, user, logout, coins, spxBalance, selectedNFTCharacter } = useAuthStore()
  const location = useLocation()
  const { playButtonClick, playHoverSound } = useSound()
  const { currentTheme, themes, changeTheme, currentThemeData } = useTheme()
  const { t } = useLanguage()
  
  // Görevler ve başarımlar için bildirim sayısı
  const { getCompletedTasks, getTotalReward } = useDailyTasks()
  const { getUnlockedAchievements, getTotalReward: getAchievementReward } = useAchievements()
  
  // Toplam alınmamış ödül sayısı
  const totalUnclaimedRewards = getCompletedTasks().length + getUnlockedAchievements().length

  const navItems = [
    { path: '/', label: t('home') },
    { path: '/leaderboard', label: t('ranking') },
    { path: '/roadmap', label: t('roadmap') },
    ...(isAuthenticated ? [
      { path: '/dashboard', label: t('dashboard') },
      { path: '/play', label: t('play') },
      { path: '/store', label: t('store') },
      { 
        path: '/tasks', 
        label: t('tasks'),
        notification: totalUnclaimedRewards > 0 ? totalUnclaimedRewards : null
      }
    ] : [])
  ]

  const handleLogout = () => {
    playButtonClick()
    logout()
    setIsMenuOpen(false)
  }

  const handleThemeChange = (themeName) => {
    const selectedTheme = themes[themeName]
    
    // Premium tema kontrolü
    if (selectedTheme.isPremium) {
      const userSPX = user?.spxBalance || spxBalance || 0
      if (userSPX < selectedTheme.price) {
        // Yetersiz SPX - uyarı göster
        alert(`Bu tema için ${selectedTheme.price} SPX gerekiyor. Mevcut SPX: ${userSPX}`)
        return
      }
      
      // SPX'ten düş
      // Burada gerçek API çağrısı yapılacak
      console.log(`${selectedTheme.name} teması satın alındı: ${selectedTheme.price} SPX`)
    }
    
    playButtonClick()
    changeTheme(themeName)
    setIsThemeMenuOpen(false)
    setIsMenuOpen(false) // Mobil menüyü de kapat
  }

  return (
    <>
      <nav className={`${currentThemeData.navbarClass} fixed top-0 left-0 right-0 z-50 backdrop-blur-xl shadow-2xl shadow-black/20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group flex-shrink-0"
              onClick={playButtonClick}
              onMouseEnter={playHoverSound}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-snake-400 to-snake-600 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <img src="/yazı.png" alt="Serpyx Yazı" className="h-14 relative z-10 transform group-hover:scale-105 transition-transform duration-300" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={playButtonClick}
                  onMouseEnter={playHoverSound}
                  className={`text-sm font-medium transition-all duration-300 relative px-4 py-2 rounded-xl mx-1 ${
                    location.pathname === item.path
                      ? 'nav-link-active'
                      : 'nav-link-hover'
                  }`}
                >
                  {item.label}
                  {item.notification && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                      {item.notification}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
              {/* Tema Seçici */}
              <div className="relative">
                <button
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  onMouseEnter={playHoverSound}
                  className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 px-3 py-2 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                >
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                  <span className="text-sm text-gray-300">Tema: {currentThemeData.name}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isThemeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-xl border border-gray-600/30 rounded-xl shadow-2xl z-50"
                  >
                    <div className="p-2">
                      <div className="text-xs text-gray-400 mb-2 px-2">Ana Tema</div>
                      <div className="space-y-1">
                      {Object.entries(themes).map(([key, theme]) => (
                        <button
                          key={key}
                          onClick={() => handleThemeChange(key)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 flex items-center justify-between ${
                            currentTheme === key
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.color.replace('from-', 'from-').replace('via-', 'via-').replace('to-', 'to-')}`}></div>
                            <span>{theme.name}</span>
                          </div>
                          {theme.isPremium && (
                            <div className="flex items-center space-x-1">
                              <img src="/spx.png" alt="SPX" className="w-3 h-3 rounded-full" />
                              <span className="text-xs text-blue-300 font-medium">{theme.price}</span>
                            </div>
                          )}
                          {!theme.isPremium && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-green-300 font-medium">Ücretsiz</span>
                            </div>
                          )}
                        </button>
                      ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Profile Picture and User Greeting */}
                  <Link 
                    to="/profile"
                    onClick={playButtonClick}
                    onMouseEnter={playHoverSound}
                    className="flex items-center space-x-3 bg-indigo-800/30 px-4 py-2 rounded-xl border border-purple-600/30 backdrop-blur-sm hover:bg-indigo-700/40 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-400 bg-gray-900 shadow-lg">
                        {selectedNFTCharacter ? (
                          <img 
                            src={selectedNFTCharacter.image} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            style={{ objectPosition: 'center 30%' }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                            <span className="text-sm">👤</span>
                          </div>
                        )}
                      </div>
                      {selectedNFTCharacter && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border border-purple-400">
                          <span className="text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-300">
                      Merhaba, <span className="text-purple-300 font-semibold">{user?.username || 'Oyuncu'}</span>!
                    </div>
                  </Link>
                  
                  {/* Currency Display */}
                  <div className="flex items-center space-x-2">
                    {/* Coins */}
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 px-3 py-2 rounded-xl border border-yellow-500/30 backdrop-blur-sm">
                      <img src="/coin.PNG" alt="Coin" className="w-5 h-5 rounded-full" />
                      <span className="text-white font-bold text-sm">{user?.coins || coins || 0}</span>
                    </div>
                    
                    {/* SPX */}
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-3 py-2 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                      <img src="/spx.png" alt="SPX" className="w-5 h-5 rounded-full" />
                      <span className="text-white font-bold text-sm">{user?.spxBalance || spxBalance || 0}</span>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    onMouseEnter={playHoverSound}
                    className="btn-danger text-sm px-4 py-2"
                  >
                    Çıkış
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:text-purple-300 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-purple-800/20 hover:border hover:border-purple-600/30"
                    onClick={playButtonClick}
                    onMouseEnter={playHoverSound}
                  >
                    Giriş
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-premium text-sm px-4 py-2"
                    onClick={playButtonClick}
                    onMouseEnter={playHoverSound}
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-purple-300 focus:outline-none p-2 rounded-lg hover:bg-purple-800/20"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm rounded-b-2xl"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium relative transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'text-purple-300 bg-purple-500/10 border border-purple-500/30'
                        : 'text-gray-300 hover:text-purple-300 hover:bg-purple-800/20 hover:border hover:border-purple-600/30'
                    }`}
                  >
                    {item.label}
                    {item.notification && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                        {item.notification}
                      </span>
                    )}
                  </Link>
                ))}
                
                {/* Tema Seçici - Mobil */}
                <div className="pt-4 border-t border-gray-700/50 mt-4">
                  <div className="px-4 py-3">
                    <div className="text-sm text-gray-400 mb-3">Tema Seçimi:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(themes).map(([key, theme]) => (
                        <button
                          key={key}
                          onClick={() => handleThemeChange(key)}
                          className={`px-3 py-2 rounded-lg text-xs transition-all duration-300 flex items-center justify-between ${
                            currentTheme === key
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.color.replace('from-', 'from-').replace('via-', 'via-').replace('to-', 'to-')}`}></div>
                            <span>{theme.name}</span>
                          </div>
                          {theme.isPremium && (
                            <div className="flex items-center space-x-1">
                              <img src="/spx.png" alt="SPX" className="w-2 h-2 rounded-full" />
                              <span className="text-xs text-blue-300 font-medium">{theme.price}</span>
                            </div>
                          )}
                          {!theme.isPremium && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-green-300 font-medium">Ücretsiz</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {isAuthenticated ? (
                  <div className="pt-4 border-t border-gray-700/50 mt-4">
                    <div className="px-4 py-3 text-sm text-gray-400 space-y-3">
                      <div className="flex items-center space-x-3">
                        <img src="/coin.PNG" alt="Coin" className="w-5 h-5 rounded-full" />
                        <span className="text-white font-semibold">{user?.coins || coins || 0} Coin</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/spx.png" alt="SPX" className="w-5 h-5 rounded-full" />
                        <span className="text-white font-semibold">{user?.spxBalance || spxBalance || 0} SPX</span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 text-gray-300 hover:text-purple-300 hover:bg-purple-800/20 rounded-xl px-3 py-2 transition-all duration-300"
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-400 bg-gray-900 shadow-lg">
                            {selectedNFTCharacter ? (
                              <img 
                                src={selectedNFTCharacter.image} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'center 30%' }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                                <span className="text-sm">👤</span>
                              </div>
                            )}
                          </div>
                          {selectedNFTCharacter && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border border-purple-400">
                              <span className="text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <div>
                          {t('hello')}, <span className="text-purple-300 font-semibold">{user?.username || 'Oyuncu'}</span>!
                        </div>
                      </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-purple-300 hover:bg-purple-800/20 rounded-xl mt-3"
                    >
                      {t('logout')}
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-700/50 mt-4 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-purple-300 hover:bg-purple-800/20 rounded-xl"
                    >
                      {t('loginButton')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-base font-medium btn-primary rounded-xl"
                    >
                      {t('registerButton')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </nav>
      
      {/* Bilgilendirme İkonu - Sağ üst köşede */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative group">
          <button className="w-8 h-8 bg-blue-600/80 hover:bg-blue-500/90 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 shadow-lg border border-blue-400/30">
            i
          </button>
          
          {/* Tooltip */}
          <div className="absolute right-0 top-10 w-80 bg-gray-900/95 border border-gray-700 rounded-lg p-4 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
            <div className="text-xs text-gray-300 leading-relaxed">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-400">⚠️</span>
                <span className="text-yellow-300 font-semibold">Bilgilendirme</span>
              </div>
              <p className="text-gray-300">
                SPX ve coinler şu an sadece oyun içi puandır, gerçek kripto para değildir. 
                Blockchain entegrasyonu planlanmaktadır fakat kesin bir vaat değildir.
              </p>
            </div>
            {/* Ok işareti */}
            <div className="absolute -top-2 right-4 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-gray-900/95"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar 