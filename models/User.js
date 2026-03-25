const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const crypto   = require('crypto')

const userSchema = new mongoose.Schema({
  name:     { type: String, required: [true,'Name required'], trim: true },
  email:    { type: String, required: [true,'Email required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true,'Password required'], minlength: 6, select: false },
  role:     { type: String, enum: ['student','admin'], default: 'student' },
  isApproved: { type: Boolean, default: false }, // ← NEW FIELD: Admin approval required
  phone:    { type: String, default: '' },
  city:     { type: String, default: '' },
  bio:      { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  resetPasswordToken:  String,
  resetPasswordExpire: Date,
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password)
}

userSchema.methods.getSignedToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role, isApproved: this.isApproved },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  )
}

userSchema.methods.getResetToken = function() {
  const token = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken  = crypto.createHash('sha256').update(token).digest('hex')
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
  return token
}

module.exports = mongoose.model('User', userSchema)