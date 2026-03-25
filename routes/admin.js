const express    = require('express')
const router     = express.Router()
const User       = require('../models/User')
const Course     = require('../models/Course')
const Enrollment = require('../models/Enrollment')
const { protect, admin } = require('../middleware/auth')

router.use(protect, admin)

// GET stats
router.get('/stats', async (req, res) => {
  try {
    const [totalStudents, totalCourses, totalEnrollments, completedEnrollments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments({ isPublished: true }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ isCompleted: true }),
    ])
    const completionRate = totalEnrollments
      ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0
    res.json({ success: true, stats: { totalStudents, totalCourses, totalEnrollments, completionRate } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt')
    res.json({ success: true, count: users.length, users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ✅ NEW: Approve user (admin only)
router.put('/users/:id/approve', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    user.isApproved = true
    await user.save()
    
    res.json({ 
      success: true, 
      message: `${user.name} has been approved! They can now access videos.`,
      user 
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT update user
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, user })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT — admin reset any account password
router.put('/resetpassword', async (req, res) => {
  try {
    const { email, newPassword } = req.body
    if (!email || !newPassword)
      return res.status(400).json({ success: false, message: 'Email and new password required' })
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user)
      return res.status(404).json({ success: false, message: 'No user found with this email' })
    user.password = newPassword
    await user.save()
    res.json({ success: true, message: `Password updated for ${user.email}` })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router