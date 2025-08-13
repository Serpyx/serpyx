import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../hooks/useAuthStore'
import { useSound } from '../hooks/useSound'
import useDailyTasks from '../hooks/useDailyTasks'
import useAchievements from '../hooks/useAchievements'
import { useLanguage } from '../contexts/LanguageContext'


const Dashboard = () => {
  const { user, coins, highScore, snakeColor, spxBalance, convertCoinsToSpx, updateCoins, updateSpxBalance, addTestSpx, selectedNFTCharacter } = useAuthStore()
  const { playButtonClick, playHoverSound } = useSound()
  const { getActiveTasks, getCompletedTasks, getTotalReward } = useDailyTasks()
  const { getUnlockedAchievements, getTotalReward: getAchievementReward } = useAchievements()
  const { t } = useLanguage()

  
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [convertAmount, setConvertAmount] = useState(1000)
  const [convertError, setConvertError] = useState('')

  // Liderlik tablosu gerçek verisi
  const getAllUsers = () => {
    const users = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('serpyx-user-')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key))
          if (userData && userData.username) {
            users.push({
              username: userData.username,
              coins: userData.coins || 0,
              highScore: userData.highScore || 0,
              selectedNFTCharacter: userData.selectedNFTCharacter || null
            })
          }
        } catch (e) {}
      }
    }
    return users
  }
  
  const leaderboard = getAllUsers()
    .sort((a, b) => b.coins - a.coins)
    .slice(0, 5)

  // İstatistikler
  const stats = [
    {
      title: t('totalCoins'),
      value: coins || 0,
      icon: '/coin.PNG',
      color: 'text-yellow-400',
      bgColor: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-500/30',
      isImage: true
    },
    {
      title: t('spxBalance'),
      value: spxBalance || 0,
      icon: '/spx.png',
      color: 'text-blue-400',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      isImage: true
    },
    {
      title: t('highScore'),
      value: highScore || 0,
      icon: '🏆',
      color: 'text-snake-400',
      bgColor: 'bg-gradient-to-br from-snake-500/20 to-snake-600/20',
      borderColor: 'border-snake-500/30'
    },

  ]



  const handleConvertCoins = () => {
    const currentCoins = coins || 0
    
    // Validasyon
    if (convertAmount < 1000) {
      setConvertError(t('minimumRequired'))
      return
    }
    
    if (convertAmount > currentCoins) {
      setConvertError(t('insufficientCoins'))
      return
    }
    
    if (convertAmount % 100 !== 0) {
      setConvertError(t('mustBeMultiples'))
      return
    }
    
    // Dönüştürme işlemi
    const spxToAdd = Math.floor(convertAmount / 100)
    const newCoins = currentCoins - convertAmount
    const newSpx = (spxBalance || 0) + spxToAdd
    
    // useAuthStore'u güncelle
    updateCoins(newCoins)
    updateSpxBalance(newSpx)
    
    setShowConvertModal(false)
    setConvertAmount(1000)
    setConvertError('')
    playButtonClick()
  }

  const handleConvertAmountChange = (value) => {
    const numValue = parseInt(value) || 0
    setConvertAmount(Math.max(100, Math.min(currentCoins, numValue)))
    setConvertError('')
  }

  const handleAddTestSpx = () => {
    const result = addTestSpx(1000)
    if (result.success) {
      alert(t('spxAdded'))
    }
  }



  const quickConvertAmounts = [100, 200, 500, 1000]

  // Güvenli veri alma fonksiyonları
  const getActiveTasksSafe = () => {
    try {
      return getActiveTasks() || []
    } catch (e) {
      console.log('Error getting active tasks:', e)
      return []
    }
  }

  const getUnlockedAchievementsSafe = () => {
    try {
      return getUnlockedAchievements() || []
    } catch (e) {
      console.log('Error getting unlocked achievements:', e)
      return []
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-slate-900/50">
      {/* Reklam Alanları - Sol ve Sağ */}
      <div className="hidden xl:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-10">
        <div className="ad-placeholder-left">
          <div className="ad-content">
            <div className="ad-icon">
              <span>📱</span>
            </div>
            <p className="ad-title">{t('adArea')}</p>
            <p className="ad-size">{t('adSize')}</p>
            <small className="ad-note">{t('adNote')}</small>
          </div>
        </div>
      </div>
      
      <div className="hidden xl:flex fixed right-4 top-1/2 transform -translate-y-1/2 z-10">
        <div className="ad-placeholder-right">
          <div className="ad-content">
            <div className="ad-icon">
              <span>📱</span>
            </div>
            <p className="ad-title">{t('adArea')}</p>
            <p className="ad-size">{t('adSize')}</p>
            <small className="ad-note">{t('adNote')}</small>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
                          <img src="/yazı.png" alt="Serpyx Yazı" className="h-20 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
                          {t('welcomeMessage')}, <span className="text-snake-400">{user?.username || t('player')}</span>! <img src="/yazı.png" alt="Serpyx" className="inline-block h-12 w-auto ml-2" />
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('dashboardDescription')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${stat.borderColor} text-center`}
            >
              <div className="flex items-center justify-center mb-4">
                {stat.isImage ? (
                  <img src={stat.icon} alt={stat.title} className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="text-3xl">{stat.icon}</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{stat.title}</h3>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stat.value.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {/* Coin to SPX Converter */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{t('coinToSpx')}</h3>
              <span className="text-2xl">💱</span>
            </div>
            <p className="text-gray-300 mb-4">
              {t('convertRate')}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-purple-400 font-bold">
                {Math.floor((coins || 0) / 100)} SPX
              </span>
              <button
                onClick={() => setShowConvertModal(true)}
                disabled={(coins || 0) < 100}
                className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
                  (coins || 0) >= 100 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t('convert')}
              </button>
            </div>
          </div>

          {/* Test SPX Button */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{t('testSpx')}</h3>
              <span className="text-2xl">🧪</span>
            </div>
            <p className="text-gray-300 mb-4">
              {t('addTestSpxDesc')}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-bold">
                {t('current')}: {spxBalance || 0} SPX
              </span>
              <button
                onClick={handleAddTestSpx}
                className="px-6 py-2 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg"
              >
                {t('add1000Spx')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Tasks */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{t('dailyTasks')}</h3>
              <Link 
                to="/tasks" 
                className="text-snake-400 hover:text-snake-300 transition-colors"
                onMouseEnter={playHoverSound}
              >
                {t('seeAll')} →
              </Link>
            </div>
            <div className="space-y-4">
              {getActiveTasksSafe().slice(0, 3).map((task, index) => (
                <div key={task.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <span className="text-sm text-gray-400">
                      {task.progress || 0}/{task.target}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-snake-400 to-snake-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(((task.progress || 0) / task.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {getActiveTasksSafe().length === 0 && (
                <p className="text-gray-400 text-center py-4">{t('allTasksCompleted')}</p>
              )}
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{t('recentAchievements')}</h3>
              <Link 
                to="/tasks" 
                className="text-snake-400 hover:text-snake-300 transition-colors"
                onMouseEnter={playHoverSound}
              >
                {t('seeAll')} →
              </Link>
            </div>
            <div className="space-y-4">
              {getUnlockedAchievementsSafe().slice(0, 3).map((achievement, index) => (
                <div key={achievement.id} className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-4 border border-yellow-500/20">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{achievement.title}</h4>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                    <span className="text-yellow-400 font-bold">+{achievement.reward}</span>
                  </div>
                </div>
              ))}
              {getUnlockedAchievementsSafe().length === 0 && (
                <p className="text-gray-400 text-center py-4">{t('noAchievementsYet')}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{t('leaderboard')}</h3>
              <Link 
                to="/leaderboard" 
                className="text-snake-400 hover:text-snake-300 transition-colors"
                onMouseEnter={playHoverSound}
              >
                {t('seeAll')} →
              </Link>
            </div>
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div key={player.username} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-snake-400 to-snake-600 rounded-full flex items-center justify-center overflow-hidden border border-snake-500">
                      {(() => {
                        // Mevcut kullanıcı için Zustand store'dan, diğerleri için localStorage'dan al
                        let nftData = player.selectedNFTCharacter;
                        if (player.username === user?.username) {
                          nftData = selectedNFTCharacter;
                        }
                        
                        return nftData ? (
                          <img 
                            src={nftData.image} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            style={{ objectPosition: 'center 30%' }}
                          />
                        ) : (
                          <span className="text-sm">🐍</span>
                        );
                      })()}
                    </div>

                    <div>
                      <p className="font-medium text-white">{player.username}</p>
                      <p className="text-sm text-gray-400">{player.coins} coin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-snake-400 font-bold">{player.highScore}</p>
                    <p className="text-xs text-gray-400">{t('highestScore')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Convert Modal */}
        {showConvertModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-700 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">{t('convertCoinsToSpx')}</h3>
              
              {/* Mevcut Coin Bilgisi */}
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{t('currentCoins')}</span>
                  <span className="text-yellow-400 font-bold">{(coins || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-400">{t('spxToConvert')}</span>
                  <span className="text-blue-400 font-bold">{Math.floor(convertAmount / 100)}</span>
                </div>
              </div>

              {/* Hızlı Seçim Butonları */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-3">{t('quickSelection')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickConvertAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        if (amount <= (coins || 0)) {
                          setConvertAmount(amount)
                          setConvertError('')
                        }
                      }}
                      disabled={amount > (coins || 0)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        convertAmount === amount
                          ? 'bg-purple-600 text-white'
                          : amount <= (coins || 0)
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {amount.toLocaleString()} Coin
                    </button>
                  ))}
                </div>
              </div>

              {/* Manuel Giriş */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">{t('manualEntry')}</label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => handleConvertAmountChange(e.target.value)}
                  min="100"
                  max={coins || 0}
                  step="100"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="100, 200, 300..."
                />
                <p className="text-xs text-gray-500 mt-2">{t('mustBeMultiple')}</p>
              </div>

              {/* Hata Mesajı */}
              {convertError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{convertError}</p>
                </div>
              )}

              {/* Butonlar */}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowConvertModal(false)
                    setConvertAmount(100)
                    setConvertError('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleConvertCoins}
                  disabled={convertAmount < 100 || convertAmount > (coins || 0) || convertAmount % 100 !== 0}
                  className={`flex-1 px-4 py-2 rounded-xl font-bold transition-all ${
                    convertAmount >= 100 && convertAmount <= (coins || 0) && convertAmount % 100 === 0
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {t('convert')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 