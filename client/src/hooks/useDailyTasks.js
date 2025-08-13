import { useState, useEffect } from 'react'
import { useAuthStore } from './useAuthStore'
import { useLanguage } from '../contexts/LanguageContext'

const getDailyTasks = (t) => [
  {
    id: 'eat_5_food',
    title: t('eat5Food'),
    description: t('eat5FoodDesc'),
    target: 5,
    reward: 50,
    type: 'food_eaten'
  },
  {
    id: 'collect_20_coins',
    title: t('collect20Coins'),
    description: t('collect20CoinsDesc'),
    target: 20,
    reward: 100,
    type: 'coins_collected'
  },
  {
    id: 'play_3_games',
    title: t('play3Games'),
    description: t('play3GamesDesc'),
    target: 3,
    reward: 75,
    type: 'games_played'
  },
  {
    id: 'reach_score_50',
    title: t('reachScore50'),
    description: t('reachScore50Desc'),
    target: 50,
    reward: 150,
    type: 'score_reached'
  },
  {
    id: 'survive_5_minutes',
    title: t('survive5Minutes'),
    description: t('survive5MinutesDesc'),
    target: 300, // 5 dakika = 300 saniye
    reward: 200,
    type: 'survival_time'
  },
  {
    id: 'survive_10_minutes',
    title: t('survive10Minutes'),
    description: t('survive10MinutesDesc'),
    target: 600, // 10 dakika = 600 saniye
    reward: 400,
    type: 'survival_time'
  }
]

const useDailyTasks = () => {
  const { user } = useAuthStore()
  const { t } = useLanguage()
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [claimedTasks, setClaimedTasks] = useState([]) // Ödülü alınan görevler
  const [lastReset, setLastReset] = useState('')

  // Kullanıcıya özel localStorage key'leri
  const getStorageKey = (key) => {
    return user?.username ? `${key}-${user.username}` : key
  }

  // Günlük görevleri yükle
  useEffect(() => {
    if (!user?.username) return

    const savedTasks = localStorage.getItem(getStorageKey('dailyTasks'))
    const savedCompleted = localStorage.getItem(getStorageKey('completedTasks'))
    const savedClaimed = localStorage.getItem(getStorageKey('claimedTasks'))
    const savedLastReset = localStorage.getItem(getStorageKey('lastTaskReset'))

    const today = new Date().toDateString()
    
    if (savedLastReset !== today) {
      // Yeni gün, görevleri sıfırla
      const dailyTasks = getDailyTasks(t)
      const shuffledTasks = [...dailyTasks].sort(() => Math.random() - 0.5).slice(0, 3)
      setTasks(shuffledTasks)
      setCompletedTasks([])
      setClaimedTasks([])
      setLastReset(today)
      localStorage.setItem(getStorageKey('dailyTasks'), JSON.stringify(shuffledTasks))
      localStorage.setItem(getStorageKey('completedTasks'), JSON.stringify([]))
      localStorage.setItem(getStorageKey('claimedTasks'), JSON.stringify([]))
      localStorage.setItem(getStorageKey('lastTaskReset'), today)
    } else {
      // Aynı gün, kaydedilmiş görevleri yükle
      if (savedTasks) {
        const savedTasksData = JSON.parse(savedTasks)
        // Kaydedilmiş görevleri güncel çevirilerle güncelle
        const dailyTasks = getDailyTasks(t)
        const updatedTasks = savedTasksData.map(savedTask => {
          const updatedTask = dailyTasks.find(task => task.id === savedTask.id)
          return updatedTask ? { ...savedTask, title: updatedTask.title, description: updatedTask.description } : savedTask
        })
        setTasks(updatedTasks)
      }
      if (savedCompleted) setCompletedTasks(JSON.parse(savedCompleted))
      if (savedClaimed) setClaimedTasks(JSON.parse(savedClaimed))
      setLastReset(savedLastReset)
    }
  }, [user?.username])

  // Görev ilerlemesini güncelle
  const updateTaskProgress = (taskType, value) => {
    console.log(`📊 Görev ilerlemesi güncelleniyor: ${taskType} +${value}`)
    
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.type === taskType && !completedTasks.includes(task.id)) {
          const newProgress = (task.progress || 0) + value
          console.log(`📈 Görev: ${task.title}, İlerleme: ${task.progress || 0} → ${newProgress}/${task.target}`)
          
          if (newProgress >= task.target) {
            // Görev tamamlandı
            const newCompletedTasks = [...completedTasks, task.id]
            setCompletedTasks(newCompletedTasks)
            localStorage.setItem(getStorageKey('completedTasks'), JSON.stringify(newCompletedTasks))
            console.log(`✅ Görev tamamlandı: ${task.title}`)
            return { ...task, progress: task.target, completed: true }
          }
          return { ...task, progress: newProgress }
        }
        return task
      })
      
      localStorage.setItem(getStorageKey('dailyTasks'), JSON.stringify(updatedTasks))
      return updatedTasks
    })
  }

  // Görev ödülünü topla
  const claimTaskReward = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task && completedTasks.includes(taskId) && !claimedTasks.includes(taskId)) {
      // Ödülü alındı olarak işaretle
      const newClaimedTasks = [...claimedTasks, taskId]
      setClaimedTasks(newClaimedTasks)
      localStorage.setItem(getStorageKey('claimedTasks'), JSON.stringify(newClaimedTasks))
      return task.reward
    }
    return 0
  }

  // Tamamlanan ama ödülü alınmamış görevleri al
  const getCompletedTasks = () => {
    return tasks.filter(task => 
      completedTasks.includes(task.id) && !claimedTasks.includes(task.id)
    )
  }

  // Aktif görevleri al
  const getActiveTasks = () => {
    return tasks.filter(task => !completedTasks.includes(task.id))
  }

  // Ödülü alınmış görevleri al
  const getClaimedTasks = () => {
    return tasks.filter(task => claimedTasks.includes(task.id))
  }

  // Toplam ödül miktarı (sadece alınmamış görevler)
  const getTotalReward = () => {
    return getCompletedTasks().reduce((total, task) => total + task.reward, 0)
  }

  return {
    tasks,
    completedTasks,
    claimedTasks,
    updateTaskProgress,
    claimTaskReward,
    getCompletedTasks,
    getActiveTasks,
    getClaimedTasks,
    getTotalReward,
    lastReset
  }
}

export default useDailyTasks 