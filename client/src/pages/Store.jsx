import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../hooks/useAuthStore'
import { motion } from 'framer-motion'
import useAchievements from '../hooks/useAchievements'
import { useSound } from '../hooks/useSound'
import { NFT_CATEGORIES, NFT_QUALITY_COLORS, NFT_BACK_IMAGE } from '../data/nftData'
import { useLanguage } from '../contexts/LanguageContext'

const getColorCategories = (t) => [
  {
    name: t('classicColors'),
    price: 50,
    key: 'classic',
    colors: [
      { id: 'green', name: t('green'), color: '#22c55e' },
      { id: 'blue', name: t('blue'), color: '#3B82F6' },
      { id: 'red', name: t('red'), color: '#ef4444' },
      { id: 'black', name: t('black'), color: '#111827' },
      { id: 'white', name: t('white'), color: '#f3f4f6', border: '#222' },
    ]
  },
  {
    name: t('pastelColors'),
    price: 150,
    key: 'pastel',
    colors: [
      { id: 'pastel-blue', name: t('pastelBlue'), color: '#93c5fd' },
      { id: 'pastel-pink', name: t('pastelPink'), color: '#f9a8d4' },
      { id: 'lavender', name: t('lavender'), color: '#c4b5fd' },
      { id: 'cream', name: t('cream'), color: '#fef3c7' },
      { id: 'pastel-green', name: t('pastelGreen'), color: '#86efac' },
    ]
  },
  {
    name: t('neonColors'),
    price: 400,
    key: 'neon',
    colors: [
      { id: 'neon-green', name: t('neonGreen'), color: '#39ff14' },
      { id: 'neon-pink', name: t('neonPink'), color: '#ff4da6' },
      { id: 'neon-blue', name: t('neonBlue'), color: '#00e6ff' },
      { id: 'neon-orange', name: t('neonOrange'), color: '#ff9900' },
      { id: 'neon-purple', name: t('neonPurple'), color: '#d500f9' },
    ]
  },
  {
    name: t('specialColors'),
    price: 1000,
    key: 'special',
    colors: [
      { id: 'gold', name: t('goldColor'), color: '#FFD700' },
      { id: 'turquoise', name: t('turquoise'), color: '#06b6d4' },
      { id: 'gradient1', name: t('rainbow'), color: 'linear-gradient(90deg,#f43f5e,#f59e42,#fef08a,#22c55e,#3B82F6,#a21caf)' },
      { id: 'gradient2', name: t('sunset'), color: 'linear-gradient(90deg,#f59e42,#fef08a,#a21caf)' },
      { id: 'platinum', name: t('platinum'), color: '#e5e7eb', border: '#aaa' },
    ]
  }
]

