import express from 'express'
import { authenticateToken } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import databaseService from '../../services/databaseService.js'

const router = express.Router()

// Health check for user routes
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'User routes working',
    timestamp: new Date().toISOString()
  })
})

// Get user profile
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const user = await databaseService.findUserById(userId)
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Kullanıcı bulunamadı'
    })
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.is_verified,
      coins: user.coins,
      spxBalance: user.spx_balance,
      highScore: user.high_score,
      totalScore: user.total_score,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      profileImage: user.profile_image,
      bio: user.bio,
      preferences: user.preferences
    }
  })
}))

// Update user profile
router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { username, bio, profileImage, preferences } = req.body

  // Check if username is already taken by another user
  if (username) {
    const existingUser = await databaseService.findUserByUsername(username)
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcı adı zaten kullanılıyor'
      })
    }
  }

  // Update user profile
  const updateFields = []
  const updateValues = []
  let paramCount = 1

  if (username) {
    updateFields.push(`username = $${paramCount++}`)
    updateValues.push(username)
  }

  if (bio !== undefined) {
    updateFields.push(`bio = $${paramCount++}`)
    updateValues.push(bio)
  }

  if (profileImage !== undefined) {
    updateFields.push(`profile_image = $${paramCount++}`)
    updateValues.push(profileImage)
  }

  if (preferences !== undefined) {
    updateFields.push(`preferences = $${paramCount++}`)
    updateValues.push(JSON.stringify(preferences))
  }

  if (updateFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Güncellenecek alan bulunamadı'
    })
  }

  updateValues.push(userId)
  const query = `
    UPDATE users 
    SET ${updateFields.join(', ')}, last_login = CURRENT_TIMESTAMP
    WHERE id = $${paramCount}
    RETURNING id, username, email, bio, profile_image, preferences, last_login
  `

  const result = await databaseService.query(query, updateValues)
  const updatedUser = result.rows[0]

  res.json({
    success: true,
    message: 'Profil güncellendi',
    user: {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profileImage: updatedUser.profile_image,
      preferences: updatedUser.preferences,
      lastLogin: updatedUser.last_login
    }
  })
}))

// Get user achievements
router.get('/achievements', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const achievements = await databaseService.getUserAchievements(userId)

  res.json({
    success: true,
    achievements
  })
}))

// Get user daily tasks
router.get('/daily-tasks', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const tasks = await databaseService.getUserDailyTasks(userId)

  res.json({
    success: true,
    tasks
  })
}))

// Get user daily bonuses
router.get('/daily-bonuses', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const bonuses = await databaseService.getUserDailyBonuses(userId)

  res.json({
    success: true,
    bonuses
  })
}))

// Get user NFTs
router.get('/nfts', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const nfts = await databaseService.getUserNFTs(userId)

  res.json({
    success: true,
    nfts
  })
}))

export default router






















    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.is_verified,
      coins: user.coins,
      spxBalance: user.spx_balance,
      highScore: user.high_score,
      totalScore: user.total_score,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      profileImage: user.profile_image,
      bio: user.bio,
      preferences: user.preferences
    }
  })
}))

// Update user profile
router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { username, bio, profileImage, preferences } = req.body

  // Check if username is already taken by another user
  if (username) {
    const existingUser = await databaseService.findUserByUsername(username)
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcı adı zaten kullanılıyor'
      })
    }
  }

  // Update user profile
  const updateFields = []
  const updateValues = []
  let paramCount = 1

  if (username) {
    updateFields.push(`username = $${paramCount++}`)
    updateValues.push(username)
  }

  if (bio !== undefined) {
    updateFields.push(`bio = $${paramCount++}`)
    updateValues.push(bio)
  }

  if (profileImage !== undefined) {
    updateFields.push(`profile_image = $${paramCount++}`)
    updateValues.push(profileImage)
  }

  if (preferences !== undefined) {
    updateFields.push(`preferences = $${paramCount++}`)
    updateValues.push(JSON.stringify(preferences))
  }

  if (updateFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Güncellenecek alan bulunamadı'
    })
  }

  updateValues.push(userId)
  const query = `
    UPDATE users 
    SET ${updateFields.join(', ')}, last_login = CURRENT_TIMESTAMP
    WHERE id = $${paramCount}
    RETURNING id, username, email, bio, profile_image, preferences, last_login
  `

  const result = await databaseService.query(query, updateValues)
  const updatedUser = result.rows[0]

  res.json({
    success: true,
    message: 'Profil güncellendi',
    user: {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profileImage: updatedUser.profile_image,
      preferences: updatedUser.preferences,
      lastLogin: updatedUser.last_login
    }
  })
}))

// Get user achievements
router.get('/achievements', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const achievements = await databaseService.getUserAchievements(userId)

  res.json({
    success: true,
    achievements
  })
}))

// Get user daily tasks
router.get('/daily-tasks', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const tasks = await databaseService.getUserDailyTasks(userId)

  res.json({
    success: true,
    tasks
  })
}))

// Get user daily bonuses
router.get('/daily-bonuses', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const bonuses = await databaseService.getUserDailyBonuses(userId)

  res.json({
    success: true,
    bonuses
  })
}))

// Get user NFTs
router.get('/nfts', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id

  const nfts = await databaseService.getUserNFTs(userId)

  res.json({
    success: true,
    nfts
  })
}))

export default router





















