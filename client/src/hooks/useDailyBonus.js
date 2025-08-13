import { useState, useEffect } from 'react'
import { useAuthStore } from './useAuthStore'

const useDailyBonus = () => {
  const { user } = useAuthStore()
  const [lastClaimDate, setLastClaimDate] = useState('')
  const [streakDays, setStreakDays] = useState(0)
  const [canClaim, setCanClaim] = useState(false)

  // Kullanıcıya özel localStorage key'leri
  const getStorageKey = (key) => {
    return user?.username ? `${key}-${user.username}` : key
  }

  // Bonus miktarları (gün sayısına göre artar)
  const getBonusAmount = (days) => {
    const baseAmount = 100
    const streakBonus = days * 25
    return baseAmount + streakBonus
  }

  // Günlük bonusu kontrol et
  useEffect(() => {
    if (!user?.username) return

    const savedLastClaim = localStorage.getItem(getStorageKey('lastDailyBonus'))
    const savedStreak = localStorage.getItem(getStorageKey('dailyStreak'))
    
    if (savedLastClaim) setLastClaimDate(savedLastClaim)
    if (savedStreak) setStreakDays(parseInt(savedStreak))

    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    if (savedLastClaim !== today) {
      // Bugün bonus alınmamış
      setCanClaim(true)
    } else {
      // Bugün bonus zaten alınmış
      setCanClaim(false)
    }
  }, [user?.username])

  // Günlük bonusu talep et
  const claimDailyBonus = () => {
    if (!canClaim) return 0

    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    let newStreak = 1
    
    if (lastClaimDate === yesterday) {
      // Üst üste giriş
      newStreak = streakDays + 1
    } else if (lastClaimDate !== today) {
      // Streak kırıldı, yeniden başla
      newStreak = 1
    }

    const bonusAmount = getBonusAmount(newStreak)
    
    // Kaydet
    setLastClaimDate(today)
    setStreakDays(newStreak)
    setCanClaim(false)
    
    localStorage.setItem(getStorageKey('lastDailyBonus'), today)
    localStorage.setItem(getStorageKey('dailyStreak'), newStreak.toString())
    
    return bonusAmount
  }

  // Özel bonuslar (haftalık/aylık)
  const getSpecialBonus = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Pazar, 6 = Cumartesi
    const dayOfMonth = today.getDate()
    
    let specialBonus = 0
    let specialMessage = ''
    
    // Hafta sonu bonusu (Cumartesi-Pazar)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      specialBonus = 200
      specialMessage = '🎉 Hafta Sonu Bonusu!'
    }
    
    // Ayın 1'i bonusu
    if (dayOfMonth === 1) {
      specialBonus = 500
      specialMessage = '🎊 Ay Başı Bonusu!'
    }
    
    // Ayın 15'i bonusu
    if (dayOfMonth === 15) {
      specialBonus = 300
      specialMessage = '🎯 Ay Ortası Bonusu!'
    }
    
    return { bonus: specialBonus, message: specialMessage }
  }

  // Sonraki bonus zamanını hesapla
  const getNextBonusTime = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const timeLeft = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    return { hours, minutes }
  }

  return {
    canClaim,
    streakDays,
    lastClaimDate,
    claimDailyBonus,
    getBonusAmount,
    getSpecialBonus,
    getNextBonusTime
  }
}

export default useDailyBonus 