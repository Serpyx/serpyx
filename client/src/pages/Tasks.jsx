import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../hooks/useAuthStore'
import useDailyTasks from '../hooks/useDailyTasks'
import useDailyBonus from '../hooks/useDailyBonus'
import useAchievements from '../hooks/useAchievements'
import { useLanguage } from '../contexts/LanguageContext'

const Tasks = () => {
  const { coins, updateCoins, spxBalance } = useAuthStore()
  const { t } = useLanguage()
  const { 
    tasks, 
    updateTaskProgress, 
    claimTaskReward, 
    getActiveTasks, 
    getCompletedTasks,
    getClaimedTasks,
    getTotalReward 
  } = useDailyTasks()
  
  const { 
    canClaim, 
    streakDays, 
    claimDailyBonus, 
    getBonusAmount, 
    getSpecialBonus,
    getNextBonusTime 
  } = useDailyBonus()
  
  const { 
    achievements, 
    unlockedAchievements, 
    claimedAchievements,
    stats, 
    claimAchievementReward,
    getLockedAchievements,
    getUnlockedAchievements,
    getClaimedAchievements,
    getTotalReward: getAchievementReward
  } = useAchievements()

  const [activeTab, setActiveTab] = useState('daily')
  const [message, setMessage] = useState('')

  const handleClaimDailyBonus = () => {
    const bonusAmount = claimDailyBonus()
    const specialBonus = getSpecialBonus()
    const totalBonus = bonusAmount + specialBonus.bonus
    
    if (totalBonus > 0) {
      updateCoins(coins + totalBonus)
      setMessage(`🎉 Günlük bonus alındı! +${totalBonus} coin`)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleClaimTaskReward = (taskId) => {
    const reward = claimTaskReward(taskId)
    if (reward > 0) {
      updateCoins(coins + reward)
      setMessage(`✅ Görev ödülü alındı! +${reward} coin`)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleClaimAchievementReward = (achievementId) => {
    const reward = claimAchievementReward(achievementId)
    if (reward > 0) {
      updateCoins(coins + reward)
      setMessage(`🏆 Başarım ödülü alındı! +${reward} coin`)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const nextBonus = getNextBonusTime()
  const specialBonus = getSpecialBonus()

  // Progress bar için yardımcı fonksiyon
  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  // Başarım progress'i için
  const getAchievementProgress = (achievement) => {
    let current = 0
    switch (achievement.type) {
      case 'total_coins':
        current = stats.totalCoins || 0
        break
      case 'games_played':
        current = stats.gamesPlayed || 0
        break
      case 'high_score':
        current = stats.highScore || 0
        break
      case 'daily_streak':
        current = stats.dailyStreak || 0
        break
      case 'colors_unlocked':
        current = stats.colorsUnlocked || 1
        break
      case 'survival_time':
        current = stats.survivalTime || 0
        break
      default:
        current = 0
    }
    return { current, percentage: getProgressPercentage(current, achievement.target) }
  }



  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
                          <img src="/yazı.png" alt="Serpyx Yazı" className="h-20 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">📋 {t('tasksAndAchievements')}</h1>
          <p className="text-xl text-gray-400">{t('tasksDescription')}</p>
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



        {/* Günlük Bonus Kartı */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">🎁 {t('dailyBonus')}</h2>
              <p className="text-gray-300 mb-2">
                {t('consecutiveDays').replace('{days}', streakDays)}
              </p>
              <p className="text-yellow-400 font-semibold text-lg">
                {t('todaysBonus').replace('{amount}', getBonusAmount(streakDays))}
              </p>
              {specialBonus.bonus > 0 && (
                <p className="text-purple-400 font-semibold mt-2">
                  {specialBonus.message} +{specialBonus.bonus} coin
                </p>
              )}
            </div>
            <div className="text-right">
              {canClaim ? (
                <button 
                  onClick={handleClaimDailyBonus}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
                >
                  🎁 {t('claimBonus')}
                </button>
              ) : (
                <div className="text-center bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">{t('nextBonus')}</p>
                  <p className="text-white font-bold text-xl">
                    {nextBonus.hours}s {nextBonus.minutes}d
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab Menüsü */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'daily' 
                  ? 'bg-gradient-to-r from-snake-500 to-snake-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              📅 {t('dailyTasks')}
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'achievements' 
                  ? 'bg-gradient-to-r from-snake-500 to-snake-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🏆 {t('achievements')}
            </button>
          </div>
        </motion.div>

        {/* Günlük Görevler */}
        {activeTab === 'daily' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {getActiveTasks().map(task => (
              <motion.div 
                key={task.id} 
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{task.title}</h3>
                  <span className="text-yellow-400 font-bold text-xl">+{task.reward}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{t('progress')}</span>
                    <span className="text-white font-medium">{task.progress || 0}/{task.target}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-snake-400 to-snake-500 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${getProgressPercentage(task.progress || 0, task.target)}%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  className="w-full bg-gradient-to-r from-snake-500 to-snake-600 text-white py-3 rounded-xl font-bold hover:from-snake-600 hover:to-snake-700 transition-all duration-300"
                  onClick={() => setMessage(t('playToComplete'))}
                >
                  🎮 Oyna
                </button>
              </motion.div>
            ))}

            {getCompletedTasks().map(task => (
              <motion.div 
                key={task.id} 
                className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-500/50"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{task.title}</h3>
                  <span className="text-green-400 font-bold text-xl">+{task.reward}</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">{task.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{t('completed')}</span>
                    <span className="text-green-400 font-bold">✓</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <button 
                  onClick={() => handleClaimTaskReward(task.id)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300"
                >
                  🎁 {t('claimReward')}
                </button>
              </motion.div>
            ))}

            {getClaimedTasks().map(task => (
              <motion.div 
                key={task.id} 
                className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-500/50"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{task.title}</h3>
                  <span className="text-blue-400 font-bold text-xl">✓ Alındı</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">{task.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{t('completed')}</span>
                    <span className="text-blue-400 font-bold">✓</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <button 
                  className="w-full bg-gray-700 text-gray-500 py-3 rounded-xl font-medium cursor-not-allowed"
                  disabled
                >
                  ✅ {t('rewardClaimed')}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Başarımlar */}
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {getUnlockedAchievements().map(achievement => {
              const progress = getAchievementProgress(achievement)
              return (
                <motion.div 
                  key={achievement.id} 
                  className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-500/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                    </div>
                    <span className="text-yellow-400 font-bold text-xl">+{achievement.reward}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{achievement.description}</p>
                  <div className="mb-4">
                                      <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{t('progress')}</span>
                    <span className="text-white font-medium">{progress.current}/{achievement.target}</span>
                  </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleClaimAchievementReward(achievement.id)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                  >
                                      🏆 {t('claimReward')}
                </button>
                </motion.div>
              )
            })}

            {getClaimedAchievements().map(achievement => (
              <motion.div 
                key={achievement.id} 
                className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-500/50"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{achievement.icon}</span>
                    <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                  </div>
                  <span className="text-green-400 font-bold text-xl">✓ Alındı</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">{achievement.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{t('completed')}</span>
                    <span className="text-green-400 font-bold">✓</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <button 
                  className="w-full bg-gray-700 text-gray-500 py-3 rounded-xl font-medium cursor-not-allowed"
                  disabled
                >
                  ✅ {t('rewardClaimed')}
                </button>
              </motion.div>
            ))}

            {getLockedAchievements().map(achievement => {
              const progress = getAchievementProgress(achievement)
              return (
                <motion.div 
                  key={achievement.id} 
                  className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 opacity-70"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl filter grayscale">{achievement.icon}</span>
                      <h3 className="text-lg font-bold text-gray-400">{achievement.title}</h3>
                    </div>
                    <span className="text-gray-500 font-bold text-xl">+{achievement.reward}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{achievement.description}</p>
                  <div className="mb-4">
                                      <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">{t('progress')}</span>
                    <span className="text-gray-400 font-medium">{progress.current}/{achievement.target}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-gray-600 to-gray-700 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  className="w-full bg-gray-700 text-gray-500 py-3 rounded-xl font-medium cursor-not-allowed"
                  disabled
                >
                  🔒 {t('locked')}
                </button>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* İstatistikler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mt-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">📊 {t('statistics')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center justify-center mb-3">
                <img src="/coin.PNG" alt="Coin" className="w-8 h-8 mr-2 rounded-full" />
                <p className="text-gray-300 text-sm">{t('totalCoins')}</p>
              </div>
              <p className="text-yellow-400 font-bold text-2xl">{stats.totalCoins || 0}</p>
            </div>
            <div className="text-center bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center justify-center mb-3">
                <img src="/spx.png" alt="SPX" className="w-8 h-8 mr-2 rounded-full" />
                <p className="text-gray-300 text-sm">{t('spxBalance')}</p>
              </div>
              <p className="text-blue-400 font-bold text-2xl">{spxBalance || 0}</p>
            </div>
            <div className="text-center bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl mr-2">🎮</span>
                <p className="text-gray-300 text-sm">{t('gamesPlayed')}</p>
              </div>
              <p className="text-purple-400 font-bold text-2xl">{stats.gamesPlayed || 0}</p>
            </div>
            <div className="text-center bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl mr-2">🏆</span>
                <p className="text-gray-300 text-sm">{t('highestScore')}</p>
              </div>
              <p className="text-green-400 font-bold text-2xl">{stats.highScore || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Tasks 