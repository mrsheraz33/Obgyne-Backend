const jwt  = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer '))
    token = req.headers.authorization.split(' ')[1]
  if (!token)
    return res.status(401).json({ success: false, message: 'Not authorised — please login' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if (!req.user)
      return res.status(401).json({ success: false, message: 'User no longer exists' })
    
    // ✅ CHECK IF USER IS APPROVED (except for admin routes)
    // Admin can access even if not approved, but normal users need approval
    if (!req.user.isApproved && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending admin approval. You will be notified once approved.' 
      })
    }
    
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

exports.admin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Admin access only' })
  next()
}