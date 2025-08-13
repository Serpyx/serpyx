import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../hooks/useAuthStore'
import { useLanguage } from '../contexts/LanguageContext'

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('spx') // spx, coins, score
  const { user, selectedNFTCharacter } = useAuthStore()
  const { t } = useLanguage()

  // Manuel olarak kullanıcı verisini güncelle
  const updateUserData = () => {
    if (user) {
      const userKey = `serpyx-user-${user.username}`
      const existingData = localStorage.getItem(userKey)
      let userData = {}
      
      if (existingData) {
        try {
          userData = JSON.parse(existingData)
        } catch (e) {
          console.log('Error parsing existing data')
        }
      }
      
      // Mevcut veriyi koru, sadece spxBalance'ı güncelle
      const updatedData = {
        ...userData,
        username: user.username,
        coins: userData.coins || user.coins || 0,
        spxBalance: user.spxBalance || 95, // Manuel olarak 95 SPX ekle
        highScore: userData.highScore || user.highScore || 0,
        snakeColor: userData.snakeColor || user.snakeColor || '#22c55e',
        lastUpdated: new Date().toISOString()
      }
      
      localStorage.setItem(userKey, JSON.stringify(updatedData))
      console.log('Manually updated user data:', updatedData)
      
      // Sayfayı yenile
      window.location.reload()
    }
  }

  // Tüm localStorage verilerini temizle
  const clearAllUserData = () => {
    console.log('🧹 Leaderboard - Tüm kullanıcı verileri temizleniyor...')
    
    // TÜM localStorage'ı temizle
    localStorage.clear()
    sessionStorage.clear()
    
    console.log('🧹 Leaderboard - Tüm localStorage ve sessionStorage temizlendi!')
    window.location.reload()
  }

  // Get all users from localStorage
  const getAllUsers = () => {
    const users = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('serpyx-user-')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key))
          if (userData && userData.username) {
            // Debug için console.log ekleyelim
            console.log('Leaderboard - User data:', {
              username: userData.username,
              coins: userData.coins,
              spxBalance: userData.spxBalance,
              highScore: userData.highScore,
              totalScore: userData.totalScore,
              selectedNFTCharacter: userData.selectedNFTCharacter
            })
            
            users.push({
              username: userData.username,
              coins: userData.coins || 0,
              spxBalance: userData.spxBalance || 0,
              highScore: userData.highScore || 0,
              totalScore: userData.totalScore || 0,
              selectedNFTCharacter: userData.selectedNFTCharacter || null
            })
          }
        } catch (e) {
          console.log('Error parsing user data:', e)
        }
      }
    }
    
    // Debug için tüm kullanıcıları yazdıralım
    console.log('Leaderboard - All users:', users)
    

    
    return users
  }

  const allUsers = getAllUsers()
  
  // Sort users by different criteria
  const leaderboardData = {
    spx: allUsers
              .sort((a, b) => (b.coins + b.spxBalance * 100) - (a.coins + a.spxBalance * 100))
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        coins: user.coins,
        spxBalance: user.spxBalance,
        totalValue: user.coins + user.spxBalance * 100,
        score: user.highScore,
        totalScore: user.totalScore,
        avatar: user.avatar
      })),
    coins: allUsers
      .sort((a, b) => b.coins - a.coins)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        coins: user.coins,
        spxBalance: user.spxBalance,
        score: user.highScore,
        totalScore: user.totalScore,
        avatar: user.avatar
      })),
    score: allUsers
      .sort((a, b) => b.totalScore - a.totalScore) // Toplam skor ile sıralama
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        score: user.highScore,
        totalScore: user.totalScore, // Toplam skor
        coins: user.coins,
        spxBalance: user.spxBalance,
        avatar: user.avatar
      }))
  }

  const currentData = leaderboardData[activeTab]
  const userRank = user ? currentData.findIndex(player => player.username === user.username) + 1 : 0

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-400'
      case 2: return 'text-gray-300'
      case 3: return 'text-amber-600'
      default: return 'text-gray-400'
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getRankBg = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30'
      case 2: return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30'
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30'
      default: return 'bg-gray-800/50 border-gray-700/50'
    }
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
          <img src="/yazı.png" alt="Serpyx Yazı" className="h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">🏆 {t('leaderboardTitle')}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('leaderboardSubtitle')}
          </p>
          
          {/* Admin Panel - Sadece admin kullanıcılar için */}
          {user && (user.username === 'mustafa1.kara2' || user.username === 'admin') && (
            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={updateUserData}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                🔧 {t('updateSpxData')}
              </button>
              <button
                onClick={clearAllUserData}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                🗑️ {t('clearAllData')}
              </button>
              <button
                onClick={() => window.location.href = '/admin'}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
              >
                ⚙️ {t('adminPanel')}
              </button>
            </div>
          )}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
            <button
              onClick={() => setActiveTab('spx')}
              className={`px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center space-x-3 ${
                activeTab === 'spx'
                  ? 'bg-gradient-to-r from-snake-500 to-snake-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <img src="/spx.png" alt="SPX" className="w-6 h-6 rounded-full" />
              <span>{t('spxRanking')}</span>
            </button>
            <button
              onClick={() => setActiveTab('coins')}
              className={`px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center space-x-3 ${
                activeTab === 'coins'
                  ? 'bg-gradient-to-r from-snake-500 to-snake-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <img src="/coin.PNG" alt="Coin" className="w-6 h-6 rounded-full" />
              <span>{t('coinRanking')}</span>
            </button>
            <button
              onClick={() => setActiveTab('score')}
              className={`px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center space-x-3 ${
                activeTab === 'score'
                  ? 'bg-gradient-to-r from-snake-500 to-snake-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span className="text-2xl">🏆</span>
              <span>{t('scoreRanking')}</span>
            </button>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50 bg-gray-900/50">
                  <th className="text-left py-6 px-8 text-gray-400 font-bold text-lg">{t('rank')}</th>
                  <th className="text-left py-6 px-8 text-gray-400 font-bold text-lg">{t('player')}</th>
                  {activeTab === 'spx' && (
                    <th className="text-right py-6 px-8 text-gray-400 font-bold text-lg">
                      <div className="flex items-center justify-end space-x-3">
                        <img src="/spx.png" alt="SPX" className="w-6 h-6 rounded-full" />
                        <span>{t('totalValue')}</span>
                      </div>
                    </th>
                  )}
                  {activeTab === 'coins' && (
                    <th className="text-right py-6 px-8 text-gray-400 font-bold text-lg">
                      <div className="flex items-center justify-end space-x-3">
                        <img src="/coin.PNG" alt="Coin" className="w-6 h-6 rounded-full" />
                        <span>{t('coins')}</span>
                      </div>
                    </th>
                  )}
                  {activeTab === 'score' && (
                    <th className="text-right py-6 px-8 text-gray-400 font-bold text-lg">
                      <div className="flex items-center justify-end space-x-3">
                        <span className="text-2xl">🏆</span>
                        <span>{t('totalScore')}</span>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((player, index) => (
                    <motion.tr
                      key={player.username}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className={`border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-300 ${
                        player.username === user?.username ? 'bg-snake-500/10 border-snake-500/30' : ''
                      } ${getRankBg(player.rank)}`}
                    >
                      <td className="py-6 px-8">
                        <div className="flex items-center">
                          <span className={`text-2xl font-bold ${getRankColor(player.rank)}`}>
                            {getRankIcon(player.rank)}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-snake-400 to-snake-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-snake-500">
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
                                <span className="text-2xl">🐍</span>
                              );
                            })()}
                          </div>

                          <div>
                            <p className="font-bold text-white text-lg">
                              {player.username}
                              {player.username === user?.username && (
                                <span className="ml-3 text-xs bg-gradient-to-r from-snake-500 to-snake-600 text-white px-3 py-1 rounded-full font-bold">
                                  {t('you')}
                                </span>
                              )}
                            </p>
                            <p className="text-gray-400 text-sm">{t('playerNumber')}{player.rank}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <span className="font-bold text-2xl">
                          {activeTab === 'spx' && (
                            <span className="text-blue-400">{(player.totalValue || 0).toLocaleString()}</span>
                          )}
                          {activeTab === 'coins' && (
                            <span className="text-yellow-400">{player.coins.toLocaleString()}</span>
                          )}
                          {activeTab === 'score' && (
                            <span className="text-snake-400">{player.totalScore.toLocaleString()}</span>
                          )}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <td colSpan={activeTab === 'spx' ? 3 : activeTab === 'coins' ? 3 : 3} className="py-16 px-8 text-center">
                      <div className="text-gray-400">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="text-2xl font-bold mb-4">{t('noRankingData')}</p>
                        <p className="text-lg">{t('startPlayingFirst')}</p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* User Stats */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-snake-500/20 to-snake-600/20 backdrop-blur-sm rounded-2xl p-6 border border-snake-500/30 text-center">
                <h3 className="text-xl font-bold text-white mb-4">{t('yourRanking')}</h3>
                <p className="text-5xl font-bold text-snake-400">
                  {userRank > 0 ? `#${userRank}` : 'N/A'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 text-center">
                <h3 className="text-xl font-bold text-white mb-4">{t('totalValue')}</h3>
                <div className="flex items-center justify-center space-x-3">
                  <img src="/spx.png" alt="SPX" className="w-8 h-8 rounded-full" />
                  <p className="text-5xl font-bold text-blue-400">
                    {((user.coins || 0) + (user.spxBalance || 0) * 100).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 text-center">
                <h3 className="text-xl font-bold text-white mb-4">{t('totalCoins')}</h3>
                <div className="flex items-center justify-center space-x-3">
                  <img src="/coin.PNG" alt="Coin" className="w-8 h-8 rounded-full" />
                  <p className="text-5xl font-bold text-yellow-400">
                    {(user.coins || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 text-center">
                <h3 className="text-xl font-bold text-white mb-4">{t('highScore')}</h3>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-4xl">🏆</span>
                  <p className="text-5xl font-bold text-purple-400">
                    {(user.highScore || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* No User Message */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
              <div className="text-6xl mb-6">👤</div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('loginToSeeRanking')}</h3>
              <p className="text-gray-400 mb-8 text-lg">
                {t('loginToSeeRankingDesc')}
              </p>
              <a href="/login" className="btn-primary text-lg px-8 py-4">
                {t('login')}
              </a>
            </div>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">💡 {t('tipsForRanking')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
                <h4 className="font-bold text-blue-400 mb-4 text-lg flex items-center">
                  <img src="/spx.png" alt="SPX" className="w-6 h-6 mr-3 rounded-full" />
                  {t('increaseSpxValue')}
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <span className="text-blue-400 mr-2">•</span>
                    {t('convertCoinsToSpx')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-400 mr-2">•</span>
                    {t('playRegularly')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-400 mr-2">•</span>
                    {t('completeTasks')}
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-6 border border-yellow-500/20">
                <h4 className="font-bold text-yellow-400 mb-4 text-lg flex items-center">
                  <img src="/coin.PNG" alt="Coin" className="w-6 h-6 mr-3 rounded-full" />
                  {t('earnMoreCoins')}
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <span className="text-yellow-400 mr-2">•</span>
                    {t('dontMissBonusFood')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-400 mr-2">•</span>
                    {t('playLongTime')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-400 mr-2">•</span>
                    {t('moveFast')}
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
                <h4 className="font-bold text-purple-400 mb-4 text-lg flex items-center">
                  <span className="text-2xl mr-3">🏆</span>
                  {t('achieveHighScore')}
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <span className="text-purple-400 mr-2">•</span>
                    {t('actStrategically')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-400 mr-2">•</span>
                    {t('takeRisksButCareful')}
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-400 mr-2">•</span>
                    {t('collectBonusFood')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Leaderboard 