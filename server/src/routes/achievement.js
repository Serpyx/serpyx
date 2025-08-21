import express from 'express'
import { authenticateToken } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import databaseService from '../../services/databaseService.js'

const router = express.Router()

// Health check for achievement routes
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Achievement routes working',
    timestamp: new Date().toISOString()
  })
})

// Get user achievements
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const achievements = await databaseService.getUserAchievements(userId)

  res.json({
    success: true,
    achievements
  })
}))

// Create achievement (admin only - for testing)
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { type, name, description, points } = req.body

  if (!type || !name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Tüm alanlar gereklidir'
    })
  }

  // Check if achievement already exists for this user
  const existingAchievements = await databaseService.getUserAchievements(userId)
  const alreadyExists = existingAchievements.some(achievement => 
    achievement.achievement_type === type && achievement.achievement_name === name
  )

  if (alreadyExists) {
    return res.status(400).json({
      success: false,
      message: 'Bu başarım zaten kazanılmış'
    })
  }

  const achievement = await databaseService.createAchievement(userId, {
    type,
    name,
    description,
    points: points || 0
  })

  res.status(201).json({
    success: true,
    message: 'Başarım kazanıldı!',
    achievement
  })
}))

// Get achievement statistics
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const achievements = await databaseService.getUserAchievements(userId)
  
  const totalAchievements = achievements.length
  const totalPoints = achievements.reduce((sum, achievement) => sum + (achievement.points || 0), 0)
  
  // Group by type
  const achievementsByType = achievements.reduce((acc, achievement) => {
    const type = achievement.achievement_type
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(achievement)
    return acc
  }, {})

  res.json({
    success: true,
    stats: {
      totalAchievements,
      totalPoints,
      achievementsByType
    }
  })
}))

// Get global achievement leaderboard
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50

  const result = await databaseService.query(`
    SELECT 
      u.username,
      COUNT(a.id) as achievement_count,
      SUM(a.points) as total_points
    FROM users u
    LEFT JOIN achievements a ON u.id = a.user_id
    WHERE u.is_verified = true
    GROUP BY u.id, u.username
    HAVING COUNT(a.id) > 0
    ORDER BY total_points DESC, achievement_count DESC
    LIMIT $1
  `, [limit])

  const leaderboard = result.rows

  res.json({
    success: true,
    leaderboard,
    total: leaderboard.length
  })
}))

// Get recent achievements
router.get('/recent', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20

  const result = await databaseService.query(`
    SELECT 
      u.username,
      a.achievement_name,
      a.achievement_type,
      a.points,
      a.earned_at
    FROM achievements a
    JOIN users u ON a.user_id = u.id
    WHERE u.is_verified = true
    ORDER BY a.earned_at DESC
    LIMIT $1
  `, [limit])

  const recentAchievements = result.rows

  res.json({
    success: true,
    recentAchievements,
    total: recentAchievements.length
  })
}))

export default router






















  const userId = req.user.id
  const { type, name, description, points } = req.body

  if (!type || !name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Tüm alanlar gereklidir'
    })
  }

  // Check if achievement already exists for this user
  const existingAchievements = await databaseService.getUserAchievements(userId)
  const alreadyExists = existingAchievements.some(achievement => 
    achievement.achievement_type === type && achievement.achievement_name === name
  )

  if (alreadyExists) {
    return res.status(400).json({
      success: false,
      message: 'Bu başarım zaten kazanılmış'
    })
  }

  const achievement = await databaseService.createAchievement(userId, {
    type,
    name,
    description,
    points: points || 0
  })

  res.status(201).json({
    success: true,
    message: 'Başarım kazanıldı!',
    achievement
  })
}))

// Get achievement statistics
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const achievements = await databaseService.getUserAchievements(userId)
  
  const totalAchievements = achievements.length
  const totalPoints = achievements.reduce((sum, achievement) => sum + (achievement.points || 0), 0)
  
  // Group by type
  const achievementsByType = achievements.reduce((acc, achievement) => {
    const type = achievement.achievement_type
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(achievement)
    return acc
  }, {})

  res.json({
    success: true,
    stats: {
      totalAchievements,
      totalPoints,
      achievementsByType
    }
  })
}))

// Get global achievement leaderboard
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50

  const result = await databaseService.query(`
    SELECT 
      u.username,
      COUNT(a.id) as achievement_count,
      SUM(a.points) as total_points
    FROM users u
    LEFT JOIN achievements a ON u.id = a.user_id
    WHERE u.is_verified = true
    GROUP BY u.id, u.username
    HAVING COUNT(a.id) > 0
    ORDER BY total_points DESC, achievement_count DESC
    LIMIT $1
  `, [limit])

  const leaderboard = result.rows

  res.json({
    success: true,
    leaderboard,
    total: leaderboard.length
  })
}))

// Get recent achievements
router.get('/recent', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20

  const result = await databaseService.query(`
    SELECT 
      u.username,
      a.achievement_name,
      a.achievement_type,
      a.points,
      a.earned_at
    FROM achievements a
    JOIN users u ON a.user_id = u.id
    WHERE u.is_verified = true
    ORDER BY a.earned_at DESC
    LIMIT $1
  `, [limit])

  const recentAchievements = result.rows

  res.json({
    success: true,
    recentAchievements,
    total: recentAchievements.length
  })
}))

export default router





















