import express from 'express'
import { authenticateToken } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import databaseService from '../../services/databaseService.js'

const router = express.Router()

// Health check for game routes
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Game routes working',
    timestamp: new Date().toISOString()
  })
})

// Save game session
router.post('/save-session', authenticateToken, asyncHandler(async (req, res) => {
  const { score, coinsEarned, durationSeconds, gameMode } = req.body
  const userId = req.user.id

  if (!score || score < 0) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz skor'
    })
  }

  // Create game session
  const session = await databaseService.createGameSession(userId, {
    score,
    coinsEarned: coinsEarned || 0,
    durationSeconds: durationSeconds || 0,
    gameMode: gameMode || 'classic'
  })

  // Update user stats
  const currentUser = await databaseService.findUserById(userId)
  const newStats = {
    coins: (currentUser.coins || 0) + (coinsEarned || 0),
    spxBalance: currentUser.spx_balance || 0,
    highScore: Math.max(currentUser.high_score || 0, score),
    totalScore: (currentUser.total_score || 0) + score
  }

  const updatedUser = await databaseService.updateUserStats(userId, newStats)

  res.json({
    success: true,
    message: 'Oyun oturumu kaydedildi',
    session,
    updatedStats: {
      coins: updatedUser.coins,
      spxBalance: updatedUser.spx_balance,
      highScore: updatedUser.high_score,
      totalScore: updatedUser.total_score
    }
  })
}))

// Get user game sessions
router.get('/sessions', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id
  const limit = parseInt(req.query.limit) || 10

  const sessions = await databaseService.getUserGameSessions(userId, limit)

  res.json({
    success: true,
    sessions
  })
}))

// Get user game stats
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const user = await databaseService.findUserById(userId)
  const sessions = await databaseService.getUserGameSessions(userId, 50)

  // Calculate additional stats
  const totalGames = sessions.length
  const averageScore = totalGames > 0 ? Math.round(sessions.reduce((sum, session) => sum + session.score, 0) / totalGames) : 0
  const totalCoinsEarned = sessions.reduce((sum, session) => sum + (session.coins_earned || 0), 0)
  const totalPlayTime = sessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0)

  res.json({
    success: true,
    stats: {
      totalGames,
      averageScore,
      totalCoinsEarned,
      totalPlayTime,
      highScore: user.high_score || 0,
      totalScore: user.total_score || 0,
      currentCoins: user.coins || 0,
      currentSpxBalance: user.spx_balance || 0
    }
  })
}))

export default router






















    coinsEarned: coinsEarned || 0,
    durationSeconds: durationSeconds || 0,
    gameMode: gameMode || 'classic'
  })

  // Update user stats
  const currentUser = await databaseService.findUserById(userId)
  const newStats = {
    coins: (currentUser.coins || 0) + (coinsEarned || 0),
    spxBalance: currentUser.spx_balance || 0,
    highScore: Math.max(currentUser.high_score || 0, score),
    totalScore: (currentUser.total_score || 0) + score
  }

  const updatedUser = await databaseService.updateUserStats(userId, newStats)

  res.json({
    success: true,
    message: 'Oyun oturumu kaydedildi',
    session,
    updatedStats: {
      coins: updatedUser.coins,
      spxBalance: updatedUser.spx_balance,
      highScore: updatedUser.high_score,
      totalScore: updatedUser.total_score
    }
  })
}))

// Get user game sessions
router.get('/sessions', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id
  const limit = parseInt(req.query.limit) || 10

  const sessions = await databaseService.getUserGameSessions(userId, limit)

  res.json({
    success: true,
    sessions
  })
}))

// Get user game stats
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const user = await databaseService.findUserById(userId)
  const sessions = await databaseService.getUserGameSessions(userId, 50)

  // Calculate additional stats
  const totalGames = sessions.length
  const averageScore = totalGames > 0 ? Math.round(sessions.reduce((sum, session) => sum + session.score, 0) / totalGames) : 0
  const totalCoinsEarned = sessions.reduce((sum, session) => sum + (session.coins_earned || 0), 0)
  const totalPlayTime = sessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0)

  res.json({
    success: true,
    stats: {
      totalGames,
      averageScore,
      totalCoinsEarned,
      totalPlayTime,
      highScore: user.high_score || 0,
      totalScore: user.total_score || 0,
      currentCoins: user.coins || 0,
      currentSpxBalance: user.spx_balance || 0
    }
  })
}))

export default router





















