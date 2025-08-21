import express from 'express'
import { authenticateToken } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import databaseService from '../../services/databaseService.js'

const router = express.Router()

// Health check for blockchain routes
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Blockchain routes working',
    timestamp: new Date().toISOString()
  })
})

// Purchase NFT
router.post('/purchase-nft', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { nftId, nftName, nftType, rarity, priceSpx } = req.body

  if (!nftId || !nftName || !nftType || !rarity || !priceSpx) {
    return res.status(400).json({
      success: false,
      message: 'Tüm NFT bilgileri gereklidir'
    })
  }

  if (priceSpx <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz fiyat'
    })
  }

  try {
    const nft = await databaseService.purchaseNFT(userId, {
      nftId,
      nftName,
      nftType,
      rarity,
      priceSpx
    })

    res.json({
      success: true,
      message: 'NFT başarıyla satın alındı!',
      nft
    })
  } catch (error) {
    if (error.message === 'Insufficient SPX balance') {
      return res.status(400).json({
        success: false,
        message: 'Yetersiz SPX bakiyesi'
      })
    }
    throw error
  }
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

// Get NFT marketplace
router.get('/marketplace', asyncHandler(async (req, res) => {
  // This would typically fetch from a real blockchain or NFT marketplace
  // For now, we'll return a mock marketplace
  
  const marketplace = [
    {
      id: 'nft-1',
      name: 'Serpyx Legendary',
      type: 'character',
      rarity: 'legendary',
      priceSpx: 1000,
      image: '/Serpyx_NFT/legendary_quality/Aetherion.png',
      description: 'Efsanevi Serpyx karakteri',
      available: true
    },
    {
      id: 'nft-2',
      name: 'Serpyx Mythic',
      type: 'character',
      rarity: 'mythic',
      priceSpx: 5000,
      image: '/Serpyx_NFT/mythic_quality/Celestial Star.png',
      description: 'Mitik Serpyx karakteri',
      available: true
    },
    {
      id: 'nft-3',
      name: 'Serpyx Rare',
      type: 'character',
      rarity: 'rare',
      priceSpx: 500,
      image: '/Serpyx_NFT/rare_quality/Aquariel.png',
      description: 'Nadir Serpyx karakteri',
      available: true
    }
  ]

  res.json({
    success: true,
    marketplace
  })
}))

// Convert coins to SPX
router.post('/convert-coins', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { coins } = req.body

  if (!coins || coins <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz coin miktarı'
    })
  }

  // Get current user
  const user = await databaseService.findUserById(userId)
  
  if (user.coins < coins) {
    return res.status(400).json({
      success: false,
      message: 'Yetersiz coin bakiyesi'
    })
  }

  // Conversion rate: 100 coins = 1 SPX
  const conversionRate = 100
  const spxEarned = Math.floor(coins / conversionRate)
  const coinsUsed = spxEarned * conversionRate

  if (spxEarned === 0) {
    return res.status(400).json({
      success: false,
      message: `En az ${conversionRate} coin gereklidir (1 SPX için)`
    })
  }

  // Update user balance
  const newStats = {
    coins: user.coins - coinsUsed,
    spxBalance: (user.spx_balance || 0) + spxEarned,
    highScore: user.high_score || 0,
    totalScore: user.total_score || 0
  }

  const updatedUser = await databaseService.updateUserStats(userId, newStats)

  res.json({
    success: true,
    message: `${coinsUsed} coin ${spxEarned} SPX\'e dönüştürüldü`,
    conversion: {
      coinsUsed,
      spxEarned,
      conversionRate
    },
    newBalance: {
      coins: updatedUser.coins,
      spxBalance: updatedUser.spx_balance
    }
  })
}))

// Get blockchain stats
router.get('/stats', asyncHandler(async (req, res) => {
  // Get total NFTs owned
  const nftStats = await databaseService.query(`
    SELECT 
      COUNT(*) as total_nfts,
      COUNT(DISTINCT user_id) as unique_owners,
      SUM(price_spx) as total_volume
    FROM nft_ownership
  `)

  // Get SPX distribution
  const spxStats = await databaseService.query(`
    SELECT 
      COUNT(*) as total_users,
      SUM(spx_balance) as total_spx,
      AVG(spx_balance) as avg_spx
    FROM users
    WHERE is_verified = true
  `)

  const stats = {
    nfts: nftStats.rows[0],
    spx: spxStats.rows[0]
  }

  res.json({
    success: true,
    stats
  })
}))

