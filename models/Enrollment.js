const mongoose = require('mongoose')

const enrollmentSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt:      { type: Date, default: Date.now },
  progress:        [{ lessonId: mongoose.Schema.Types.ObjectId, completed: Boolean, completedAt: Date }],
  progressPercent: { type: Number, default: 0 },
  isCompleted:     { type: Boolean, default: false },
  completedAt:     Date,
}, { timestamps: true })

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true })
module.exports = mongoose.model('Enrollment', enrollmentSchema)
