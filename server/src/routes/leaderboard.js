import express from 'express'
import { asyncHandler } from '../../middleware/errorHandler.js'
import databaseService from '../../services/databaseService.js'

const router = express.Router()

// Health check for leaderboard routes
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Leaderboard routes working',
    timestamp: new Date().toISOString()
  })
})

// Get global leaderboard
router.get('/', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0

  const leaderboard = await databaseService.getLeaderboard(limit)

  res.json({
    success: true,
    leaderboard: leaderboard.slice(offset, offset + limit),
    total: leaderboard.length,
    limit,
    offset
  })
}))

// Get leaderboard by category
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params
  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0

  let query = ''
  let params = []

  switch (category) {
    case 'high-score':
      query = `
        SELECT username, coins, spx_balance, high_score, total_score, last_login
        FROM users 
        WHERE is_verified = true 
        ORDER BY high_score DESC, coins DESC 
        LIMIT $1 OFFSET $2
      `
      params = [limit, offset]
      break

    case 'coins':
      query = `
        SELECT username, coins, spx_balance, high_score, total_score, last_login
        FROM users 
        WHERE is_verified = true 
        ORDER BY coins DESC, high_score DESC 
        LIMIT $1 OFFSET $2
      `
      params = [limit, offset]
      break

    case 'total-score':
      query = `
        SELECT username, coins, spx_balance, high_score, total_score, last_login
        FROM users 
        WHERE is_verified = true 
        ORDER BY total_score DESC, high_score DESC 
        LIMIT $1 OFFSET $2
      `
      params = [limit, offset]
      break

    case 'spx-balance':
      query = `
        SELECT username, coins, spx_balance, high_score, total_score, last_login
        FROM users 
        WHERE is_verified = true 
        ORDER BY spx_balance DESC, coins DESC 
        LIMIT $1 OFFSET $2
      `
      params = [limit, offset]
      break

    default:
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kategori. Kullanılabilir kategoriler: high-score, coins, total-score, spx-balance'
      })
  }

  const result = await databaseService.query(query, params)
  const leaderboard = result.rows

  res.json({
    success: true,
    category,
    leaderboard,
    total: leaderboard.length,
    limit,
    offset
  })
}))

// Get user's position in leaderboard
router.get('/position/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params

  // Get user's high score
  const user = await databaseService.findUserById(userId)
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Kullanıcı bulunamadı'
    })
  }

  // Get position by high score
  const positionResult = await databaseService.query(`
    SELECT COUNT(*) + 1 as position
    FROM users 
    WHERE is_verified = true AND high_score > $1
  `, [user.high_score || 0])

  const position = parseInt(positionResult.rows[0].position)

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      highScore: user.high_score || 0,
      coins: user.coins || 0,
      totalScore: user.total_score || 0,
      spxBalance: user.spx_balance || 0
    },
    position
  })
}))

// Get recent activity
router.get('/recent-activity', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20

  const result = await databaseService.query(`
    SELECT 
      u.username,
      gs.score,
      gs.coins_earned,
      gs.game_mode,
      gs.created_at
    FROM game_sessions gs
    JOIN users u ON gs.user_id = u.id
    WHERE u.is_verified = true
    ORDER BY gs.created_at DESC
    LIMIT $1
  `, [limit])

  const recentActivity = result.rows

  res.json({
    success: true,
    recentActivity,
    total: recentActivity.length
  })
}))

export default router























// Get leaderboard by category
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params
  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0

  let query = ''
  let params = []

  switch (category) {
    case 'high-score':
      query = `
        SELECT username, coins, spx_balance, high_score, total_score, last_login
        FROM users 
        WHERE is_verified = true 
        ORDER BY high_score DESC, coins DESC 
        LIMIT $1 OFFSET $2
      `
      params = [limit, offset]
      break

    case 'coins':
      query = `
        SELECT username, coins, spx_balance, high_score, total_score, last_login
        FROM users 
        WHERE is_verified = true 
        ORDER BY coins DESC, high_score DESC 
        LIMIT $1 OFFSET $2
      `
      params = [limit, offset]
      break

    case 'total-score':
      query = `
        SELECT username, coins, spx_balance, high_score, total_score, last_login
        FROM users 
        WHERE is_verified = true 
        ORDER BY total_score DESC, high_score DESC 
        LIMIT $1 OFFSET $2
      `
      params = [limit, offset]
      break

    case 'spx-balance':
      query = `
        SELECT username, coins, spx_balance, high_score, total_score, last_login
        FROM users 
        WHERE is_verified = true 
        ORDER BY spx_balance DESC, coins DESC 
        LIMIT $1 OFFSET $2
      `
      params = [limit, offset]
      break

    default:
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kategori. Kullanılabilir kategoriler: high-score, coins, total-score, spx-balance'
      })
  }

  const result = await databaseService.query(query, params)
  const leaderboard = result.rows

  res.json({
    success: true,
    category,
    leaderboard,
    total: leaderboard.length,
    limit,
    offset
  })
}))

// Get user's position in leaderboard
router.get('/position/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params

  // Get user's high score
  const user = await databaseService.findUserById(userId)
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Kullanıcı bulunamadı'
    })
  }

  // Get position by high score
  const positionResult = await databaseService.query(`
    SELECT COUNT(*) + 1 as position
    FROM users 
    WHERE is_verified = true AND high_score > $1
  `, [user.high_score || 0])

  const position = parseInt(positionResult.rows[0].position)

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      highScore: user.high_score || 0,
      coins: user.coins || 0,
      totalScore: user.total_score || 0,
      spxBalance: user.spx_balance || 0
    },
    position
  })
}))

// Get recent activity
router.get('/recent-activity', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20

  const result = await databaseService.query(`
    SELECT 
      u.username,
      gs.score,
      gs.coins_earned,
      gs.game_mode,
      gs.created_at
    FROM game_sessions gs
    JOIN users u ON gs.user_id = u.id
    WHERE u.is_verified = true
    ORDER BY gs.created_at DESC
    LIMIT $1
  `, [limit])

  const recentActivity = result.rows

  res.json({
    success: true,
    recentActivity,
    total: recentActivity.length
  })
}))

export default router





















