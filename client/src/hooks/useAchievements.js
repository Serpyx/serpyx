import { useState, useEffect } from 'react'
import { useAuthStore } from './useAuthStore'
import { useLanguage } from '../contexts/LanguageContext'

const getAchievements = (t) => [
  {
    id: 'first_coin',
    title: t('firstCoin'),
    description: t('firstCoinDesc'),
    icon: '🪙',
    reward: 50,
    type: 'coins_collected',
    target: 1
  },
  {
    id: 'coin_collector',
    title: t('coinCollector'),
    description: t('coinCollectorDesc'),
    icon: '💰',
    reward: 200,
    type: 'total_coins',
    target: 100
  },
  {
    id: 'coin_master',
    title: t('coinMaster'),
    description: t('coinMasterDesc'),
    icon: '🏆',
    reward: 1000,
    type: 'total_coins',
    target: 1000
  },
  {
    id: 'first_game',
    title: t('firstGame'),
    description: t('firstGameDesc'),
    icon: '🎮',
    reward: 25,
    type: 'games_played',
    target: 1
  },
  {
    id: 'regular_player',
    title: t('regularPlayer'),
    description: t('regularPlayerDesc'),
    icon: '🎯',
    reward: 100,
    type: 'games_played',
    target: 10
  },
  {
    id: 'veteran_player',
    title: t('veteranPlayer'),
    description: t('veteranPlayerDesc'),
    icon: '👑',
    reward: 500,
    type: 'games_played',
    target: 100
  },
  {
    id: 'score_50',
    title: t('scoreHunter'),
    description: t('scoreHunterDesc'),
    icon: '🎯',
    reward: 150,
    type: 'high_score',
    target: 50
  },
  {
    id: 'score_100',
    title: t('scoreMaster'),
    description: t('scoreMasterDesc'),
    icon: '🏆',
    reward: 300,
    type: 'high_score',
    target: 100
  },
  {
    id: 'daily_streak_3',
    title: t('dailyStreak3'),
    description: t('dailyStreak3Desc'),
    icon: '🔥',
    reward: 200,
    type: 'daily_streak',
    target: 3
  },
  {
    id: 'daily_streak_7',
    title: t('weeklyPlayer'),
    description: t('weeklyPlayerDesc'),
    icon: '⚡',
    reward: 500,
    type: 'daily_streak',
    target: 7
  },
  {
    id: 'daily_streak_30',
    title: t('monthlyPlayer'),
    description: t('monthlyPlayerDesc'),
    icon: '💎',
    reward: 2000,
    type: 'daily_streak',
    target: 30
  },
  {
    id: 'first_color',
    title: t('colorEnthusiast'),
    description: t('colorEnthusiastDesc'),
    icon: '🎨',
    reward: 100,
    type: 'colors_unlocked',
    target: 1
  },
  {
    id: 'color_collector',
    title: t('colorCollector'),
    description: t('colorCollectorDesc'),
    icon: '🌈',
    reward: 300,
    type: 'colors_unlocked',
    target: 10
  },
  {
    id: 'survival_5min',
    title: t('survivor'),
    description: t('survivorDesc'),
    icon: '⏰',
    reward: 250,
    type: 'survival_time',
    target: 300
  },
  {
    id: 'survival_10min',
    title: t('durable'),
    description: t('durableDesc'),
    icon: '🛡️',
    reward: 500,
    type: 'survival_time',
    target: 600
  }
]