const THEME_CATEGORIES = [
  {
    name: 'Klasik Temalar',
    price: 200,
    key: 'classic_themes',
    themes: [
      { 
        id: 'forest', 
        name: 'Orman Teması', 
        background: 'linear-gradient(135deg, #1a5f1a, #2d5a2d, #1a5f1a)',
        description: 'Yeşil orman atmosferi',
        preview: '🌲'
      },
      { 
        id: 'ocean', 
        name: 'Okyanus Teması', 
        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6, #1e3a8a)',
        description: 'Mavi okyanus dalgaları',
        preview: '🌊'
      },
      { 
        id: 'desert', 
        name: 'Çöl Teması', 
        background: 'linear-gradient(135deg, #d97706, #f59e0b, #d97706)',
        description: 'Sıcak çöl kumları',
        preview: '🏜️'
      },
      { 
        id: 'night', 
        name: 'Gece Teması', 
        background: 'linear-gradient(135deg, #1f2937, #374151, #1f2937)',
        description: 'Karanlık gece gökyüzü',
        preview: '🌙'
      },
      { 
        id: 'sunset', 
        name: 'Gün Batımı', 
        background: 'linear-gradient(135deg, #f59e0b, #ef4444, #f59e0b)',
        description: 'Turuncu gün batımı',
        preview: '🌅'
      }
    ]
  },
  {
    name: 'Neon Temalar',
    price: 500,
    key: 'neon_themes',
    themes: [
      { 
        id: 'cyberpunk', 
        name: 'Cyberpunk', 
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        description: 'Futuristik neon atmosfer',
        preview: '🤖'
      },
      { 
        id: 'synthwave', 
        name: 'Synthwave', 
        background: 'linear-gradient(135deg, #ff0080, #7928ca, #ff0080)',
        description: '80\'ler synthwave stili',
        preview: '🎸'
      },
      { 
        id: 'matrix', 
        name: 'Matrix', 
        background: 'linear-gradient(135deg, #00ff00, #003300, #00ff00)',
        description: 'Yeşil matrix kodu',
        preview: '💻'
      },
      { 
        id: 'neon_pink', 
        name: 'Neon Pembe', 
        background: 'linear-gradient(135deg, #ff1493, #ff69b4, #ff1493)',
        description: 'Parlak neon pembe',
        preview: '💖'
      },
      { 
        id: 'electric_blue', 
        name: 'Elektrik Mavi', 
        background: 'linear-gradient(135deg, #00bfff, #1e90ff, #00bfff)',
        description: 'Elektrik mavi parıltısı',
        preview: '⚡'
      }
    ]
  },
  {
    name: 'Özel Temalar',
    price: 1000,
    key: 'special_themes',
    themes: [
      { 
        id: 'galaxy', 
        name: 'Galaksi', 
        background: 'linear-gradient(135deg, #4c1d95, #7c3aed, #4c1d95)',
        description: 'Uzay galaksisi',
        preview: '🌌'
      },
      { 
        id: 'aurora', 
        name: 'Kutup Işıkları', 
        background: 'linear-gradient(135deg, #00ff88, #00bfff, #ff69b4)',
        description: 'Kuzey ışıkları',
        preview: '✨'
      },
      { 
        id: 'fire', 
        name: 'Ateş', 
        background: 'linear-gradient(135deg, #ff4500, #ff6347, #ff4500)',
        description: 'Sıcak ateş alevleri',
        preview: '🔥'
      },
      { 
        id: 'ice', 
        name: 'Buz', 
        background: 'linear-gradient(135deg, #87ceeb, #b0e0e6, #87ceeb)',
        description: 'Soğuk buz kristalleri',
        preview: '❄️'
      },
      { 
        id: 'rainbow', 
        name: 'Gökkuşağı', 
        background: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
        description: 'Renkli gökkuşağı',
        preview: '🌈'
      }
    ]
  }
]

const getInitialUnlocked = (username) => {
  const data = localStorage.getItem(`unlockedColors-${username}`)
  if (data) return JSON.parse(data)
  // Başlangıçta sadece klasik yeşil açık
  return { classic: ['green'] }
}

const getInitialUnlockedThemes = (username) => {
  const data = localStorage.getItem(`unlockedThemes-${username}`)
  if (data) return JSON.parse(data)
  // Başlangıçta hiç tema açık değil
  return {}
}

