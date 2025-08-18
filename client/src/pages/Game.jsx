import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../hooks/useAuthStore'
import { useSound } from '../hooks/useSound'
import useDailyTasks from '../hooks/useDailyTasks'
import useDailyBonus from '../hooks/useDailyBonus'
import useAchievements from '../hooks/useAchievements'
import { useLanguage } from '../contexts/LanguageContext'
import AdBanner from '../components/AdBanner'

const Game = () => {
  const canvasRef = useRef(null)
  const [gameState, setGameState] = useState('menu')
  
  // menu, playing, paused, gameOver, adWatching
  const [gameMode, setGameMode] = useState('free') // free, campaign
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [campaignScore, setCampaignScore] = useState(0) // Kampanya modu için ayrı score
  const [campaignCoins, setCampaignCoins] = useState(0) // Kampanya modu için ayrı coins
  const [snake, setSnake] = useState([])
  const [food, setFood] = useState({ x: 0, y: 0 })
  const [direction, setDirection] = useState('right')
  const [pendingDirection, setPendingDirection] = useState('right')
  const [gameSpeed, setGameSpeed] = useState(() => {
    const initialSpeed = 80 // 80ms = 12.5 kare/saniye başlangıç
    return initialSpeed
  })
  

  const [bonusFood, setBonusFood] = useState(null)
  const [bonusTimer, setBonusTimer] = useState(0)
  const [obstacles, setObstacles] = useState([])
  const [levelCompleted, setLevelCompleted] = useState(false)
  const [adWatched, setAdWatched] = useState(false)
  const [canWatchAd, setCanWatchAd] = useState(true)
  const [freeModeAdCount, setFreeModeAdCount] = useState(0)
  const [campaignAdCount, setCampaignAdCount] = useState(0) // Kampanya modu için ayrı reklam sayısı
  const [levelAdCount, setLevelAdCount] = useState(0) // Her level için ayrı reklam sayısı
  const [fps, setFps] = useState(60) // Sabit 60 FPS - gameSpeed'den bağımsız
  const [gameStartTime, setGameStartTime] = useState(0)
  const [survivalTime, setSurvivalTime] = useState(0)
  const [adProgress, setAdProgress] = useState(0) // Reklam ilerleme durumu
  const lastFrameTime = useRef(Date.now())
  const timerRef = useRef(null)
  const survivalTimerRef = useRef(null)
  const { snakeColor, updateSnakeColor } = useAuthStore()
  
  // Sabit oyun alanı stili
  const gameAreaStyle = useMemo(() => {
    return {
      background: 'linear-gradient(135deg, #1f2937, #374151)',
      borderRadius: '12px',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
    }
  }, [])
  
  const { 
    updateCoins, 
    updateHighScore, 
    user, 
    updateTotalScore
  } = useAuthStore()
  
  // User coins değerini al
  const userCoins = user?.coins || 0
  const navigate = useNavigate()
  const { playCoinSound, playBonusSound, playGameOverSound, playHoverSound, playButtonClick } = useSound()
  
  // Yeni hook'lar
  const { updateTaskProgress } = useDailyTasks()
  const { claimDailyBonus, getSpecialBonus, streakDays } = useDailyBonus()
  const { updateStats, stats } = useAchievements()
  const { t } = useLanguage()
  
  // Debug: Log user coins at game start
  console.log('Game - User coins at start:', userCoins);



  const CANVAS_SIZE = 800
  const GRID_SIZE = 25
  const GRID_COUNT = CANVAS_SIZE / GRID_SIZE

  const updatedRef = useRef(false);

  // 20 Aşamalı Kampanya Modu Level Sistemi
  const LEVELS = useMemo(() => ({
    1: {
      name: "Başlangıç",
      description: "Temel kontrolleri öğrenin",
      obstacles: [],
      targetScore: 10,
      speed: 80,
      coinReward: 10,
      isBonusLevel: false,
      specialMechanics: ["tutorial"],
      powerUps: []
    },
    2: {
      name: "Hareketli Nesneler",
      description: "Küçük hareketli nesnelerden kaçın",
      obstacles: [
        { x: 10, y: 10, width: 1, height: 1, type: "moving" },
        { x: 20, y: 15, width: 1, height: 1, type: "moving" }
      ],
      targetScore: 15,
      speed: 70,
      coinReward: 15,
      isBonusLevel: false,
      specialMechanics: ["movingObstacles"],
      powerUps: []
    },
    3: {
      name: "Orman Labirenti",
      description: "Statik taşlarla dolu orman",
      obstacles: [
        { x: 8, y: 8, width: 2, height: 1 },
        { x: 18, y: 8, width: 2, height: 1 },
        { x: 8, y: 20, width: 2, height: 1 },
        { x: 18, y: 20, width: 2, height: 1 },
        { x: 13, y: 14, width: 1, height: 1 }
      ],
      targetScore: 20,
      speed: 60,
      coinReward: 20,
      isBonusLevel: false,
      specialMechanics: ["staticObstacles"],
      powerUps: []
    },
    4: {
      name: "Altın Elma Avı",
      description: "Nadir altın elmaları yakala",
      obstacles: [
        { x: 10, y: 10, width: 2, height: 1 },
        { x: 18, y: 10, width: 2, height: 1 },
        { x: 10, y: 18, width: 2, height: 1 },
        { x: 18, y: 18, width: 2, height: 1 }
      ],
      targetScore: 25,
      speed: 50,
      coinReward: 25,
      bonusCoin: 30, // Altın elma bonusu
      isBonusLevel: false,
      specialMechanics: ["goldenApple"],
      powerUps: []
    },
    5: {
      name: "Hız Testi",
      description: "60 saniyede maksimum yem topla",
      obstacles: [],
      targetScore: 50,
      speed: 40,
      coinReward: 5, // Yem başına
      timeLimit: 60,
      isBonusLevel: true,
      specialMechanics: ["timeAttack"],
      powerUps: []
    },
    6: {
      name: "Hız Artırıcı",
      description: "Hız artırma gücünü kullan",
      obstacles: [
        { x: 8, y: 8, width: 1, height: 6 },
        { x: 22, y: 8, width: 1, height: 6 },
        { x: 12, y: 12, width: 6, height: 1 },
        { x: 15, y: 15, width: 1, height: 1, type: "moving" }
      ],
      targetScore: 40,
      speed: 100,
      coinReward: 40,
      isBonusLevel: false,
      specialMechanics: ["speedBoost"],
      powerUps: ["speedBoost"]
    },
    7: {
      name: "Mağara Labirenti",
      description: "Karmaşık mağara labirenti",
      obstacles: [
        { x: 6, y: 6, width: 12, height: 1 },
        { x: 6, y: 6, width: 1, height: 12 },
        { x: 6, y: 17, width: 12, height: 1 },
        { x: 17, y: 6, width: 1, height: 12 },
        { x: 10, y: 10, width: 6, height: 1 },
        { x: 10, y: 10, width: 1, height: 6 },
        { x: 10, y: 15, width: 6, height: 1 },
        { x: 15, y: 10, width: 1, height: 6 }
      ],
      targetScore: 45,
      speed: 520,
      coinReward: 45,
      isBonusLevel: false,
      specialMechanics: ["complexMaze"],
      powerUps: []
    },
    8: {
      name: "Düşen Taşlar",
      description: "Rastgele düşen taşlardan kaç",
      obstacles: [
        { x: 10, y: 10, width: 2, height: 1 },
        { x: 18, y: 10, width: 2, height: 1 },
        { x: 10, y: 18, width: 2, height: 1 },
        { x: 18, y: 18, width: 2, height: 1 }
      ],
      targetScore: 50,
      speed: 480,
      coinReward: 50,
      isBonusLevel: false,
      specialMechanics: ["fallingRocks"],
      powerUps: []
    },
    9: {
      name: "Elektrik Alanları",
      description: "Elektrik alanlarından kaçın",
      obstacles: [
        { x: 8, y: 8, width: 1, height: 6 },
        { x: 22, y: 8, width: 1, height: 6 },
        { x: 12, y: 12, width: 6, height: 1 },
        { x: 15, y: 15, width: 1, height: 1, type: "electric" }
      ],
      targetScore: 55,
      speed: 440,
      coinReward: 55,
      isBonusLevel: false,
      specialMechanics: ["electricFields"],
      powerUps: ["shield"]
    },
    10: {
      name: "Daralan Harita",
      description: "Harita sürekli küçülüyor",
      obstacles: [],
      targetScore: 70,
      speed: 400,
      coinReward: 70,
      timeLimit: 90,
      isBonusLevel: true,
      specialMechanics: ["shrinkingMap"],
      powerUps: []
    },
    11: {
      name: "Gece Şehri",
      description: "Karanlık şehirde yolunu bul",
      obstacles: [
        { x: 4, y: 4, width: 2, height: 2 },
        { x: 22, y: 4, width: 2, height: 2 },
        { x: 4, y: 22, width: 2, height: 2 },
        { x: 22, y: 22, width: 2, height: 2 },
        { x: 12, y: 6, width: 3, height: 1 },
        { x: 6, y: 12, width: 1, height: 3 },
        { x: 20, y: 12, width: 1, height: 3 },
        { x: 12, y: 20, width: 3, height: 1 },
        { x: 14, y: 14, width: 1, height: 1 }
      ],
      targetScore: 80,
      speed: 360,
      coinReward: 80,
      isBonusLevel: false,
      specialMechanics: ["darkness"],
      powerUps: ["obstacleDestroyer"]
    },
    12: {
      name: "Takipçi Yılanlar",
      description: "Düşman yılanlardan kaç",
      obstacles: [
        { x: 10, y: 10, width: 2, height: 1 },
        { x: 18, y: 10, width: 2, height: 1 },
        { x: 10, y: 18, width: 2, height: 1 },
        { x: 18, y: 18, width: 2, height: 1 }
      ],
      targetScore: 85,
      speed: 320,
      coinReward: 85,
      isBonusLevel: false,
      specialMechanics: ["enemySnakes"],
      powerUps: []
    },
    13: {
      name: "Uzay Rotasyonu",
      description: "Dönen engellerle mücadele et",
      obstacles: [
        { x: 8, y: 8, width: 1, height: 6 },
        { x: 22, y: 8, width: 1, height: 6 },
        { x: 12, y: 12, width: 6, height: 1 },
        { x: 15, y: 15, width: 1, height: 1, type: "rotating" }
      ],
      targetScore: 90,
      speed: 280,
      coinReward: 90,
      isBonusLevel: false,
      specialMechanics: ["rotatingObstacles"],
      powerUps: []
    },
    14: {
      name: "Daralan Alan",
      description: "Her yemle harita küçülür",
      obstacles: [
        { x: 10, y: 10, width: 2, height: 1 },
        { x: 18, y: 10, width: 2, height: 1 },
        { x: 10, y: 18, width: 2, height: 1 },
        { x: 18, y: 18, width: 2, height: 1 }
      ],
      targetScore: 95,
      speed: 240,
      coinReward: 95,
      isBonusLevel: false,
      specialMechanics: ["shrinkingWithFood"],
      powerUps: []
    },
    15: {
      name: "Hedef Avı",
      description: "Süre sınırlı hedef yakalama",
      obstacles: [],
      targetScore: 100,
      speed: 200,
      coinReward: 100,
      timeLimit: 120,
      isBonusLevel: true,
      specialMechanics: ["targetHunting"],
      powerUps: []
    },
    16: {
      name: "Karanlık Labirent",
      description: "Sadece yakındaki alan görünür",
      obstacles: [
        { x: 6, y: 6, width: 12, height: 1 },
        { x: 6, y: 6, width: 1, height: 12 },
        { x: 6, y: 17, width: 12, height: 1 },
        { x: 17, y: 6, width: 1, height: 12 },
        { x: 10, y: 10, width: 6, height: 1 },
        { x: 10, y: 10, width: 1, height: 6 },
        { x: 10, y: 15, width: 6, height: 1 },
        { x: 15, y: 10, width: 1, height: 6 }
      ],
      targetScore: 110,
      speed: 180,
      coinReward: 110,
      isBonusLevel: false,
      specialMechanics: ["fogOfWar"],
      powerUps: ["light"]
    },
    17: {
      name: "Yer Değiştiren Engeller",
      description: "Engeller rastgele yer değiştirir",
      obstacles: [
        { x: 10, y: 10, width: 2, height: 1, type: "teleporting" },
        { x: 18, y: 10, width: 2, height: 1, type: "teleporting" },
        { x: 10, y: 18, width: 2, height: 1, type: "teleporting" },
        { x: 18, y: 18, width: 2, height: 1, type: "teleporting" }
      ],
      targetScore: 115,
      speed: 160,
      coinReward: 115,
      isBonusLevel: false,
      specialMechanics: ["teleportingObstacles"],
      powerUps: []
    },
    18: {
      name: "Zehirli Yemler",
      description: "Bazı yemler zehirli olabilir",
      obstacles: [
        { x: 8, y: 8, width: 1, height: 6 },
        { x: 22, y: 8, width: 1, height: 6 },
        { x: 12, y: 12, width: 6, height: 1 },
        { x: 15, y: 15, width: 1, height: 1 }
      ],
      targetScore: 120,
      speed: 140,
      coinReward: 120,
      isBonusLevel: false,
      specialMechanics: ["poisonousFood"],
      powerUps: ["antidote"]
    },
    19: {
      name: "Volkanik Patlama",
      description: "Hızlı hareket eden engeller",
      obstacles: [
        { x: 4, y: 4, width: 2, height: 2 },
        { x: 22, y: 4, width: 2, height: 2 },
        { x: 4, y: 22, width: 2, height: 2 },
        { x: 22, y: 22, width: 2, height: 2 },
        { x: 12, y: 6, width: 3, height: 1 },
        { x: 6, y: 12, width: 1, height: 3 },
        { x: 20, y: 12, width: 1, height: 3 },
        { x: 12, y: 20, width: 3, height: 1 },
        { x: 14, y: 14, width: 1, height: 1 }
      ],
      targetScore: 130,
      speed: 120,
      coinReward: 130,
      isBonusLevel: false,
      specialMechanics: ["fastMovingObstacles"],
      powerUps: []
    },
    20: {
      name: "Galaksi Son Savaşı",
      description: "Tüm zorluklar bir arada",
      obstacles: [
        { x: 6, y: 6, width: 12, height: 1 },
        { x: 6, y: 6, width: 1, height: 12 },
        { x: 6, y: 17, width: 12, height: 1 },
        { x: 17, y: 6, width: 1, height: 12 },
        { x: 10, y: 10, width: 6, height: 1 },
        { x: 10, y: 10, width: 1, height: 6 },
        { x: 10, y: 15, width: 6, height: 1 },
        { x: 15, y: 10, width: 1, height: 6 },
        { x: 8, y: 8, width: 1, height: 1, type: "rotating" },
        { x: 20, y: 8, width: 1, height: 1, type: "rotating" },
        { x: 8, y: 20, width: 1, height: 1, type: "rotating" },
        { x: 20, y: 20, width: 1, height: 1, type: "rotating" }
      ],
      targetScore: 150,
      speed: 100,
      coinReward: 150,
      bonusCoin: 200, // Final bonus
      isBonusLevel: false,
      specialMechanics: ["ultimateChallenge"],
      powerUps: ["ultimateCombo"]
    }
  }), [])

  // Generate random food position
  const generateFood = useCallback(() => {
    let newFood
    let attempts = 0
    const maxAttempts = 100
    
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_COUNT),
        y: Math.floor(Math.random() * GRID_COUNT)
      }
      attempts++
    } while (
      attempts < maxAttempts && 
      (
        // Campaign mode'da engellerle çakışma kontrolü
        (gameMode === 'campaign' && obstacles.some(obstacle => 
          newFood.x >= obstacle.x && 
          newFood.x < obstacle.x + obstacle.width &&
          newFood.y >= obstacle.y && 
          newFood.y < obstacle.y + obstacle.height
        )) ||
        // Yılanla çakışma kontrolü - mevcut yılan pozisyonunu kontrol et
        snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
      )
    )
    
    setFood(newFood)
  }, [obstacles, gameMode, snake])

  // Generate bonus food
  const generateBonusFood = useCallback(() => {
    // Şans tılsımı aktifse bonus yem şansını artır
    const baseChance = 0.1; // 10% temel şans
    const luckyCharmBonus = 0; // Şans tılsımı geçici olarak devre dışı
    const totalChance = baseChance + luckyCharmBonus;
    
    if (Math.random() < totalChance) {
      let newBonusFood
      let attempts = 0
      const maxAttempts = 50
      
      do {
        newBonusFood = {
          x: Math.floor(Math.random() * GRID_COUNT),
          y: Math.floor(Math.random() * GRID_COUNT),
          value: Math.floor(Math.random() * 5) + 5 // 5-10 coins
        }
        attempts++
      } while (
        attempts < maxAttempts && 
        (
          // Campaign mode'da engellerle çakışma kontrolü
          (gameMode === 'campaign' && obstacles.some(obstacle => 
            newBonusFood.x >= obstacle.x && 
            newBonusFood.x < obstacle.x + obstacle.width &&
            newBonusFood.y >= obstacle.y && 
            newBonusFood.y < obstacle.y + obstacle.height
          )) ||
          // Yılanla çakışma kontrolü
          snake.some(segment => segment.x === newBonusFood.x && segment.y === newBonusFood.y) ||
          // Normal yemle çakışma kontrolü
          (food && newBonusFood.x === food.x && newBonusFood.y === food.y)
        )
      )
      
      if (attempts < maxAttempts) {
        setBonusFood(newBonusFood)
        setBonusTimer(50) // 50 moves to collect
      }
    }
  }, [obstacles, gameMode, snake, food])

  // Initialize game
  const initGame = useCallback((mode = 'free', level = 1) => {
    // Start position - ekranın ortasına yakın, güvenli bir pozisyon
    const startX = mode === 'campaign' ? 8 : 15
    const startY = mode === 'campaign' ? 8 : 20
    
    const initialSnake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ]
    
    console.log('🎮 Initializing game with snake:', initialSnake)
    
    // Yılan state'ini hemen sıfırla
    setSnake(initialSnake)
    setDirection('right')
    setPendingDirection('right')
    
    // Mode'a göre score ve coin yönetimi
    if (mode === 'campaign') {
      setCampaignScore(0)
      setCampaignCoins(0)
    } else {
      setScore(0)
      setCoins(0)
    }
    
    setLevelCompleted(false)
    
    if (mode === 'campaign' && LEVELS[level]) {
      setObstacles(LEVELS[level].obstacles)
      setCurrentLevel(level)
    } else {
      setObstacles([])
      setCurrentLevel(1)
    }
    
    setBonusFood(null)
    setBonusTimer(0)
    
    // Yemi yılan pozisyonunu dikkate alarak oluştur
    setTimeout(() => {
      generateFood()
    }, 50)
  }, [generateFood, LEVELS])

  // Check collision
  const checkCollision = useCallback((head) => {
    
    // Wall collision - Sadece kampanya modunda duvar çarpışması
    if (gameMode === 'campaign' && (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT)) {
      return true
    }
    
    // Self collision - yılanın gövdesi ile çarpışma kontrolü (başı hariç)
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
      return true
    }
    
    // Obstacle collision (only in campaign mode) - Kalkan koruması aktifse engel çarpışmasını engelle
    if (gameMode === 'campaign') {
      const obstacleCollision = obstacles.some(obstacle => 
        head.x >= obstacle.x && 
        head.x < obstacle.x + obstacle.width &&
        head.y >= obstacle.y && 
        head.y < obstacle.y + obstacle.height
      )
      if (obstacleCollision) {

      }
      return obstacleCollision
    }
    

    return false
  }, [snake, obstacles, gameMode])

  // Move snake
  const moveSnake = useCallback(() => {
    if (gameState !== 'playing') return



    setSnake(prevSnake => {
      // Yönü sadece bir kez güncelle
      let newDirection = pendingDirection
      setDirection(newDirection)
      setPendingDirection(newDirection)
      let newSnake = [...prevSnake]
      const head = { ...newSnake[0] }



      // Move head based on direction
      switch (newDirection) {
        case 'up':
          head.y -= 1
          break
        case 'down':
          head.y += 1
          break
        case 'left':
          head.x -= 1
          break
        case 'right':
          head.x += 1
          break
        default:
          break
      }
      
      // Serbest modda duvar geçişi (portal sistemi)
      if (gameMode === 'free') {
        // Sağ duvardan çıkarsa sol duvardan gir
        if (head.x >= GRID_COUNT) {
          head.x = 0
        }
        // Sol duvardan çıkarsa sağ duvardan gir
        else if (head.x < 0) {
          head.x = GRID_COUNT - 1
        }
        // Alt duvardan çıkarsa üst duvardan gir
        if (head.y >= GRID_COUNT) {
          head.y = 0
        }
        // Üst duvardan çıkarsa alt duvardan gir
        else if (head.y < 0) {
          head.y = GRID_COUNT - 1
        }
      }



      // Check collision
      if (checkCollision(head)) {
        // Play game over sound
        playGameOverSound()
        setGameState('gameOver')
        return prevSnake
      }

      newSnake.unshift(head)

      // Check food collision
      const normalizedHeadX = gameMode === 'free' ? ((head.x % GRID_COUNT) + GRID_COUNT) % GRID_COUNT : head.x
      const normalizedHeadY = gameMode === 'free' ? ((head.y % GRID_COUNT) + GRID_COUNT) % GRID_COUNT : head.y
      const normalizedFoodX = gameMode === 'free' ? ((food.x % GRID_COUNT) + GRID_COUNT) % GRID_COUNT : food.x
      const normalizedFoodY = gameMode === 'free' ? ((food.y % GRID_COUNT) + GRID_COUNT) % GRID_COUNT : food.y
      
      if (normalizedHeadX === normalizedFoodX && normalizedHeadY === normalizedFoodY) {
        // Play coin sound
        playCoinSound()
        
        if (gameMode === 'campaign') {
          // Kampanya modu için ayrı score ve coin yönetimi
          setCampaignScore(prev => prev + 1)
          setCampaignCoins(prev => prev + 1)
        } else {
          // Free mode için normal yönetim
          setScore(prev => prev + 1)
          setCoins(prev => prev + 1)
        }
        
        // Görev ilerlemesini güncelle
        updateTaskProgress('food_eaten', 1)
        updateTaskProgress('coins_collected', 1)
        
        generateFood()
        generateBonusFood()
        
        // Increase speed every 10 points (only in free mode) - dengeli artış
        if (gameMode === 'free' && (score + 1) % 10 === 0) {
          setGameSpeed(prev => {
            const newSpeed = Math.max(prev - 1, 20) // Dengeli artış, minimum 20ms (50 FPS)
            console.log(`🚀 Speed increased: ${prev}ms → ${newSpeed}ms (Score: ${score + 1})`)
            return newSpeed
          })
        }
        
        // Check level completion in campaign mode - tam olarak hedef score'da bitir
        if (gameMode === 'campaign' && LEVELS[currentLevel] && campaignScore === LEVELS[currentLevel].targetScore) {
          // Level tamamlandığında coin ödülünü ver
          const levelReward = LEVELS[currentLevel].coinReward || 0
          const bonusReward = LEVELS[currentLevel].bonusCoin || 0
          const totalReward = levelReward + bonusReward
          
          // Kampanya modu için ayrı coin yönetimi
          setCampaignCoins(prev => prev + totalReward)
          setLevelCompleted(true)
          setGameState('levelComplete')
        }
      } else {
        newSnake.pop()
      }

      // Check bonus food collision
      if (bonusFood) {
        const normalizedBonusFoodX = gameMode === 'free' ? ((bonusFood.x % GRID_COUNT) + GRID_COUNT) % GRID_COUNT : bonusFood.x
        const normalizedBonusFoodY = gameMode === 'free' ? ((bonusFood.y % GRID_COUNT) + GRID_COUNT) % GRID_COUNT : bonusFood.y
        
        if (normalizedHeadX === normalizedBonusFoodX && normalizedHeadY === normalizedBonusFoodY) {
        // Play bonus sound
        playBonusSound()
        
        setCoins(prev => {
          const newCoins = prev + bonusFood.value;
          return newCoins;
        })
        
        // Görev ilerlemesini güncelle
        updateTaskProgress('coins_collected', bonusFood.value)
        
        setBonusFood(null)
        setBonusTimer(0)
        }
      }

      return newSnake
    })
  }, [gameState, direction, pendingDirection, food, bonusFood, score, checkCollision, generateFood, generateBonusFood])

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }
    if (gameState !== 'playing') return

    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'down' && pendingDirection !== 'down') setPendingDirection('up')
        break
      case 'ArrowDown':
        if (direction !== 'up' && pendingDirection !== 'up') setPendingDirection('down')
        break
      case 'ArrowLeft':
        if (direction !== 'right' && pendingDirection !== 'right') setPendingDirection('left')
        break
      case 'ArrowRight':
        if (direction !== 'left' && pendingDirection !== 'left') setPendingDirection('right')
        break
      case ' ':
        setGameState('paused')
        break
      default:
        break
    }
  }, [gameState, direction, pendingDirection])

  // Draw game - optimized
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Clear canvas efficiently
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    
    // Draw background with default theme
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    gradient.addColorStop(0, '#1f2937')
    gradient.addColorStop(1, '#111827')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Grid removed for cleaner look

    // Draw realistic snake with advanced effects
    if (snake.length > 0) {
      ctx.save();
      
      // Snake color kontrolü
      console.log('Game - Snake color:', snakeColor);
      
      // Yılanı doğrudan kullan
      const normalizedSnake = snake;
      
      // Renk kontrolü ve gerçekçi renkler
      let baseColor = snakeColor;
      let darkColor = '';
      let lightColor = '';
      let shadowBlur = 0;
      let shadowColor = 'transparent';
      
            // Normal renk kontrolü
      
      // Gerçekçi renk paletleri
      if (snakeColor === 'gradient1') {
        const rainbow = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3'];
        baseColor = rainbow[0];
        darkColor = '#8B0000';
        lightColor = '#FF4444';
        shadowBlur = 8;
        shadowColor = baseColor;
      } else if (snakeColor === 'gradient2') {
        const sunset = ['#f59e42','#fef08a','#a21caf','#ef4444','#fbbf24'];
        baseColor = sunset[0];
        darkColor = '#B45309';
        lightColor = '#FCD34D';
        shadowBlur = 8;
        shadowColor = baseColor;
      } else if (snakeColor === 'gold') {
        baseColor = '#FFD700';
        darkColor = '#B8860B';
        lightColor = '#FFFACD';
        shadowBlur = 12;
        shadowColor = '#FFA500';
      } else if (snakeColor === '#39ff14') { // neon-green
        baseColor = '#39ff14';
        darkColor = '#00AA00';
        lightColor = '#7FFF7F';
        shadowBlur = 15;
        shadowColor = baseColor;
      } else if (snakeColor === '#ff4da6') { // neon-pink
        baseColor = '#ff4da6';
        darkColor = '#CC0066';
        lightColor = '#FF99CC';
        shadowBlur = 15;
        shadowColor = baseColor;
      } else if (snakeColor === '#00e6ff') { // neon-blue
        baseColor = '#00e6ff';
        darkColor = '#0088CC';
        lightColor = '#66F0FF';
        shadowBlur = 15;
        shadowColor = baseColor;
      } else if (snakeColor === '#ff9900') { // neon-orange
        baseColor = '#ff9900';
        darkColor = '#CC6600';
        lightColor = '#FFCC66';
        shadowBlur = 15;
        shadowColor = baseColor;
      } else if (snakeColor === '#d500f9') { // neon-purple
        baseColor = '#d500f9';
        darkColor = '#8800AA';
        lightColor = '#FF66FF';
        shadowBlur = 15;
        shadowColor = baseColor;
      } else if (snakeColor === '#86efac') { // pastel-green
        baseColor = '#86efac';
        darkColor = '#4CAF50';
        lightColor = '#C8E6C9';
        shadowBlur = 4;
        shadowColor = baseColor;
      } else if (snakeColor === '#93c5fd') { // pastel-blue
        baseColor = '#93c5fd';
        darkColor = '#2196F3';
        lightColor = '#BBDEFB';
        shadowBlur = 4;
        shadowColor = baseColor;
      } else if (snakeColor === '#f9a8d4') { // pastel-pink
        baseColor = '#f9a8d4';
        darkColor = '#E91E63';
        lightColor = '#F8BBD9';
        shadowBlur = 4;
        shadowColor = baseColor;
      } else if (snakeColor === '#c4b5fd') { // lavender
        baseColor = '#c4b5fd';
        darkColor = '#9C27B0';
        lightColor = '#E1BEE7';
        shadowBlur = 4;
        shadowColor = baseColor;
      } else if (snakeColor === '#fef3c7') { // cream
        baseColor = '#fef3c7';
        darkColor = '#FFC107';
        lightColor = '#FFFDE7';
        shadowBlur = 4;
        shadowColor = baseColor;
      } else if (snakeColor === 'platinum') { // platinum
        baseColor = '#e5e7eb';
        darkColor = '#9ca3af';
        lightColor = '#ffffff';
        shadowBlur = 6;
        shadowColor = '#cbd5e1';
      } else if (snakeColor === 'turquoise') { // turquoise
        baseColor = '#06b6d4';
        darkColor = '#0891b2';
        lightColor = '#67e8f9';
        shadowBlur = 8;
        shadowColor = '#06b6d4';
      } else {
        // Normal renkler için gerçekçi tonlar
        if (snakeColor === '#22c55e') { // green
          baseColor = '#22c55e';
          darkColor = '#15803d';
          lightColor = '#86efac';
        } else if (snakeColor === '#3B82F6') { // blue
          baseColor = '#3B82F6';
          darkColor = '#1d4ed8';
          lightColor = '#93c5fd';
        } else if (snakeColor === '#ef4444') { // red
          baseColor = '#ef4444';
          darkColor = '#dc2626';
          lightColor = '#fca5a5';
        } else if (snakeColor === '#111827') { // black
          baseColor = '#111827';
          darkColor = '#000000';
          lightColor = '#374151';
        } else if (snakeColor === '#f3f4f6') { // white
          baseColor = '#f3f4f6';
          darkColor = '#d1d5db';
          lightColor = '#ffffff';
        } else {
          // Fallback for any unrecognized colors - use default green
          console.log('⚠️ Unrecognized color, using fallback:', snakeColor);
          baseColor = '#22c55e';
          darkColor = '#15803d';
          lightColor = '#86efac';
        }
        shadowBlur = 3;
        shadowColor = baseColor;
      }

      // Gerçekçi yılan path - optimized
      const path = [];
      const segmentSize = GRID_SIZE * 0.65;
      const centerOffset = GRID_SIZE * 0.175;
      const pathLength = normalizedSnake.length;

      for (let i = 0; i < pathLength; i++) {
        const segment = normalizedSnake[i];
        const centerX = segment.x * GRID_SIZE + centerOffset;
        const centerY = segment.y * GRID_SIZE + centerOffset;
        path.push({ x: centerX, y: centerY, index: i });
      }

      // Ana gövde çizimi - segment segment
      if (path.length > 1) {
        // Gölge katmanı
        ctx.save();
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        for (let i = 1; i < path.length; i++) {
          const segment = path[i];
          ctx.beginPath();
          ctx.arc(segment.x + 2, segment.y + 2, segmentSize * 0.5, 0, 2 * Math.PI);
          
          // Gökkuşağı efekti için özel renk seçimi
          let segmentDarkColor = darkColor;
          
          if (snakeColor === 'gradient1') {
            const rainbow = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3'];
            const colorIndex = i % rainbow.length;
            segmentDarkColor = rainbow[colorIndex];
          } else if (snakeColor === 'gradient2') {
            const sunset = ['#f59e42','#fef08a','#a21caf','#ef4444','#fbbf24'];
            const colorIndex = i % sunset.length;
            segmentDarkColor = sunset[colorIndex];
          }
          
          ctx.fillStyle = segmentDarkColor;
          ctx.fill();
        }
        ctx.restore();

        // Ana gövde
        ctx.save();
        if (shadowBlur > 0) {
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = shadowBlur;
        }
        
        for (let i = 1; i < path.length; i++) {
          const segment = path[i];
          ctx.beginPath();
          ctx.arc(segment.x, segment.y, segmentSize * 0.5, 0, 2 * Math.PI);
          
          // Gökkuşağı efekti için özel renk seçimi
          let segmentBaseColor = baseColor;
          let segmentLightColor = lightColor;
          let segmentDarkColor = darkColor;
          
          if (snakeColor === 'gradient1') {
            // Gökkuşağı renkleri
            const rainbow = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3'];
            const colorIndex = i % rainbow.length;
            segmentBaseColor = rainbow[colorIndex];
            segmentLightColor = rainbow[colorIndex];
            segmentDarkColor = rainbow[colorIndex];
          } else if (snakeColor === 'gradient2') {
            // Gün batımı renkleri
            const sunset = ['#f59e42','#fef08a','#a21caf','#ef4444','#fbbf24'];
            const colorIndex = i % sunset.length;
            segmentBaseColor = sunset[colorIndex];
            segmentLightColor = sunset[colorIndex];
            segmentDarkColor = sunset[colorIndex];
          }
          
          // Segment gradient
          const segmentGradient = ctx.createRadialGradient(
            segment.x - segmentSize * 0.2, segment.y - segmentSize * 0.2, 0,
            segment.x, segment.y, segmentSize * 0.5
          );
          segmentGradient.addColorStop(0, segmentLightColor);
          segmentGradient.addColorStop(0.7, segmentBaseColor);
          segmentGradient.addColorStop(1, segmentDarkColor);
          
          ctx.fillStyle = segmentGradient;
          ctx.fill();
        }
        ctx.restore();

        // Üst parlaklık katmanı
        ctx.save();
        ctx.globalAlpha = 0.3;
        for (let i = 1; i < path.length; i++) {
          const segment = path[i];
          ctx.beginPath();
          ctx.arc(segment.x - segmentSize * 0.1, segment.y - segmentSize * 0.1, segmentSize * 0.2, 0, 2 * Math.PI);
          
          // Gökkuşağı efekti için özel renk seçimi
          let segmentLightColor = lightColor;
          
          if (snakeColor === 'gradient1') {
            const rainbow = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3'];
            const colorIndex = i % rainbow.length;
            segmentLightColor = rainbow[colorIndex];
          } else if (snakeColor === 'gradient2') {
            const sunset = ['#f59e42','#fef08a','#a21caf','#ef4444','#fbbf24'];
            const colorIndex = i % sunset.length;
            segmentLightColor = sunset[colorIndex];
          }
          
          ctx.fillStyle = segmentLightColor;
          ctx.fill();
        }
        ctx.restore();
      }

      // Gerçekçi baş çizimi
      const head = path[0];
      ctx.save();
      
      // Baş gölgesi
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Baş ana gövdesi
      let headBaseColor = baseColor;
      let headLightColor = lightColor;
      let headDarkColor = darkColor;
      
      if (snakeColor === 'gradient1') {
        const rainbow = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3'];
        headBaseColor = rainbow[0]; // Baş için ilk renk
        headLightColor = rainbow[0];
        headDarkColor = rainbow[0];
      } else if (snakeColor === 'gradient2') {
        const sunset = ['#f59e42','#fef08a','#a21caf','#ef4444','#fbbf24'];
        headBaseColor = sunset[0]; // Baş için ilk renk
        headLightColor = sunset[0];
        headDarkColor = sunset[0];
      }
      
      const headGradient = ctx.createRadialGradient(
        head.x, head.y, 0,
        head.x, head.y, segmentSize * 0.7
      );
      headGradient.addColorStop(0, headLightColor);
      headGradient.addColorStop(0.4, headBaseColor);
      headGradient.addColorStop(1, headDarkColor);
      
      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(head.x, head.y, segmentSize * 0.7, 0, 2 * Math.PI);
      ctx.fill();
      
      // Baş parlaklık efekti
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = headLightColor;
      ctx.beginPath();
      ctx.arc(head.x - segmentSize * 0.2, head.y - segmentSize * 0.2, segmentSize * 0.3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // Gerçekçi gözler
      ctx.save();
      
      // Göz gölgeleri
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.fillStyle = '#000';
      const eyeSize = segmentSize * 0.18;
      
      // Göz konumları yönüne göre
      if (direction === 'up' || direction === 'down') {
        // Yan yana
        ctx.beginPath();
        ctx.arc(head.x + segmentSize * 0.25, head.y - segmentSize * 0.15, eyeSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(head.x - segmentSize * 0.25, head.y - segmentSize * 0.15, eyeSize, 0, 2 * Math.PI);
        ctx.fill();
      } else if (direction === 'right') {
        // Alt alta sağda
        ctx.beginPath();
        ctx.arc(head.x + segmentSize * 0.15, head.y - segmentSize * 0.25, eyeSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(head.x + segmentSize * 0.15, head.y + segmentSize * 0.25, eyeSize, 0, 2 * Math.PI);
        ctx.fill();
      } else if (direction === 'left') {
        // Alt alta solda
        ctx.beginPath();
        ctx.arc(head.x - segmentSize * 0.15, head.y - segmentSize * 0.25, eyeSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(head.x - segmentSize * 0.15, head.y + segmentSize * 0.25, eyeSize, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Göz parlaklıkları
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#fff';
      const highlightSize = eyeSize * 0.3;
      
      if (direction === 'up' || direction === 'down') {
        ctx.beginPath();
        ctx.arc(head.x + segmentSize * 0.2, head.y - segmentSize * 0.2, highlightSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(head.x - segmentSize * 0.2, head.y - segmentSize * 0.2, highlightSize, 0, 2 * Math.PI);
        ctx.fill();
      } else if (direction === 'right') {
        ctx.beginPath();
        ctx.arc(head.x + segmentSize * 0.1, head.y - segmentSize * 0.3, highlightSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(head.x + segmentSize * 0.1, head.y + segmentSize * 0.2, highlightSize, 0, 2 * Math.PI);
        ctx.fill();
      } else if (direction === 'left') {
        ctx.beginPath();
        ctx.arc(head.x - segmentSize * 0.1, head.y - segmentSize * 0.3, highlightSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(head.x - segmentSize * 0.1, head.y + segmentSize * 0.2, highlightSize, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.restore();
      
      ctx.restore();
    }

    // Draw food with glow effect
    const normalizedFoodX = gameMode === 'free' ? ((food.x % GRID_COUNT) + GRID_COUNT) % GRID_COUNT : food.x
    const normalizedFoodY = gameMode === 'free' ? ((food.y % GRID_COUNT) + GRID_COUNT) % GRID_COUNT : food.y
    const foodX = normalizedFoodX * GRID_SIZE + 2
    const foodY = normalizedFoodY * GRID_SIZE + 2
    const foodSize = GRID_SIZE - 4
    
    // Glow effect
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 10
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.roundRect(foodX, foodY, foodSize, foodSize, 6)
    ctx.fill()
    ctx.shadowBlur = 0

    // Draw obstacles (only in campaign mode)
    if (gameMode === 'campaign') {
      obstacles.forEach(obstacle => {
        const x = obstacle.x * GRID_SIZE
        const y = obstacle.y * GRID_SIZE
        const width = obstacle.width * GRID_SIZE
        const height = obstacle.height * GRID_SIZE
        
        // Draw obstacle with gradient
        const obstacleGradient = ctx.createLinearGradient(x, y, x + width, y + height)
        obstacleGradient.addColorStop(0, '#dc2626')
        obstacleGradient.addColorStop(1, '#991b1b')
        ctx.fillStyle = obstacleGradient
        
        ctx.beginPath()
        ctx.roundRect(x + 1, y + 1, width - 2, height - 2, 3)
        ctx.fill()
        
        // Add border
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }

    // Draw bonus food with pulsing effect
    if (bonusFood) {
      const normalizedBonusX = gameMode === 'free' ? ((bonusFood.x % GRID_COUNT) + GRID_COUNT) % GRID_COUNT : bonusFood.x
      const normalizedBonusY = gameMode === 'free' ? ((bonusFood.y % GRID_COUNT) + GRID_COUNT) % GRID_COUNT : bonusFood.y
      const bonusX = normalizedBonusX * GRID_SIZE + 1
      const bonusY = normalizedBonusY * GRID_SIZE + 1
      const bonusSize = GRID_SIZE - 2
      
      // Pulsing glow effect
      const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7
      ctx.shadowColor = '#a855f7'
      ctx.shadowBlur = 15 * pulse
      ctx.fillStyle = '#a855f7'
      ctx.beginPath()
      ctx.roundRect(bonusX, bonusY, bonusSize, bonusSize, 6)
      ctx.fill()
      ctx.shadowBlur = 0
      
      // Draw coin value with better styling
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 11px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(
        `+${bonusFood.value}`,
        normalizedBonusX * GRID_SIZE + GRID_SIZE / 2,
        normalizedBonusY * GRID_SIZE + GRID_SIZE / 2 + 3
      )
    }
  }, [snake, food, bonusFood, obstacles, gameMode, snakeColor, direction])

  // Optimized game loop - setInterval ile daha kontrollü hız
  useEffect(() => {
    if (gameState !== 'playing') return

    let animationFrameId
    let lastDrawTime = 0
    const drawInterval = 1000 / 60 // 60 FPS render

    // Yılan hareketi için setInterval kullan
    const moveInterval = setInterval(() => {
      moveSnake()
    }, gameSpeed)

    // Render için requestAnimationFrame kullan
    const gameLoop = (currentTime) => {
      if (currentTime - lastDrawTime >= drawInterval) {
        drawGame()
        lastDrawTime = currentTime
      }
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    animationFrameId = requestAnimationFrame(gameLoop)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (moveInterval) {
        clearInterval(moveInterval)
      }
    }
  }, [gameState, gameSpeed, moveSnake, drawGame])

  // Menu draw loop - sadece menü için (optimized)
  useEffect(() => {
    if (gameState !== 'menu') return

    let animationFrameId
    let lastDrawTime = 0
    const drawInterval = 1000 / 15 // Menu için 15 FPS yeterli

    const drawLoop = (currentTime) => {
      if (currentTime - lastDrawTime >= drawInterval) {
        drawGame()
        lastDrawTime = currentTime
      }
      animationFrameId = requestAnimationFrame(drawLoop)
    }

    animationFrameId = requestAnimationFrame(drawLoop)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [gameState, drawGame])

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  // Bonus food timer - optimized
  useEffect(() => {
    if (bonusTimer > 0 && gameState === 'playing') {
      const timer = setTimeout(() => {
        setBonusTimer(prev => {
          if (prev <= 1) {
            setBonusFood(null)
            return 0
          }
          return prev - 1
        })
      }, gameSpeed)
      return () => clearTimeout(timer)
    }
  }, [bonusTimer, gameSpeed, gameState])

  // Basit ve güvenilir survival timer
  const startSurvivalTimer = useCallback(() => {
    console.log('⏰ startSurvivalTimer called')
    
    // Önceki timer'ı temizle
    if (survivalTimerRef.current) {
      console.log('⏰ Clearing previous survival timer:', survivalTimerRef.current)
      clearInterval(survivalTimerRef.current)
      survivalTimerRef.current = null
    }
    
    // Timer'ı sıfırla
    setSurvivalTime(0)
    
    // Test için hemen bir tick yap
    console.log('⏰ Setting initial survival time to 0')
    
    // Yeni timer başlat - daha basit
    const timerId = setInterval(() => {
      console.log('⏰ TIMER TICK - BEFORE SETSTATE')
      setSurvivalTime(prev => {
        const newTime = prev + 1
        console.log('⏰ TIMER TICK - NEW TIME:', newTime)
        return newTime
      })
    }, 1000)
    
    survivalTimerRef.current = timerId
    console.log('⏰ Survival timer started with ID:', timerId)
    
    // Test için 1 saniye sonra kontrol et
    setTimeout(() => {
      console.log('⏰ 1 second later - timer ID still exists:', survivalTimerRef.current)
    }, 1000)
  }, [])
  
  const stopSurvivalTimer = useCallback(() => {
    console.log('⏰ stopSurvivalTimer called')
    if (survivalTimerRef.current) {
      console.log('⏰ Stopping survival timer:', survivalTimerRef.current)
      clearInterval(survivalTimerRef.current)
      survivalTimerRef.current = null
    }
  }, [])
  
  // Timer'ı sadece manuel olarak yönet - useEffect kullanma
  // useEffect(() => {
  //   console.log('⏰ Game state changed:', gameState)
  //   
  //   if (gameState === 'playing') {
  //     console.log('⏰ Starting survival timer for playing state')
  //     startSurvivalTimer()
  //   } else {
  //     console.log('⏰ Stopping survival timer for non-playing state')
  //     stopSurvivalTimer()
  //     if (gameState !== 'paused') {
  //       setSurvivalTime(0)
  //     }
  //   }
  //   
  //   return () => {
  //     stopSurvivalTimer()
  //   }
  // }, [gameState, startSurvivalTimer, stopSurvivalTimer])

  // Handle game over
  useEffect(() => {
    if (gameState === 'gameOver' && !updatedRef.current) {
      const finalCoins = gameMode === 'campaign' ? campaignCoins : coins;
      const finalScore = gameMode === 'campaign' ? campaignScore : score;
      
      // 2x coin multiplier kontrolü
      const isDoubleCoins = false; // 2x coin geçici olarak devre dışı
      const multiplier = isDoubleCoins ? 2 : 1;
      const totalCoinsEarned = finalCoins * multiplier;

      // Update coins in store immediately
      updateCoins(userCoins + totalCoinsEarned);
      
      // Update total score
      updateTotalScore(finalScore);
      
      // Update high score if needed
      if (finalScore > highScore) {
        updateHighScore(finalScore);
      }
      
      // Görev ve başarım güncellemeleri
      updateTaskProgress('games_played', 1)
      updateTaskProgress('score_reached', finalScore)
      
      // Survival time'ı oyun sonunda da güncelle (kalan süreyi ekle)
      if (survivalTime > 0) {
        updateTaskProgress('survival_time', survivalTime)
      }
      
      // İstatistikleri güncelle
      updateStats({
        totalCoins: userCoins + totalCoinsEarned,
        gamesPlayed: (stats?.gamesPlayed || 0) + 1, // Mevcut oyun sayısına +1 ekle
        highScore: Math.max(finalScore, highScore),
        survivalTime: Math.max(survivalTime, 0),
        dailyStreak: streakDays,
        colorsUnlocked: 1 // Başlangıçta 1 renk açık
      })
      
      // Bir oyunluk ürünleri sıfırla (geçici olarak devre dışı)
      // resetOneGameItems()
      
      // Süresi biten ürünleri temizle (geçici olarak devre dışı)
      // cleanupExpiredItems()
      
      // Force a re-render to update UI
      setTimeout(() => {
      }, 100);
      
      updatedRef.current = true;
    }
    if (gameState !== 'gameOver') {
      updatedRef.current = false;
    }
  }, [gameState, coins, score, campaignCoins, campaignScore, highScore, updateCoins, updateHighScore, user, survivalTime, updateTaskProgress, updateStats]);

  // Force re-render when user coins changes
  useEffect(() => {
  }, [userCoins]);

  // Game speed'i sadece game mode değiştiğinde ayarla
  useEffect(() => {
    // Sabit game speed - daha yavaş ve kontrollü
    if (gameMode === 'campaign') {
      // Kampanya modu için level'a göre speed
      const levelSpeed = LEVELS[currentLevel]?.speed || 500
      setGameSpeed(levelSpeed)
    } else {
      // Free mode için sabit speed
              setGameSpeed(80) // 80ms = 12.5 kare/saniye başlangıç
    }
  }, [gameMode, currentLevel]) // LEVELS dependency'sini kaldırdık

  const startGame = (mode = 'free', level = 1) => {
    console.log('🎮 Starting game:', { mode, level })
    setGameMode(mode)
    setAdWatched(false)
    setCanWatchAd(true)
    setFreeModeAdCount(0)
    setCampaignAdCount(0) // Kampanya modu için reklam sayısını sıfırla
    setLevelAdCount(0) // Her level için reklam sayısını sıfırla
    
    // Timer'ı önce başlat
    console.log('⏰ Starting timer before game init')
    startSurvivalTimer()
    
    // Oyunu hemen başlat
    initGame(mode, level)
    setGameState('playing')
  }

  const pauseGame = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing')
  }

  const restartGame = () => {
    console.log('🔄 Restarting game')
    
    if (gameMode === 'campaign') {
      // Campaign mode - restart from level 1
      initGame('campaign', 1)
      setCurrentLevel(1)
      setCampaignScore(0) // Kampanya score'unu sıfırla
      setCampaignCoins(0) // Kampanya coin'lerini sıfırla
    } else {
      // Free mode - restart from beginning
      initGame('free', 1)
    }
    // Timer'ı önce başlat
    console.log('⏰ Starting timer before restart')
    startSurvivalTimer()
    
    setAdWatched(false)
    setCanWatchAd(true)
    setFreeModeAdCount(0)
    setCampaignAdCount(0) // Kampanya reklam sayısını sıfırla
    setLevelAdCount(0) // Her level için reklam sayısını sıfırla
    setGameState('playing')
  }

  const goToMenu = () => {
    setGameState('menu')
  }

  // Watch ad function
  const watchAd = () => {
    console.log('📺 Reklam izleniyor...')
    
    // Reklam izleme simülasyonu (gerçek reklam entegrasyonu için burayı değiştirin)
    const simulateAdWatching = () => {
      // Reklam izleme başladı
      setGameState('adWatching')
      setAdProgress(0)
      
      // İlerleme çubuğu animasyonu
      const progressInterval = setInterval(() => {
        setAdProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 2
        })
      }, 60) // 3 saniye = 3000ms / 50 adım = 60ms per adım
      
      // 3 saniye sonra reklam biter (gerçek reklam için bu süreyi kaldırın)
      setTimeout(() => {
        console.log('📺 Reklam tamamlandı!')
        clearInterval(progressInterval)
        setAdProgress(100)
        
        // Kısa bir bekleme sonrası oyuna devam et
        setTimeout(() => {
          // Tüm state'leri senkronize şekilde güncelle
          if (gameMode === 'campaign') {
            setAdWatched(true)
            setLevelAdCount(prev => prev + 1) // Her level için ayrı reklam sayısı
            
            // Kampanya modu için reklam hakkı kontrolü (her levelde 1 defa)
            if (levelAdCount >= 0) {
              setCanWatchAd(false)
            }
            
            // Güvenli pozisyon hesapla - engellerden uzak
            const safePosition = calculateSafePosition(true) // true = engellerden uzak pozisyon
            
            // State güncellemelerini tek seferde yap - score ve coins'i sıfırlama!
            setSnake(safePosition.snake)
            setGameSpeed(LEVELS[currentLevel]?.speed || 80)
            setObstacles(LEVELS[currentLevel]?.obstacles || [])
            setBonusFood(null)
            setBonusTimer(0)
            // Zaman sayacını sıfırlama - oyun devam ediyor
            // setGameStartTime(Date.now()) // Oyun başlangıç zamanını sıfırla
            // setSurvivalTime(0) // Survival time'ı sıfırla
            
            // Food'u en son generate et ve oyunu başlat
            setTimeout(() => {
              generateFood()
              // Oyunu başlatmadan önce kısa bir bekleme
              requestAnimationFrame(() => {
                setGameState('playing')
              })
            }, 50)
          } else {
            // Free mode - track ad count
            setFreeModeAdCount(prev => prev + 1)
            if (freeModeAdCount >= 1) {
              setCanWatchAd(false)
            }
            
            // Güvenli pozisyon hesapla
            const safePosition = calculateSafePosition()
            
            // State güncellemelerini tek seferde yap
            setSnake(safePosition.snake)
            // Zaman sayacını sıfırlama - oyun devam ediyor
            // setGameStartTime(Date.now()) // Oyun başlangıç zamanını sıfırla
            // setSurvivalTime(0) // Survival time'ı sıfırla
            
            setTimeout(() => {
              // Oyunu başlatmadan önce kısa bir bekleme
              requestAnimationFrame(() => {
                setGameState('playing')
              })
            }, 50)
          }
        }, 300) // Bekleme süresini azalttık
      }, 3000) // 3 saniye simülasyon
    }
    
    simulateAdWatching()
  }

  // Güvenli pozisyon hesaplama fonksiyonu
  const calculateSafePosition = (avoidObstacles = false) => {
    const currentSnakeLength = snake.length
    
    // Merkeze yakın güvenli bir pozisyon bul
    let newHeadX = Math.floor(GRID_COUNT / 2)
    let newHeadY = Math.floor(GRID_COUNT / 2)
    
    // Engellerden uzak pozisyon hesapla (kampanya modu için)
    if (avoidObstacles && gameMode === 'campaign' && obstacles.length > 0) {
      let attempts = 0
      const maxAttempts = 50
      
      while (attempts < maxAttempts) {
        // Rastgele güvenli pozisyon dene
        newHeadX = Math.floor(Math.random() * (GRID_COUNT - 10)) + 5
        newHeadY = Math.floor(Math.random() * (GRID_COUNT - 10)) + 5
        
        // Bu pozisyonun engellerden uzak olup olmadığını kontrol et
        const isSafe = !obstacles.some(obstacle => 
          newHeadX >= obstacle.x && 
          newHeadX < obstacle.x + obstacle.width &&
          newHeadY >= obstacle.y && 
          newHeadY < obstacle.y + obstacle.height
        )
        
        if (isSafe) {
          break // Güvenli pozisyon bulundu
        }
        
        attempts++
      }
      
      // Eğer güvenli pozisyon bulunamazsa, merkeze yakın bir yer kullan
      if (attempts >= maxAttempts) {
        newHeadX = Math.floor(GRID_COUNT / 2)
        newHeadY = Math.floor(GRID_COUNT / 2)
      }
    } else {
      // Normal güvenli pozisyon hesapla
      switch (direction) {
        case 'right':
          newHeadX = Math.max(5, Math.min(GRID_COUNT - 6, newHeadX))
          break
        case 'left':
          newHeadX = Math.max(5, Math.min(GRID_COUNT - 6, newHeadX))
          break
        case 'up':
          newHeadY = Math.max(5, Math.min(GRID_COUNT - 6, newHeadY))
          break
        case 'down':
          newHeadY = Math.max(5, Math.min(GRID_COUNT - 6, newHeadY))
          break
      }
    }
    
    // Yılanı güvenli pozisyonda oluştur
    const newSnake = []
    for (let i = 0; i < currentSnakeLength; i++) {
      let segmentX = newHeadX
      let segmentY = newHeadY
      
      // Yılanın her segmentini yönüne göre yerleştir
      switch (direction) {
        case 'right':
          segmentX = newHeadX - i
          break
        case 'left':
          segmentX = newHeadX + i
          break
        case 'up':
          segmentY = newHeadY + i
          break
        case 'down':
          segmentY = newHeadY - i
          break
      }
      
      // Sınırlar içinde tut
      segmentX = Math.max(0, Math.min(GRID_COUNT - 1, segmentX))
      segmentY = Math.max(0, Math.min(GRID_COUNT - 1, segmentY))
      
      // Engellerden uzak pozisyon kontrolü (kampanya modu için)
      if (avoidObstacles && gameMode === 'campaign' && obstacles.length > 0) {
        const isSegmentSafe = !obstacles.some(obstacle => 
          segmentX >= obstacle.x && 
          segmentX < obstacle.x + obstacle.width &&
          segmentY >= obstacle.y && 
          segmentY < obstacle.y + obstacle.height
        )
        
        if (!isSegmentSafe) {
          // Eğer segment güvenli değilse, merkeze yakın güvenli bir pozisyon bul
          let safeSegmentX = Math.floor(GRID_COUNT / 2)
          let safeSegmentY = Math.floor(GRID_COUNT / 2)
          
          // Yönüne göre güvenli pozisyon ayarla
          switch (direction) {
            case 'right':
              safeSegmentX = Math.max(5, Math.min(GRID_COUNT - 6, safeSegmentX - i))
              break
            case 'left':
              safeSegmentX = Math.max(5, Math.min(GRID_COUNT - 6, safeSegmentX + i))
              break
            case 'up':
              safeSegmentY = Math.max(5, Math.min(GRID_COUNT - 6, safeSegmentY + i))
              break
            case 'down':
              safeSegmentY = Math.max(5, Math.min(GRID_COUNT - 6, safeSegmentY - i))
              break
          }
          
          segmentX = safeSegmentX
          segmentY = safeSegmentY
        }
      }
      
      newSnake.push({ x: segmentX, y: segmentY })
    }
    
    return { snake: newSnake }
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section - Daha Küçük */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="flex items-center justify-center mb-2">
            <img src="/yazı.png" alt="Serpyx Yazı" className="h-12 md:h-16" />
          </div>
          
          {/* Game Stats Bar - Daha Kompakt */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-2 mb-3">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              <div className="flex items-center justify-center space-x-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded p-1 border border-yellow-500/30">
                <span className="text-sm">🏆</span>
                <div className="text-left">
                  <p className="text-yellow-400 text-xs font-medium">{t('score').toUpperCase()}</p>
                  <p className="text-white font-bold text-xs">{gameMode === 'campaign' ? campaignScore : score}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded p-1 border border-yellow-500/30">
                <img src="/coin.PNG" alt="Coin" className="w-4 h-4 rounded-full" />
                <div className="text-left">
                  <p className="text-yellow-400 text-xs font-medium">{t('coins').toUpperCase()}</p>
                  <p className="text-white font-bold text-xs">{gameMode === 'campaign' ? campaignCoins : coins}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded p-1 border border-blue-500/30">
                <span className="text-sm">💰</span>
                <div className="text-left">
                  <p className="text-blue-400 text-xs font-medium">{t('total').toUpperCase()}</p>
                  <p className="text-white font-bold text-xs">{(userCoins || 0) + (coins || 0)}</p>
                </div>
              </div>
              
              {gameMode === 'campaign' && (
                <div className="flex items-center justify-center space-x-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded p-1 border border-orange-500/30">
                  <span className="text-sm">🎯</span>
                  <div className="text-left">
                    <p className="text-orange-400 text-xs font-medium">{t('targetScore').toUpperCase()}</p>
                    <p className="text-white font-bold text-xs">{LEVELS[currentLevel]?.targetScore || 0}</p>
                  </div>
                </div>
              )}
              
              {/* Kampanya modu göstergesi */}
              {gameMode === 'campaign' && (
                <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                      <img src="/oyun sayfası ikon/kurallar.png" alt="Kampanya" className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-xs">{t('level')} {currentLevel}/20</p>
                      <p className="text-white font-bold text-xs">{LEVELS[currentLevel]?.name || 'Bilinmeyen'}</p>
                      <p className="text-yellow-400 font-bold text-xs">{t('targetScore')}: {LEVELS[currentLevel]?.targetScore || 0}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {bonusTimer > 0 && (
                <div className="flex items-center justify-center space-x-1 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded p-1 border border-purple-500/30 animate-pulse">
                  <span className="text-sm">⏰</span>
                  <div className="text-left">
                    <p className="text-purple-400 text-xs font-medium">{t('bonusLevel').toUpperCase()}</p>
                    <p className="text-white font-bold text-xs">{bonusTimer}</p>
                  </div>
                </div>
              )}
              
              {/* SPX ürünleri geçici olarak devre dışı */}
              
              {gameState === 'playing' && (
                <div className="flex items-center justify-center space-x-1 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded p-1 border border-green-500/30">
                  <span className="text-sm">⏱️</span>
                  <div className="text-left">
                    <p className="text-green-400 text-xs font-medium">{t('survivalTime').toUpperCase()}</p>
                    <p className="text-white font-bold text-xs">{Math.floor(survivalTime / 60)}:{(survivalTime % 60).toString().padStart(2, '0')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Game Canvas - Maksimum Büyük */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex justify-center items-center"
          >
            <div className="relative">
              {/* Canvas Container with Theme Background */}
              <div 
                className="relative rounded-2xl p-2 shadow-2xl border border-gray-700 overflow-hidden"
                style={gameAreaStyle}
              >
                <canvas
                  ref={canvasRef}
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  className="game-canvas rounded-xl shadow-lg block"
                  style={{ maxWidth: '100%', maxHeight: '80vh', height: 'auto' }}
                />
              </div>
              
              {/* Game Overlay - Daha Kompakt */}
              {gameState === 'menu' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
                  <div className="text-center bg-gray-900/90 rounded-xl p-4 border border-gray-700 shadow-2xl">
                    <img src="/yazı.png" alt="Serpyx Yazı" className="h-12 mx-auto mb-2" />
                    <p className="text-gray-300 mb-4 text-sm">{t('selectGameMode')}</p>
                    <div className="space-y-2">
                      <button 
                        onClick={() => startGame('free')} 
                        className="w-full bg-gradient-to-r from-snake-400 to-snake-600 hover:from-snake-500 hover:to-snake-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                      >
                        <div className="w-4 h-4 bg-black rounded mr-2 flex items-center justify-center">
                          <img src="/oyun sayfası ikon/kontroller.png" alt="Kontroller" className="w-3 h-3" />
                        </div>
                        {t('freeMode')}
                      </button>
                                              <button 
                          onClick={() => startGame('campaign', 1)}
                          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                          onMouseEnter={playHoverSound}
                      >
                        <div className="w-4 h-4 bg-black rounded mr-2 flex items-center justify-center">
                          <img src="/oyun sayfası ikon/kurallar.png" alt="Kurallar" className="w-3 h-3" />
                        </div>
                        {t('campaignMode')} (20 {t('level')})
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {gameState === 'paused' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
                  <div className="text-center bg-gray-900/90 rounded-xl p-4 border border-gray-700 shadow-2xl">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 bg-yellow-500/20 border border-yellow-500/30">
                      <img src="/oyun sayfası ikon/space.png" alt="Pause" className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-3">{t('gamePaused')}</h2>
                    <div className="space-y-2">
                      <button onClick={pauseGame} className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                        <div className="w-3 h-3 bg-black rounded mr-2 flex items-center justify-center">
                          <img src="/oyun sayfası ikon/yukarı.png" alt="Devam" className="w-2 h-2" />
                        </div>
                        {t('resumeGame')}
                      </button>
                      <button onClick={restartGame} className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                        <div className="w-3 h-3 bg-black rounded mr-2 flex items-center justify-center">
                          <img src="/oyun sayfası ikon/sağ.png" alt="Yeniden Başlat" className="w-2 h-2" />
                        </div>
                        {t('restartGame')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {gameState === 'levelComplete' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
                  <div className="text-center bg-gray-900/90 rounded-xl p-4 border border-gray-700 shadow-2xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <h2 className="text-xl font-bold text-green-400 mb-3">{t('levelComplete')}!</h2>
                    <div className="space-y-1 mb-3 text-sm">
                      <p className="text-gray-300">{t('level')} {currentLevel}: {LEVELS[currentLevel]?.name}</p>
                      <p className="text-white font-bold">{t('score')}: {campaignScore}</p>
                      <p className="text-yellow-400 font-bold">{t('coinReward')}: {LEVELS[currentLevel]?.coinReward || 0}</p>
                      {LEVELS[currentLevel]?.bonusCoin && (
                        <p className="text-orange-400 font-bold">{t('bonusCoin')}: +{LEVELS[currentLevel].bonusCoin}</p>
                      )}
                      {LEVELS[currentLevel]?.isBonusLevel && (
                        <p className="text-purple-400 font-bold">{t('bonusLevelComplete')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {currentLevel < 20 ? (
                        <button 
                          onClick={() => {
                            setLevelAdCount(0) // Her level için reklam sayısını sıfırla
                            setCanWatchAd(true) // Reklam izleme hakkını yenile
                            startGame('campaign', currentLevel + 1)
                          }} 
                          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <span className="text-sm mr-2">🚀</span>
                          {t('nextLevel')} ({currentLevel + 1}/20)
                        </button>
                      ) : (
                        <button 
                          onClick={() => setGameState('menu')} 
                          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <span className="text-sm mr-2">🏆</span>
                          {t('campaignComplete')}!
                        </button>
                      )}
                      <button onClick={goToMenu} className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                        <span className="text-sm mr-2">🏠</span>
                        Ana Menü
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {gameState === 'gameOver' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
                  <div className="text-center bg-gray-900/90 rounded-xl p-4 border border-gray-700 shadow-2xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">💀</span>
                    </div>
                    <h2 className="text-xl font-bold text-red-400 mb-3">{t('gameOver')}!</h2>
                    <div className="space-y-1 mb-3 text-sm">
                      <p className="text-white font-bold">{t('finalScore')}: {gameMode === 'campaign' ? campaignScore : score}</p>
                      <p className="text-yellow-400 font-bold">{t('earnedCoins')}: {gameMode === 'campaign' ? campaignCoins : coins}</p>
                      {/* 2x Coin Multiplier geçici olarak devre dışı */}
                      {gameMode === 'campaign' && (
                        <p className="text-blue-400">{t('level')} {currentLevel}: {LEVELS[currentLevel]?.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {/* Reklam İzleme ve Yeniden Başlama Butonları */}
                      {canWatchAd && (gameMode === 'free' ? freeModeAdCount < 2 : levelAdCount < 1) ? (
                        <button 
                          onClick={watchAd} 
                          className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <div className="flex items-center justify-center">
                            <span className="text-lg mr-2">📺</span>
                            <div className="text-left">
                              <div className="font-bold">{t('watchAdContinue')}</div>
                              <div className="text-xs opacity-80">
                                {gameMode === 'free' 
                                  ? `(${freeModeAdCount + 1}/2 kullanım hakkı)` 
                                  : `(${levelAdCount + 1}/1 kullanım hakkı)`
                                }
                              </div>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <button 
                          onClick={restartGame} 
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <div className="flex items-center justify-center">
                            <span className="text-lg mr-2">🔄</span>
                            <div className="text-left">
                              <div className="font-bold">{t('startOver')}</div>
                              <div className="text-xs opacity-80">Yeni oyun başlat</div>
                            </div>
                          </div>
                        </button>
                      )}
                      <button onClick={goToMenu} className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                        <span className="text-sm mr-2">🏠</span>
                        Ana Menü
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reklam İzleme Ekranı */}
              {gameState === 'adWatching' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
                  <div className="text-center bg-gray-900/95 rounded-xl p-6 border border-yellow-500/30 shadow-2xl">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <span className="text-3xl">📺</span>
                    </div>
                    <h2 className="text-2xl font-bold text-yellow-400 mb-3">Reklam İzleniyor</h2>
                    <div className="space-y-2 mb-4">
                      <p className="text-white text-sm">Lütfen reklamı sonuna kadar izleyin</p>
                      <p className="text-yellow-300 text-xs">Reklam tamamlandığında otomatik olarak devam edeceksiniz</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300 ease-out" 
                        style={{width: `${adProgress}%`}}
                      ></div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">
                        {adProgress < 100 ? `Reklam izleniyor... ${adProgress}%` : 'Reklam tamamlandı!'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Game Info - Çok Küçük */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-60"
          >
            {/* Controls Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600/50 rounded-2xl p-4 mb-4 shadow-2xl shadow-black/20">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <img src="/oyun sayfası ikon/kontroller.png" alt="Kontroller" className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t('controls')}</h3>
              </div>
              
              {/* Directional Controls */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                      <img src="/oyun sayfası ikon/yukarı.png" alt="Yukarı" className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-center text-gray-200 text-sm font-medium">{t('up')}</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                      <img src="/oyun sayfası ikon/aşağı.png" alt="Aşağı" className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-center text-gray-200 text-sm font-medium">{t('down')}</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <img src="/oyun sayfası ikon/sol.png" alt="Sol" className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-center text-gray-200 text-sm font-medium">{t('left')}</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <img src="/oyun sayfası ikon/sağ.png" alt="Sağ" className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-center text-gray-200 text-sm font-medium">{t('right')}</p>
                </motion.div>
              </div>
              
              {/* Space Control */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <img src="/oyun sayfası ikon/space.png" alt="Space" className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-yellow-300 text-sm font-bold">Space</p>
                  <p className="text-yellow-200/70 text-xs">Duraklat</p>
                </div>
              </motion.div>
            </div>

            {/* Rules Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600/50 rounded-2xl p-4 mb-4 shadow-2xl shadow-black/20">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <img src="/oyun sayfası ikon/kurallar.png" alt="Kurallar" className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{t('rules')}</h3>
              </div>
              
              <div className="space-y-3">
                {/* Normal Food */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-yellow-800 text-lg">🟡</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-yellow-200 font-bold text-sm">{t('normalFood')}</p>
                      <p className="text-yellow-200/70 text-xs">{t('earnCoin')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-yellow-300 font-bold text-lg">+1</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Bonus Food */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-purple-800 text-lg">🟣</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-purple-200 font-bold text-sm">{t('bonusFood')}</p>
                      <p className="text-purple-200/70 text-xs">{t('earnCoins')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-purple-300 font-bold text-lg">+5-10</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Wall Collision */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-sm rounded-xl p-3 border border-red-500/30 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-red-800 text-lg">🚫</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-red-200 font-bold text-sm">{t('wallCollision')}</p>
                      <p className="text-red-200/70 text-xs">{t('gameEnds')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-red-300 font-bold text-lg">❌</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Speed Increase */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-blue-800 text-lg">⚡</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-200 font-bold text-sm">{t('speedIncrease')}</p>
                      <p className="text-blue-200/70 text-xs">{t('speedsUpEvery5')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-blue-300 font-bold text-lg">+5</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Game Status */}
            {gameState === 'playing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600/50 rounded-2xl p-4 shadow-2xl shadow-black/20"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <span className="text-white text-lg">📊</span>
                  </div>
                  <h3 className="text-lg font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Oyun Durumu</h3>
                </div>
                
                <div className="space-y-3">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-3 border border-indigo-500/30 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-indigo-800 text-xs">⚡</span>
                        </div>
                        <span className="text-indigo-200 font-medium text-sm">FPS</span>
                      </div>
                      <span className="text-indigo-300 font-bold text-lg">{fps}</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-3 border border-green-500/30 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-green-800 text-xs">🐍</span>
                        </div>
                        <span className="text-green-200 font-medium text-sm">Uzunluk</span>
                      </div>
                      <span className="text-green-300 font-bold text-lg">{snake.length}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Reklam Alanı - Oyun Sonrası */}
      {gameState === 'gameOver' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <AdBanner 
            adSlot="1234567891"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-2"
            style={{ minHeight: '90px', width: '320px' }}
          />
        </motion.div>
      )}
    </div>
  )
}

export default Game 