const useAchievements = () => {
  const { user } = useAuthStore()
  const { t } = useLanguage()
  const [achievements, setAchievements] = useState([])
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [claimedAchievements, setClaimedAchievements] = useState([]) // Ödülü alınan başarımlar
  const [stats, setStats] = useState({
    totalCoins: 0,
    gamesPlayed: 0,
    highScore: 0,
    colorsUnlocked: 1, // Başlangıçta 1 renk açık
    dailyStreak: 0
  })

  // Kullanıcıya özel localStorage key'leri
  const getStorageKey = (key) => {
    return user?.username ? `${key}-${user.username}` : key
  }

  // Başarımları yükle
  useEffect(() => {
    if (!user?.username) return

    const savedUnlocked = localStorage.getItem(getStorageKey('unlockedAchievements'))
    const savedClaimed = localStorage.getItem(getStorageKey('claimedAchievements'))
    const savedStats = localStorage.getItem(getStorageKey('achievementStats'))

    // Başarımları güncel çevirilerle yükle
    setAchievements(getAchievements(t))

    if (savedUnlocked) setUnlockedAchievements(JSON.parse(savedUnlocked))
    if (savedClaimed) setClaimedAchievements(JSON.parse(savedClaimed))
    if (savedStats) setStats(JSON.parse(savedStats))
  }, [user?.username, t])

  // İstatistikleri güncelle
  const updateStats = (newStats) => {
    console.log('📊 Başarım istatistikleri güncelleniyor:', newStats)
    
    setStats(prev => {
      const updated = { ...prev, ...newStats }
      localStorage.setItem(getStorageKey('achievementStats'), JSON.stringify(updated))
      
      // İstatistikler güncellendiğinde başarımları kontrol et
      const newAchievements = checkAchievements(updated)
      if (newAchievements.length > 0) {
        console.log('🎉 Yeni başarımlar açıldı:', newAchievements.map(a => a.title))
      }
      
      return updated
    })
  }

  // Başarım kontrolü
  const checkAchievements = (currentStats = stats) => {
    const newUnlocked = []
    
    achievements.forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return
      
      let unlocked = false
      let currentValue = 0
      
      switch (achievement.type) {
        case 'total_coins':
          currentValue = currentStats.totalCoins || 0
          unlocked = currentValue >= achievement.target
          break
        case 'games_played':
          currentValue = currentStats.gamesPlayed || 0
          unlocked = currentValue >= achievement.target
          break
        case 'high_score':
          currentValue = currentStats.highScore || 0
          unlocked = currentValue >= achievement.target
          break
        case 'daily_streak':
          currentValue = currentStats.dailyStreak || 0
          unlocked = currentValue >= achievement.target
          break
        case 'colors_unlocked':
          currentValue = currentStats.colorsUnlocked || 1
          unlocked = currentValue >= achievement.target
          break
        case 'survival_time':
          currentValue = currentStats.survivalTime || 0
          unlocked = currentValue >= achievement.target
          break
        case 'coins_collected':
          currentValue = currentStats.totalCoins || 0
          unlocked = currentValue >= achievement.target
          break
      }
      
      if (unlocked) {
        console.log(`🏆 Başarım açıldı: ${achievement.title} (${currentValue}/${achievement.target})`)
        newUnlocked.push(achievement.id)
      }
    })
    
    if (newUnlocked.length > 0) {
      setUnlockedAchievements(prev => {
        const updated = [...prev, ...newUnlocked]
        localStorage.setItem(getStorageKey('unlockedAchievements'), JSON.stringify(updated))
        return updated
      })
      
             return newUnlocked.map(id => achievements.find(a => a.id === id))
    }
    
    return []
  }

  // Yeni başarımları kontrol et
  useEffect(() => {
    const newAchievements = checkAchievements()
    if (newAchievements.length > 0) {
      // Başarım bildirimi göster
      newAchievements.forEach(achievement => {
        console.log(`🎉 Başarım: ${achievement.title} - ${achievement.reward} coin!`)
      })
    }
  }, [stats])

  // Başarım ödülünü topla
  const claimAchievementReward = (achievementId) => {
    const achievement = achievements.find(a => a.id === achievementId)
    if (achievement && unlockedAchievements.includes(achievementId) && !claimedAchievements.includes(achievementId)) {
      // Ödülü alındı olarak işaretle
      setClaimedAchievements(prev => {
        const updated = [...prev, achievementId]
        localStorage.setItem(getStorageKey('claimedAchievements'), JSON.stringify(updated))
        return updated
      })
      return achievement.reward
    }
    return 0
  }

  // Kilitli başarımları al
  const getLockedAchievements = () => {
    return achievements.filter(a => !unlockedAchievements.includes(a.id))
  }

  // Açılan ama ödülü alınmamış başarımları al
  const getUnlockedAchievements = () => {
    return achievements.filter(a => 
      unlockedAchievements.includes(a.id) && !claimedAchievements.includes(a.id)
    )
  }

  // Ödülü alınmış başarımları al
  const getClaimedAchievements = () => {
    return achievements.filter(a => claimedAchievements.includes(a.id))
  }

  // Toplam ödül miktarı (sadece alınmamış başarımlar)
  const getTotalReward = () => {
    return getUnlockedAchievements().reduce((total, achievement) => total + achievement.reward, 0)
  }

  return {
    achievements,
    unlockedAchievements,
    claimedAchievements,
    stats,
    updateStats,
    claimAchievementReward,
    getLockedAchievements,
    getUnlockedAchievements,
    getClaimedAchievements,
    getTotalReward
  }
}

export default useAchievements 