const Store = () => {
  const { 
    coins, 
    updateCoins, 
    snakeColor, 
    updateSnakeColor, 
    user,
    spxBalance,
    updateSpxBalance,
    purchaseNFT,
    ownedNFTs,
    ownsNFT,
    initializeGlobalNFTCounts,
    getNFTRemainingCount,
  resetGlobalNFTCounts,

  } = useAuthStore()
  const { playButtonClick, playHoverSound } = useSound()
  const { t } = useLanguage()
  
  const COLOR_CATEGORIES = getColorCategories(t)
  
  
  const [unlocked, setUnlocked] = useState(getInitialUnlocked(user?.username))
  const [unlockedThemes, setUnlockedThemes] = useState(getInitialUnlockedThemes(user?.username))
  const [activeTab, setActiveTab] = useState('colors') // 'colors', 'themes'
  const [message, setMessage] = useState('')
  const { updateStats } = useAchievements()

  // Kullanıcı değiştiğinde verileri yeniden yükle
  useEffect(() => {
    if (user?.username) {
      setUnlocked(getInitialUnlocked(user.username))
    }
  }, [user?.username])

  // Global NFT adetlerini başlat
  useEffect(() => {
    initializeGlobalNFTCounts();
  }, [initializeGlobalNFTCounts])

  useEffect(() => {
    if (user?.username) {
      localStorage.setItem(`unlockedColors-${user.username}`, JSON.stringify(unlocked))
    }
  }, [unlocked, user?.username])

  useEffect(() => {
    if (user?.username) {
      localStorage.setItem(`unlockedThemes-${user.username}`, JSON.stringify(unlockedThemes))
    }
  }, [unlockedThemes, user?.username])

  const handleUnlock = (catKey, price) => {
    // Kategoride açılmamış renkleri bul
    const category = COLOR_CATEGORIES.find(c => c.key === catKey)
    const lockedColors = category.colors.filter(c => !(unlocked[catKey] || []).includes(c.id))
    if (lockedColors.length === 0) {
      setMessage(t('noMoreColorsInCategory'))
      return
    }
    if (coins < price) {
      setMessage(t('insufficientCoins'))
      return
    }
    // Rastgele bir renk aç
    const random = lockedColors[Math.floor(Math.random() * lockedColors.length)]
    setUnlocked(prev => ({
      ...prev,
      [catKey]: [...(prev[catKey] || []), random.id]
    }))
    updateCoins(coins - price)
          setMessage(`🎨 ${random.name} ${t('colorUnlocked')}!`)
    
    // İstatistikleri güncelle - toplam açılan renk sayısını hesapla
    const totalUnlockedColors = Object.values(unlocked).flat().length + 1 // +1 yeni açılan renk
    updateStats({
      colorsUnlocked: totalUnlockedColors
    })
    
    setTimeout(() => setMessage(''), 3000)
  }

  const handleUnlockTheme = (catKey, price) => {
    setMessage(t('themeSystemDisabled'))
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSelect = (catKey, colorId) => {
    const category = COLOR_CATEGORIES.find(c => c.key === catKey)
    const color = category.colors.find(c => c.id === colorId)
    if (color) {
      // Gradient renkler ve özel renkler için ID'yi gönder
      if (color.id === 'gradient1' || color.id === 'gradient2' || color.id === 'gold' || color.id === 'platinum' || color.id === 'turquoise') {
        updateSnakeColor(color.id) // ID'yi gönder, color değil
      } else {
        updateSnakeColor(color.color) // Hex kodunu gönder
      }
      setMessage(`🎨 ${color.name} ${t('colorSelected')}!`)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleSelectTheme = (catKey, themeId) => {
    setMessage('Tema sistemi geçici olarak devre dışı!')
    setTimeout(() => setMessage(''), 3000)
  }



  // Legendary NFT'lerin arka plan renklerini belirle
  const getNFTBackgroundColor = (nftId) => {
    const backgroundColors = {
      'thalmyra': '#8B4513', // Orange-brown
      'zarynthos': '#4B0082', // Dark purple
      'umbrelith': '#654321', // Dark brown
      'seraphyx': '#008080', // Dark teal
      'ignivore': '#87CEEB', // Light blue
      'velmora': '#006400', // Dark green
      'sylvaran': '#228B22', // Forest green
      'drakoryn': '#9ACD32', // Yellow-green
      'nyxshade': '#191970', // Midnight blue
      'aetherion': '#800080' // Purple
    };
    return backgroundColors[nftId] || '#1F2937';
  }

  const handlePurchaseNFT = (nftId, quality, price) => {
    const result = purchaseNFT(nftId, quality, price);
    if (result.success) {
      setMessage(`🎉 ${result.message}`);
      playButtonClick();
    } else {
      setMessage(`❌ ${result.message}`);
    }
    setTimeout(() => setMessage(''), 3000);
  }



  // Test amaçlı NFT satın alma
  const handleTestPurchase = () => {
    console.log('Store - Test NFT purchase started');
    const result = purchaseNFT('citrus_curl', 'common', 100);
    console.log('Store - Test NFT purchase result:', result);
    if (result.success) {
      setMessage(`🎉 Test NFT satın alındı: ${result.message}`);
      playButtonClick();
    } else {
      setMessage(`❌ ${result.message}`);
    }
    setTimeout(() => setMessage(''), 3000);
  }

  // Debug fonksiyonu
  const handleDebug = () => {
    const owned = ownedNFTs;
    console.log('Debug - Owned NFTs:', owned);
    console.log('Debug - User:', user);
    console.log('Debug - SPX Balance:', spxBalance);
    
    // localStorage'dan da kontrol et
    if (user?.username) {
      const userKey = `serpyx-user-${user.username}`;
      const userData = localStorage.getItem(userKey);
      console.log('Debug - localStorage user data:', userData ? JSON.parse(userData) : 'Not found');
    }
    
    setMessage(`🔍 Debug: Sahip olunan NFT: ${owned.length} adet`);
    setTimeout(() => setMessage(''), 5000);
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Reklam Alanları - Sol ve Sağ */}
      <div className="hidden xl:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-10">
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
      
      <div className="hidden xl:flex fixed right-4 top-1/2 transform -translate-y-1/2 z-10">
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
      
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
          <img src="/serpyx-logo.png" alt="Serpyx Logo" className="h-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">🛍️ {t('storeTitle')}</h1>
          <p className="text-xl text-gray-400">{t('storeDescription')}</p>
        </motion.div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <div className="inline-block bg-green-500/20 border border-green-500/30 rounded-xl px-6 py-3">
              <span className="text-green-400 font-semibold">{message}</span>
            </div>
          </motion.div>
        )}

        {/* Bakiye Kartları */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Coin Bakiyesi */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-center space-x-3">
              <img src="/coin.PNG" alt="Coin" className="w-8 h-8 rounded-full" />
              <div>
                <h3 className="text-white font-bold text-lg">{t('coinBalance')}</h3>
                <p className="text-yellow-400 font-bold text-2xl">{coins}</p>
              </div>
            </div>
          </div>
            
            {/* SPX Bakiyesi */}
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <div className="flex items-center justify-center space-x-3">
                <img src="/spx.png" alt="SPX" className="w-8 h-8 rounded-full" />
                <div>
                  <h3 className="text-white font-bold text-lg">{t('spxBalance')}</h3>
                  <p className="text-blue-400 font-bold text-2xl">{spxBalance}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Test Butonu */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center space-x-4"
        >
          <button
            onClick={handleTestPurchase}
            onMouseEnter={playHoverSound}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
          >
            🧪 {t('testNFTPurchase')} (Citrus Curl)
          </button>
          <button
            onClick={handleDebug}
            onMouseEnter={playHoverSound}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            🔍 {t('debugNFTCount')}
          </button>
        </motion.div>



        {/* Tab Menüsü */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setActiveTab('colors')
                playButtonClick()
              }}
              onMouseEnter={playHoverSound}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'colors' 
                  ? 'bg-gradient-to-r from-snake-500 to-snake-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🎨 {t('colors')}
            </button>
            <button
              onClick={() => {
                setActiveTab('themes')
                playButtonClick()
              }}
              onMouseEnter={playHoverSound}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'themes' 
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🔒 {t('themes')} ({t('locked')})
            </button>
            <button
              onClick={() => {
                setActiveTab('nfts')
                playButtonClick()
              }}
              onMouseEnter={playHoverSound}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'nfts' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🖼️ {t('nfts')}
            </button>

          </div>
        </motion.div>

        {activeTab === 'colors' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {COLOR_CATEGORIES.map(category => (
              <div key={category.key} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                  <div className="flex items-center space-x-3">
                    <img src="/coin.PNG" alt="Coin" className="w-6 h-6 rounded-full" />
                    <span className="text-yellow-400 font-bold text-lg">{category.price}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {category.colors.map(color => {
                    const isUnlocked = (unlocked[category.key] || []).includes(color.id)
                    // Gradient renkler için özel karşılaştırma
                    const isSelected = color.id === 'gradient1' || color.id === 'gradient2' 
                      ? snakeColor === color.id 
                      : snakeColor === color.color
                    
                    return (
                      <motion.div
                        key={color.id}
                        className={`relative rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'border-snake-400 bg-snake-500/20' 
                            : isUnlocked 
                              ? 'border-gray-600 bg-gray-700/50 hover:border-gray-500' 
                              : 'border-gray-700 bg-gray-800/50 opacity-50'
                        }`}
                        whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                        onClick={() => {
                          if (isUnlocked) {
                            handleSelect(category.key, color.id)
                            playButtonClick()
                          }
                        }}
                        onMouseEnter={isUnlocked ? playHoverSound : undefined}
                      >
                        <div 
                          className="w-full h-16 rounded-lg mb-3"
                          style={{ 
                            background: color.color,
                            border: color.border ? `2px solid ${color.border}` : 'none'
                          }}
                        />
                        <p className="text-white text-sm font-medium text-center">{color.name}</p>
                        {isSelected && (
                          <div className="absolute top-2 right-2 text-snake-400 text-xl">✓</div>
                        )}
                        {!isUnlocked && (
                          <div className="absolute top-2 right-2 text-gray-400 text-xl">🔒</div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => {
                    handleUnlock(category.key, category.price)
                    playButtonClick()
                  }}
                  onMouseEnter={playHoverSound}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                >
                  🎲 {t('randomColorUnlock')} ({category.price} {t('coins')})
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'themes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {THEME_CATEGORIES.map(category => (
              <div key={category.key} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-400">{category.name} ({t('locked')})</h2>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-bold text-lg">🔒</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {category.themes.map(theme => {
                    const isUnlocked = false // Tema sistemi kilitli
                    const isSelected = false // Tema sistemi kilitli
                    
                    return (
                      <motion.div
                        key={theme.id}
                        className="relative rounded-xl p-4 border-2 transition-all duration-300 cursor-not-allowed border-gray-600 bg-gray-800/50 opacity-60 pointer-events-none"
                        whileHover={{ scale: 1 }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setMessage(t('themeSystemDisabled'))
                          setTimeout(() => setMessage(''), 3000)
                        }}
                        onMouseEnter={undefined}
                        onMouseDown={(e) => e.preventDefault()}
                        onTouchStart={(e) => e.preventDefault()}
                      >
                        <div 
                          className="w-full h-16 rounded-lg mb-3"
                          style={{ 
                            background: theme.background,
                            border: theme.background.includes('gradient') ? 'none' : 'none'
                          }}
                        />
                        <p className="text-white text-sm font-medium text-center">{theme.name}</p>
                        <div className="absolute top-2 right-2 text-gray-400 text-xl">🔒</div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                          <div className="text-center">
                            <div className="text-gray-400 text-xs font-medium">{t('locked').toUpperCase()}</div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setMessage(t('themeSystemDisabled'))
                    setTimeout(() => setMessage(''), 3000)
                  }}
                  onMouseEnter={undefined}
                  onMouseDown={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-gray-300 py-4 rounded-xl font-bold cursor-not-allowed opacity-70 border border-gray-500 pointer-events-none"
                  disabled
                >
                  🔒 {t('themeSystemLocked')}
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'nfts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {NFT_CATEGORIES.map(category => (
              <div key={category.key} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-600">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{category.name}</h2>
                    <p className="text-gray-400">{t('specialSnakeCharacters')}</p>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-500">
                    <img src="/spx.png" alt="SPX" className="w-6 h-6 rounded-full" />
                    <span className="text-blue-400 font-bold text-lg">{category.price} SPX</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-6">
                  {category.nfts.map(nft => {
                    const isOwned = ownsNFT(nft.id);
                    const colors = NFT_QUALITY_COLORS[category.key];
                    
                    return (
                      <motion.div
                        key={nft.id}
                        className={`relative rounded-xl p-4 border-2 transition-all duration-300 backdrop-blur-sm ${
                          isOwned 
                            ? 'border-green-400 bg-green-500/20 cursor-pointer shadow-lg shadow-green-500/20' 
                            : getNFTRemainingCount(nft.id) > 0
                              ? 'border-gray-600 bg-gray-700/50 hover:border-gray-500 hover:bg-gray-600/50 cursor-pointer shadow-lg hover:shadow-xl'
                              : 'border-red-400 bg-red-500/20 cursor-not-allowed opacity-50'
                        }`}
                        whileHover={{ scale: isOwned || getNFTRemainingCount(nft.id) > 0 ? 1.05 : 1, y: isOwned || getNFTRemainingCount(nft.id) > 0 ? -5 : 0 }}
                        onClick={() => {
                          if (getNFTRemainingCount(nft.id) > 0 && !isOwned) {
                            handlePurchaseNFT(nft.id, category.key, category.price);
                            playButtonClick();
                          }
                        }}
                        onMouseEnter={isOwned || getNFTRemainingCount(nft.id) > 0 ? playHoverSound : undefined}
                      >
                        {/* NFT Kartı - Arka Yüzü */}
                        <div className={`relative w-full rounded-xl mb-3 overflow-hidden shadow-2xl ${
                          category.key === 'legendary' || category.key === 'mythic' ? 'h-64' : 'h-56'
                        }`}>
                          {isOwned ? (
                            // Sahip olunan NFT - Ön yüzü göster
                            <img 
                              src={nft.image} 
                              alt={nft.name}
                              className={`w-full h-full rounded-lg ${
                                category.key === 'legendary' || category.key === 'mythic'
                                  ? 'object-cover' 
                                  : 'object-contain bg-gray-900'
                              }`}
                            />
                          ) : (
                             // Sahip olunmayan NFT - Arka yüzü göster
                             <div className={`w-full h-full rounded-lg flex items-center justify-center border-2 ${colors.border} overflow-hidden`}>
                               <img 
                                 src={NFT_BACK_IMAGE} 
                                 alt="NFT Back"
                                 className="w-full h-full object-cover"
                               />
                             </div>
                           )}
                          
                          {/* Kalite Badge - Daha küçük ve daha az yer kaplayan */}
                          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm z-10 ${
                            category.key === 'common' ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border border-gray-400' :
                            category.key === 'rare' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-400' :
                            category.key === 'legendary' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border border-purple-400' :
                            'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border border-yellow-400'
                          }`}>
                            {category.key === 'common' ? 'COMMON' :
                             category.key === 'rare' ? 'RARE' :
                             category.key === 'legendary' ? 'LEGENDARY' :
                             'MYTHIC'}
                          </div>
                          
                          {/* Sahip olma durumu */}
                          {isOwned && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border border-green-400 z-10">
                              <span className="text-green-100 text-sm font-bold">✓</span>
                            </div>
                          )}



                          {/* Tükenmiş badge */}
                          {!isOwned && getNFTRemainingCount(nft.id) <= 0 && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg border border-red-400 z-10">
                              <span className="text-red-100 text-sm font-bold">×</span>
                            </div>
                          )}
                        </div>
                        
                        <p className={`text-sm font-medium text-center mb-2 ${isOwned ? 'text-green-200' : 'text-white'}`}>
                          {nft.name}
                        </p>
                        
                        {/* Kalan adet bilgisi */}
                        {!isOwned && getNFTRemainingCount(nft.id) > 0 && (
                          <p className="text-xs text-gray-400 text-center mb-2">
                            {nft.id === 'ashstripe' ? (
                              <span className="text-green-400 font-bold">ÜCRETSİZ</span>
                            ) : (
                              `${t('remaining')}: ${getNFTRemainingCount(nft.id)} ${t('pieces')}`
                            )}
                          </p>
                        )}
                        
                        {/* Sahip olunan NFT mesajı */}
                        {isOwned && nft.id === 'ashstripe' && (
                          <p className="text-xs text-green-400 text-center mb-2 font-bold">
                            ZATEN SAHİPSİN
                          </p>
                        )}

                        {/* Tükenmiş mesajı */}
                        {!isOwned && getNFTRemainingCount(nft.id) <= 0 && (
                          <p className="text-xs text-red-400 text-center mb-2">
                            {t('soldOut')}
                          </p>
                        )}
                        
                        {!isOwned && getNFTRemainingCount(nft.id) > 0 && (
                          <div className="flex items-center justify-center space-x-2 mt-3 p-2 bg-gray-800/50 rounded-lg border border-gray-600">
                            {nft.id === 'ashstripe' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (!isOwned) {
                                    handlePurchaseNFT(nft.id, category.key, 0)
                                    playButtonClick()
                                  }
                                }}
                                onMouseEnter={!isOwned ? playHoverSound : undefined}
                                className={`w-full px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                                  isOwned 
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                                }`}
                                disabled={isOwned}
                              >
                                {isOwned ? 'ZATEN SAHİPSİN' : 'ÜCRETSİZ AL'}
                              </button>
                            ) : (
                              <>
                                <img src="/spx.png" alt="SPX" className="w-5 h-5 rounded-full" />
                                <span className={`text-sm font-bold ${colors.price}`}>{category.price} SPX</span>
                              </>
                            )}
                          </div>
                        )}
                        
                          
                      </motion.div>
                    )
                  })}
                </div>
                
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center justify-center mb-3">
                    <h3 className="text-white font-bold text-lg">{t('remainingQuantities')}</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {category.nfts.map(nft => {
                      const remainingCount = getNFTRemainingCount(nft.id);
                      const percentage = (remainingCount / category.maxSupply) * 100;
                      
                      // Renk belirleme
                      let colorClass = 'text-green-400';
                      if (percentage <= 10) colorClass = 'text-red-400';
                      else if (percentage <= 25) colorClass = 'text-yellow-400';
                      else if (percentage <= 50) colorClass = 'text-orange-400';
                      
                      return (
                        <div key={nft.id} className="bg-gray-700/30 rounded-lg p-2 border border-gray-500">
                          <div className="text-center">
                            <p className="text-white text-xs font-medium mb-1 truncate">{nft.name}</p>
                            <div className="flex items-center justify-center space-x-1">
                              <span className={`text-sm font-bold ${colorClass}`}>
                                {remainingCount.toLocaleString()}
                              </span>
                              <span className="text-gray-400 text-xs">/ {category.maxSupply.toLocaleString()}</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                              <div 
                                className={`h-1 rounded-full transition-all duration-300 ${
                                  percentage <= 10 ? 'bg-red-500' :
                                  percentage <= 25 ? 'bg-yellow-500' :
                                  percentage <= 50 ? 'bg-orange-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  )
}

export default Store