export default router






















      success: false,
      message: 'Geçersiz fiyat'
    })
  }

  try {
    const nft = await databaseService.purchaseNFT(userId, {
      nftId,
      nftName,
      nftType,
      rarity,
      priceSpx
    })

    res.json({
      success: true,
      message: 'NFT başarıyla satın alındı!',
      nft
    })
  } catch (error) {
    if (error.message === 'Insufficient SPX balance') {
      return res.status(400).json({
        success: false,
        message: 'Yetersiz SPX bakiyesi'
      })
    }
    throw error
  }
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

// Get NFT marketplace
router.get('/marketplace', asyncHandler(async (req, res) => {
  // This would typically fetch from a real blockchain or NFT marketplace
  // For now, we'll return a mock marketplace
  
  const marketplace = [
    {
      id: 'nft-1',
      name: 'Serpyx Legendary',
      type: 'character',
      rarity: 'legendary',
      priceSpx: 1000,
      image: '/Serpyx_NFT/legendary_quality/Aetherion.png',
      description: 'Efsanevi Serpyx karakteri',
      available: true
    },
    {
      id: 'nft-2',
      name: 'Serpyx Mythic',
      type: 'character',
      rarity: 'mythic',
      priceSpx: 5000,
      image: '/Serpyx_NFT/mythic_quality/Celestial Star.png',
      description: 'Mitik Serpyx karakteri',
      available: true
    },
    {
      id: 'nft-3',
      name: 'Serpyx Rare',
      type: 'character',
      rarity: 'rare',
      priceSpx: 500,
      image: '/Serpyx_NFT/rare_quality/Aquariel.png',
      description: 'Nadir Serpyx karakteri',
      available: true
    }
  ]

  res.json({
    success: true,
    marketplace
  })
}))

// Convert coins to SPX
router.post('/convert-coins', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { coins } = req.body

  if (!coins || coins <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz coin miktarı'
    })
  }

  // Get current user
  const user = await databaseService.findUserById(userId)
  
  if (user.coins < coins) {
    return res.status(400).json({
      success: false,
      message: 'Yetersiz coin bakiyesi'
    })
  }

  // Conversion rate: 100 coins = 1 SPX
  const conversionRate = 100
  const spxEarned = Math.floor(coins / conversionRate)
  const coinsUsed = spxEarned * conversionRate

  if (spxEarned === 0) {
    return res.status(400).json({
      success: false,
      message: `En az ${conversionRate} coin gereklidir (1 SPX için)`
    })
  }

  // Update user balance
  const newStats = {
    coins: user.coins - coinsUsed,
    spxBalance: (user.spx_balance || 0) + spxEarned,
    highScore: user.high_score || 0,
    totalScore: user.total_score || 0
  }

  const updatedUser = await databaseService.updateUserStats(userId, newStats)

  res.json({
    success: true,
    message: `${coinsUsed} coin ${spxEarned} SPX\'e dönüştürüldü`,
    conversion: {
      coinsUsed,
      spxEarned,
      conversionRate
    },
    newBalance: {
      coins: updatedUser.coins,
      spxBalance: updatedUser.spx_balance
    }
  })
}))

// Get blockchain stats
router.get('/stats', asyncHandler(async (req, res) => {
  // Get total NFTs owned
  const nftStats = await databaseService.query(`
    SELECT 
      COUNT(*) as total_nfts,
      COUNT(DISTINCT user_id) as unique_owners,
      SUM(price_spx) as total_volume
    FROM nft_ownership
  `)

  // Get SPX distribution
  const spxStats = await databaseService.query(`
    SELECT 
      COUNT(*) as total_users,
      SUM(spx_balance) as total_spx,
      AVG(spx_balance) as avg_spx
    FROM users
    WHERE is_verified = true
  `)

  const stats = {
    nfts: nftStats.rows[0],
    spx: spxStats.rows[0]
  }

  res.json({
    success: true,
    stats
  })
}))

export default router





















