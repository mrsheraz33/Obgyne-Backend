const express = require('express')
const router  = express.Router()
const crypto  = require('crypto')
const User    = require('../models/User')
const { protect } = require('../middleware/auth')

const sendToken = (user, code, res) => {
  const token = user.getSignedToken()
  const u = {
    _id: user._id, name: user.name, email: user.email,
    role: user.role, phone: user.phone, city: user.city, bio: user.bio,
    createdAt: user.createdAt,
  }
  res.status(code).json({ success: true, token, user: u })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' })
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists)
      return res.status(400).json({ success: false, message: 'Email already registered' })
    const user = await User.create({ name, email, password })
    sendToken(user, 201, res)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' })
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    const match = await user.matchPassword(password)
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    sendToken(user, 200, res)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/auth/updateprofile
router.put('/updateprofile', protect, async (req, res) => {
  try {
    const { name, phone, city, bio } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, city, bio },
      { new: true, runValidators: true }
    )
    res.json({ success: true, user })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// PUT /api/auth/updatepassword
router.put('/updatepassword', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password')
    const { currentPassword, newPassword } = req.body
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password incorrect' })
    user.password = newPassword
    await user.save()
    sendToken(user, 200, res)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/auth/forgotpassword
router.post('/forgotpassword', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() })
    if (!user)
      return res.status(404).json({ success: false, message: 'No account found with this email' })
    const resetToken = user.getResetToken()
    await user.save({ validateBeforeSave: false })
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    console.log('🔑 Password Reset URL:', resetUrl)
    res.json({ success: true, message: 'Reset link generated', resetToken, resetUrl })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/auth/resetpassword/:token
router.put('/resetpassword/:token', async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken:  hashed,
      resetPasswordExpire: { $gt: Date.now() },
    })
    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' })
    user.password            = req.body.password
    user.resetPasswordToken  = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    sendToken(user, 200, res)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
