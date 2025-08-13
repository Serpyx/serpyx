import express from 'express'
const router = express.Router()

router.get('/status', (req, res) => {
  res.json({ message: 'Achievement routes coming soon' })
})

export default router








