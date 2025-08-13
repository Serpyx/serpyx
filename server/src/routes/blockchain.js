import express from 'express'
const router = express.Router()

router.get('/status', (req, res) => {
  res.json({ message: 'Blockchain routes coming soon' })
})

export default router








