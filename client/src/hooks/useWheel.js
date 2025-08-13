import { useState, useEffect } from 'react'
import { useAuthStore } from './useAuthStore'

// Çark ödülleri
const WHEEL_PRIZES = [
  { id: 'coin_50', name: '50 Coin', value: 50, type: 'coins', icon: '🪙', probability: 25 },
  { id: 'coin_100', name: '100 Coin', value: 100, type: 'coins', icon: '💰', probability: 20 },
  { id: 'coin_200', name: '200 Coin', value: 200, type: 'coins', icon: '💎', probability: 15 },
  { id: 'spx_1', name: '1 SPX', value: 1, type: 'spx', icon: '🪙', probability: 10 },
  { id: 'spx_2', name: '2 SPX', value: 2, type: 'spx', icon: '💎', probability: 5 },
  { id: 'color_random', name: 'Rastgele Renk', value: 'random', type: 'color', icon: '🎨', probability: 15 },
  { id: 'theme_random', name: 'Rastgele Tema', value: 'random', type: 'theme', icon: '🌅', probability: 8 },
  { id: 'bonus_2x', name: '2x Coin Bonus', value: '2x', type: 'bonus', icon: '⚡', probability: 2 }
]

const useWheel = () => {
  const { user, coins, updateCoins, spxBalance, updateSpxBalance } = useAuthStore()
  const [canSpinFree, setCanSpinFree] = useState(true)
  const [lastFreeSpin, setLastFreeSpin] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState(null)
  const [spinHistory, setSpinHistory] = useState([])

  // Kullanıcıya özel localStorage key'leri
  const getStorageKey = (key) => {
    return user?.username ? `${key}-${user.username}` : key
  }

  // Çark verilerini yükle
  useEffect(() => {
    if (!user?.username) return

    const savedLastFreeSpin = localStorage.getItem(getStorageKey('lastFreeSpin'))
    const savedSpinHistory = localStorage.getItem(getStorageKey('spinHistory'))

    if (savedLastFreeSpin) setLastFreeSpin(savedLastFreeSpin)
    if (savedSpinHistory) setSpinHistory(JSON.parse(savedSpinHistory))

    // Günlük ücretsiz çevirme kontrolü
    const today = new Date().toDateString()
    if (savedLastFreeSpin !== today) {
      setCanSpinFree(true)
    } else {
      setCanSpinFree(false)
    }
  }, [user?.username])

  // Rastgele ödül seçimi (probability'ye göre)
  const getRandomPrize = () => {
    const random = Math.random() * 100
    let cumulativeProbability = 0

    for (const prize of WHEEL_PRIZES) {
      cumulativeProbability += prize.probability
      if (random <= cumulativeProbability) {
        return prize
      }
    }

    // Fallback
    return WHEEL_PRIZES[0]
  }

  // Çark çevirme
  const spinWheel = (isFree = false) => {
    if (isSpinning) return null

    // Ücretsiz çevirme kontrolü
    if (isFree && !canSpinFree) {
      return { error: 'Bugünkü ücretsiz çevirmenizi zaten kullandınız!' }
    }

    // Coin kontrolü (ücretsiz değilse)
    if (!isFree && coins < 250) {
      return { error: 'Yeterli coin yok! 250 coin gerekli.' }
    }

    setIsSpinning(true)
    const prize = getRandomPrize()
    
    // Ödülü uygula
    let rewardMessage = ''
    
    switch (prize.type) {
      case 'coins':
        updateCoins(coins + prize.value)
        rewardMessage = `🎉 Tebrikler! +${prize.value} Coin kazandınız!`
        break
      
      case 'spx':
        updateSpxBalance(spxBalance + prize.value)
        rewardMessage = `🚀 Harika! +${prize.value} SPX kazandınız!`
        break
      
      case 'color':
        // Rastgele renk açma (basit implementasyon)
        rewardMessage = '🎨 Rastgele bir renk açıldı!'
        break
      
      case 'theme':
        // Rastgele tema açma (basit implementasyon)
        rewardMessage = '🌅 Rastgele bir tema açıldı!'
        break
      
      case 'bonus':
        // 2x coin bonus (geçici)
        updateCoins(coins + 100)
        rewardMessage = '⚡ 2x Coin Bonus! +100 Coin'
        break
    }

    // Çevirme geçmişini kaydet
    const newSpin = {
      id: Date.now(),
      prize: prize,
      timestamp: new Date().toISOString(),
      isFree: isFree
    }

    const updatedHistory = [newSpin, ...spinHistory.slice(0, 9)] // Son 10 çevirme
    setSpinHistory(updatedHistory)
    localStorage.setItem(getStorageKey('spinHistory'), JSON.stringify(updatedHistory))

    // Ücretsiz çevirme kullanıldıysa kaydet
    if (isFree) {
      const today = new Date().toDateString()
      setLastFreeSpin(today)
      setCanSpinFree(false)
      localStorage.setItem(getStorageKey('lastFreeSpin'), today)
    } else {
      // Coin düş
      updateCoins(coins - 250)
    }

    setSpinResult({ prize, message: rewardMessage })
    
    setTimeout(() => {
      setIsSpinning(false)
      setSpinResult(null)
    }, 3000)

    return { prize, message: rewardMessage }
  }

  // Ücretsiz çevirme
  const spinFree = () => {
    return spinWheel(true)
  }

  // Coin ile çevirme
  const spinWithCoins = () => {
    return spinWheel(false)
  }

  // Çevirme maliyeti
  const getSpinCost = () => {
    return 250
  }

  // Sonraki ücretsiz çevirme zamanı
  const getNextFreeSpinTime = () => {
    if (canSpinFree) return null
    
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const timeLeft = tomorrow.getTime() - today.getTime()
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    return { hours, minutes }
  }

  return {
    canSpinFree,
    isSpinning,
    spinResult,
    spinHistory,
    spinFree,
    spinWithCoins,
    getSpinCost,
    getNextFreeSpinTime,
    WHEEL_PRIZES
  }
}

export default useWheel
