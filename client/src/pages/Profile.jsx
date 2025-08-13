import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../hooks/useAuthStore'
import { useSound } from '../hooks/useSound'
import { useLanguage } from '../contexts/LanguageContext'
import { NFT_CATEGORIES, NFT_QUALITY_COLORS } from '../data/nftData'

const Profile = () => {
  const { user, logout, ownedNFTs, selectedNFTCharacter } = useAuthStore()
  const navigate = useNavigate()
  const { playButtonClick, playHoverSound, playSuccessSound, playErrorSound } = useSound()
  const { t } = useLanguage()
  
  // State for different sections
  const [activeTab, setActiveTab] = useState('profile') // profile, nfts, security, delete
  const [snakePosition, setSnakePosition] = useState({ x: 0, y: 0 })
  const [message, setMessage] = useState('')
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Delete account form
  const [deleteForm, setDeleteForm] = useState({
    email: '',
    password: ''
  })
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

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

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    })
    setPasswordError('')
    setPasswordSuccess('')
  }

  const handleDeleteFormChange = (e) => {
    setDeleteForm({
      ...deleteForm,
      [e.target.name]: e.target.value
    })
    setDeleteError('')
  }

  const validatePasswordForm = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError(t('fillAllFields'))
      return false
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError(t('passwordMinLength'))
      return false
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t('passwordsDontMatch'))
      return false
    }
    
    return true
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!validatePasswordForm()) return
    
    setIsChangingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      const API_BASE_URL = 'https://serpyx.onrender.com'
      const response = await fetch(`${API_BASE_URL}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('serpyx-token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        playSuccessSound()
        setPasswordSuccess(t('passwordChangedSuccess'))
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        playErrorSound()
        setPasswordError(data.message || t('passwordChangeFailed'))
      }
    } catch (err) {
      console.error('API Error:', err)
      playErrorSound()
      setPasswordError(t('serverConnectionError'))
    } finally {
      setIsChangingPassword(false)
    }
  }

  const clearUserLocalStorage = (username) => {
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

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    if (!deleteForm.email || !deleteForm.password) {
      setDeleteError(t('fillAllFields'))
      return
    }
    
    if (deleteForm.email !== user?.email) {
      setDeleteError(t('emailMismatch'))
      return
    }
    
    setIsDeletingAccount(true)
    setDeleteError('')

    try {
      const API_BASE_URL = 'https://serpyx.onrender.com'
      const response = await fetch(`${API_BASE_URL}/api/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteForm)
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
        setDeleteError(data.message || t('accountDeletionFailed'))
      }
    } catch (err) {
      console.error('API Error:', err)
      playErrorSound()
      setDeleteError(t('serverConnectionError'))
    } finally {
      setIsDeletingAccount(false)
    }
  }

  const handleLogout = () => {
    playButtonClick()
    logout()
    navigate('/')
  }

  // NFT Functions
  const handleSelectNFT = (nft) => {
    playButtonClick()
    // Update selected NFT character in store
    const { updateSelectedNFTCharacter } = useAuthStore.getState()
    updateSelectedNFTCharacter(nft)
    
    // Başarı mesajı göster
    setMessage(`✅ ${nft.name} profil fotoğrafı olarak ayarlandı!`)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleClaimFreeNFT = () => {
    playButtonClick()
    
    // Check if user already owns Ashstripe
    if (ownedNFTs?.some(nft => nft.id === 'ashstripe')) {
      setMessage('Bu NFT\'ye zaten sahipsiniz!')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    // Create Ashstripe NFT object
    const ashstripeNFT = {
      id: 'ashstripe',
      name: 'Ashstripe',
      image: '/Serpyx_NFT/common_quality/Ashstripe.png',
      quality: 'common',
      acquiredAt: new Date().toISOString()
    }
    
    // Add to owned NFTs and set as profile picture
    const { updateOwnedNFTs, updateSelectedNFTCharacter } = useAuthStore.getState()
    const newOwnedNFTs = [...(ownedNFTs || []), ashstripeNFT]
    updateOwnedNFTs(newOwnedNFTs)
    updateSelectedNFTCharacter(ashstripeNFT)
    
    // Başarı mesajı göster
    setMessage('🎉 Ashstripe NFT ücretsiz olarak alındı!')
    setTimeout(() => setMessage(''), 3000)
    playSuccessSound()
  }

  const getAccountAge = () => {
    if (!user?.createdAt) return t('unknown')
    const created = new Date(user.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now - created)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} ${t('days')}`
  }

  const getLastLogin = () => {
    if (!user?.lastLogin) return t('firstLogin')
    const lastLogin = new Date(user.lastLogin)
    return lastLogin.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-slate-900/50 relative overflow-hidden">
      {/* Reklam Alanları - Sol ve Sağ */}
      <div className="hidden xl:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-20">
        <div className="ad-placeholder-left">
          <div className="ad-content">
            <div className="ad-icon">
              <span>📱</span>
            </div>
            <p className="ad-title">Reklam Alanı</p>
            <p className="ad-size">160x600</p>
            <small className="ad-note">Yayın zamanı buraya AdSense kodunu ekle</small>
          </div>
        </div>
      </div>
      
      <div className="hidden xl:flex fixed right-4 top-1/2 transform -translate-y-1/2 z-20">
        <div className="ad-placeholder-right">
          <div className="ad-content">
            <div className="ad-icon">
              <span>📱</span>
            </div>
            <p className="ad-title">Reklam Alanı</p>
            <p className="ad-size">160x600</p>
            <small className="ad-note">Yayın zamanı buraya AdSense kodunu ekle</small>
          </div>
        </div>
      </div>

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

      <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-12"
          >
            <img src="/yazı.png" alt="Serpyx Yazı" className="h-20 mx-auto mb-6" />
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-snake-500 bg-gray-900 shadow-2xl">
                  {selectedNFTCharacter ? (
                    <img 
                      src={selectedNFTCharacter.image} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 30%' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  )}
                </div>
                {selectedNFTCharacter && (
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-snake-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl font-bold text-white">{t('profileTitle')}</h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('profileDescription')}
            </p>
          </motion.div>

          {/* Message Display */}
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 text-center"
            >
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm">
                {message}
              </div>
            </motion.div>
          )}

          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
              <button
                onClick={() => setActiveTab('profile')}
                onMouseEnter={playHoverSound}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-snake-500 to-snake-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                📋 {t('profileInfo')}
              </button>
              <button
                onClick={() => setActiveTab('nfts')}
                onMouseEnter={playHoverSound}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'nfts'
                    ? 'bg-gradient-to-r from-snake-500 to-snake-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                🎨 {t('myNFTs')}
              </button>
              <button
                onClick={() => setActiveTab('security')}
                onMouseEnter={playHoverSound}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'security'
                    ? 'bg-gradient-to-r from-snake-500 to-snake-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                🔒 {t('security')}
              </button>
              <button
                onClick={() => setActiveTab('delete')}
                onMouseEnter={playHoverSound}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'delete'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                ⚠️ {t('deleteAccount')}
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl overflow-hidden"
          >
            {activeTab === 'profile' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">📋 {t('profileInfo')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* User Info */}
                  <div className="space-y-6">
                    <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4">{t('userInformation')}</h3>
                      <div className="space-y-4">
                        {/* Profile Picture */}
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-snake-500 bg-gray-900 shadow-lg">
                              {selectedNFTCharacter ? (
                                <img 
                                  src={selectedNFTCharacter.image} 
                                  alt="Profile" 
                                  className="w-full h-full object-cover"
                                  style={{ objectPosition: 'center 30%' }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                                  <span className="text-2xl">👤</span>
                                </div>
                              )}
                            </div>
                            {selectedNFTCharacter && (
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-snake-500 rounded-full flex items-center justify-center shadow-lg border border-white">
                                <span className="text-xs font-bold">✓</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">{t('profilePicture')}</p>
                            <p className="text-white font-semibold">
                              {selectedNFTCharacter ? selectedNFTCharacter.name : t('noProfilePicture')}
                            </p>
                            {selectedNFTCharacter && (
                              <p className="text-snake-400 text-xs capitalize mt-1">{selectedNFTCharacter.quality}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">{t('username')}</label>
                          <p className="text-white font-semibold">{user?.username || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">{t('email')}</label>
                          <p className="text-white font-semibold">{user?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4">{t('accountStatistics')}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">{t('accountAge')}</label>
                          <p className="text-white font-semibold">{getAccountAge()}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">{t('lastLogin')}</label>
                          <p className="text-white font-semibold">{getLastLogin()}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">{t('registrationDate')}</label>
                          <p className="text-white font-semibold">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Game Stats */}
                  <div className="space-y-6">
                    <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4">{t('gameStatistics')}</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">{t('totalCoins')}:</span>
                          <div className="flex items-center space-x-2">
                            <img src="/coin.PNG" alt="Coin" className="w-5 h-5 rounded-full" />
                            <span className="text-yellow-400 font-bold">{(user?.coins || 0).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">{t('spxBalance')}:</span>
                          <div className="flex items-center space-x-2">
                            <img src="/spx.png" alt="SPX" className="w-5 h-5 rounded-full" />
                            <span className="text-blue-400 font-bold">{(user?.spxBalance || 0).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">{t('highestScore')}:</span>
                          <span className="text-snake-400 font-bold">{(user?.highScore || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">{t('totalScore')}:</span>
                          <span className="text-purple-400 font-bold">{(user?.totalScore || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4">{t('quickActions')}</h3>
                      <div className="space-y-3">
                        <Link
                          to="/dashboard"
                          onClick={playButtonClick}
                          onMouseEnter={playHoverSound}
                          className="block w-full px-4 py-3 bg-gradient-to-r from-snake-500 to-snake-600 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all duration-300"
                        >
                          {t('returnToDashboard')}
                        </Link>
                        <button
                          onClick={handleLogout}
                          onMouseEnter={playHoverSound}
                          className="block w-full px-4 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-all duration-300"
                        >
                          {t('logout')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nfts' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-8">🎨 {t('myNFTs')}</h2>
                
                <div className="space-y-8">
                  {/* Owned NFTs */}
                  <div className="bg-gray-700/50 rounded-xl p-8 border border-gray-600">
                    <h3 className="text-xl font-bold text-white mb-6">{t('ownedNFTs')}</h3>
                    
                    {ownedNFTs && ownedNFTs.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {ownedNFTs.map((nft, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className={`relative rounded-xl p-4 border-2 transition-all duration-300 backdrop-blur-sm shadow-lg ${
                              selectedNFTCharacter?.id === nft.id
                                ? 'border-snake-500 bg-gradient-to-br from-snake-500/20 to-snake-600/20 shadow-snake-500/20'
                                : 'border-green-400 bg-green-500/20 hover:shadow-xl'
                            }`}
                          >
                            <div className={`relative w-full rounded-xl mb-3 overflow-hidden shadow-2xl ${
                              nft.quality === 'legendary' || nft.quality === 'mythic' ? 'h-64' : 'h-56'
                            }`}>
                              <img 
                                src={nft.image} 
                                alt={nft.name}
                                className={`w-full h-full rounded-lg ${
                                  selectedNFTCharacter?.id === nft.id
                                    ? 'object-cover' // Aktif profil için tam ekran, kafa ortalı
                                    : nft.quality === 'legendary' || nft.quality === 'mythic'
                                    ? 'object-cover' 
                                    : 'object-contain bg-gray-900'
                                }`}
                                style={selectedNFTCharacter?.id === nft.id ? { objectPosition: 'center 30%' } : {}}
                              />
                              
                              {/* Kalite Badge */}
                              <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm z-10 ${
                                nft.quality === 'common' ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border border-gray-400' :
                                nft.quality === 'rare' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-400' :
                                nft.quality === 'legendary' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border border-purple-400' :
                                'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border border-yellow-400'
                              }`}>
                                {nft.quality === 'common' ? 'COMMON' :
                                 nft.quality === 'rare' ? 'RARE' :
                                 nft.quality === 'legendary' ? 'LEGENDARY' :
                                 'MYTHIC'}
                              </div>
                              
                              {/* Sahip olma durumu */}
                              <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border border-green-400 z-10">
                                <span className="text-green-100 text-sm font-bold">✓</span>
                              </div>
                            </div>
                            
                            <p className="text-sm font-medium text-center mb-3 text-green-200">{nft.name}</p>
                            
                            {/* Profil Fotoğrafı Butonu */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSelectNFT(nft)
                              }}
                              onMouseEnter={playHoverSound}
                              className={`w-full px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                selectedNFTCharacter?.id === nft.id
                                  ? 'bg-gradient-to-r from-snake-500 to-snake-600 text-white shadow-lg'
                                  : 'bg-gray-600 hover:bg-gray-500 text-white hover:shadow-md'
                              }`}
                            >
                                                          {selectedNFTCharacter?.id === nft.id ? '✓ Aktif Profil' : '📷 PP Olarak Ayarla'}
                          </button>
                          
                          {selectedNFTCharacter?.id === nft.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-snake-500 to-snake-600 rounded-full flex items-center justify-center shadow-lg border border-snake-400 z-10">
                              <span className="text-xs font-bold">👑</span>
                            </div>
                          )}
                          
                          
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="text-3xl">🎨</span>
                        </div>
                        <p className="text-gray-400 mb-6 text-lg">{t('noNFTsOwned')}</p>
                        <Link
                          to="/store"
                          onClick={playButtonClick}
                          onMouseEnter={playHoverSound}
                          className="inline-block px-8 py-4 bg-gradient-to-r from-snake-500 to-snake-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
                        >
                          {t('buyNFTs')}
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Free NFT Claim and Profile Picture Settings */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4">{t('freeNFT')}</h3>
                      
                      <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-700">
                            <img 
                              src="/Serpyx_NFT/common_quality/Ashstripe.png" 
                              alt="Ashstripe" 
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">Ashstripe</h4>
                            <p className="text-green-400 text-sm capitalize">{t('commonQuality')}</p>
                            <p className="text-gray-300 text-sm">{t('freeForEveryone')}</p>
                          </div>
                        </div>
                        
                        {ownedNFTs?.some(nft => nft.id === 'ashstripe') ? (
                          <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                            <p className="text-green-400 text-sm text-center">{t('alreadyOwned')}</p>
                          </div>
                        ) : (
                          <button
                            onClick={handleClaimFreeNFT}
                            onMouseEnter={playHoverSound}
                            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
                          >
                            {t('claimFree')}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Profile Picture Settings */}
                    <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4">{t('profilePictureSettings')}</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-snake-500 bg-gray-900 shadow-lg">
                              {selectedNFTCharacter ? (
                                <img 
                                  src={selectedNFTCharacter.image} 
                                  alt="Current Profile" 
                                  className="w-full h-full object-cover"
                                  style={{ objectPosition: 'center 30%' }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                                  <span className="text-xl">👤</span>
                                </div>
                              )}
                            </div>
                            {selectedNFTCharacter && (
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-snake-500 rounded-full flex items-center justify-center shadow-lg border border-snake-400">
                                <span className="text-xs font-bold">✓</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-lg">
                              {selectedNFTCharacter ? selectedNFTCharacter.name : t('defaultProfile')}
                            </p>
                            <p className="text-gray-400 text-sm">{t('currentProfilePicture')}</p>
                            {selectedNFTCharacter && (
                              <p className="text-snake-400 text-xs capitalize mt-1">{selectedNFTCharacter.quality}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-300 bg-gray-800/20 p-3 rounded-lg border border-gray-600">
                          <p className="flex items-center">
                            <span className="mr-2">💡</span>
                            {t('profilePictureInfo')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">🔒 {t('securitySettings')}</h2>
                
                <div className="max-w-2xl mx-auto">
                  {/* Password Change Form */}
                  <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">{t('changePasswordTitle')}</h3>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t('currentPasswordLabel')}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.current ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-snake-500"
                            placeholder={t('enterCurrentPassword')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword.current ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t('newPasswordLabel')}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.new ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-snake-500"
                            placeholder={t('enterNewPassword')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword.new ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t('confirmNewPasswordLabel')}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-snake-500"
                            placeholder={t('confirmNewPasswordPlaceholder')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword.confirm ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>

                      {/* Error/Success Messages */}
                      <AnimatePresence>
                        {passwordError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm"
                          >
                            {passwordError}
                          </motion.div>
                        )}
                        {passwordSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm"
                          >
                            {passwordSuccess}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        onClick={playButtonClick}
                        className="w-full bg-gradient-to-r from-snake-500 to-snake-600 hover:shadow-lg disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
                      >
                        {isChangingPassword ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Şifre Değiştiriliyor...</span>
                          </div>
                        ) : (
                          t('changePasswordButton')
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Security Tips */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-blue-400 mb-4">🔐 {t('securityTips')}</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{t('securityTip1')}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{t('securityTip2')}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{t('securityTip3')}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{t('securityTip4')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delete' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">⚠️ {t('accountDeletion')}</h2>
                
                <div className="max-w-2xl mx-auto">
                  {/* Warning Card */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">🚨</span>
                      <h3 className="text-lg font-bold text-red-400">{t('warning')}</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{t('deletionWarning1')}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{t('deletionWarning2')}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{t('deletionWarning3')}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{t('deletionWarning4')}</span>
                      </li>
                    </ul>
                  </div>

                  {!showDeleteConfirmation ? (
                    /* Initial Confirmation */
                    <div className="text-center">
                      <p className="text-gray-300 mb-6">
                        {t('confirmDeletion')}
                      </p>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setShowDeleteConfirmation(true)}
                          onMouseEnter={playHoverSound}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                        >
                          {t('yesDeleteAccount')}
                        </button>
                        <button
                          onClick={() => setActiveTab('profile')}
                          onMouseEnter={playHoverSound}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Delete Form */
                    <form onSubmit={handleDeleteAccount} className="space-y-4">
                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t('email')}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={deleteForm.email}
                          onChange={handleDeleteFormChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                          placeholder={t('enterEmail')}
                        />
                      </div>

                      {/* Password Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {t('currentPasswordLabel')}
                        </label>
                        <div className="relative">
                          <input
                            type={showDeletePassword ? 'text' : 'password'}
                            name="password"
                            value={deleteForm.password}
                            onChange={handleDeleteFormChange}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                            placeholder={t('enterPassword')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showDeletePassword ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>

                      {/* Error Message */}
                      <AnimatePresence>
                        {deleteError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm"
                          >
                            {deleteError}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={isDeletingAccount}
                          onClick={playButtonClick}
                          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:cursor-not-allowed"
                        >
                          {isDeletingAccount ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Hesap Siliniyor...</span>
                            </div>
                          ) : (
                            t('permanentlyDeleteAccount')
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setShowDeleteConfirmation(false)
                            setDeleteForm({ email: '', password: '' })
                            setDeleteError('')
                          }}
                          onMouseEnter={playHoverSound}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile
