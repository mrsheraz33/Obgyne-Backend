const express    = require('express')
const router     = express.Router()
const Enrollment = require('../models/Enrollment')
const Course     = require('../models/Course')
const User       = require('../models/User')
const { protect, admin } = require('../middleware/auth')

// POST — enroll in course
router.post('/:courseId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course)
      return res.status(404).json({ success: false, message: 'Course not found' })
    const exists = await Enrollment.findOne({ user: req.user._id, course: course._id })
    if (exists)
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' })
    const enrollment = await Enrollment.create({ user: req.user._id, course: course._id })
    await Course.findByIdAndUpdate(course._id, { $inc: { enrollmentCount: 1 } })
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: course._id } })
    res.status(201).json({ success: true, enrollment })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET — my enrollments
router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course', 'title slug shortDesc iconClass colorTheme badge instructor level language enrollmentCount rating modules lessons hasModules')
    res.json({ success: true, enrollments })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT — update lesson progress
router.put('/:enrollmentId/progress', protect, async (req, res) => {
  try {
    const { lessonId, completed } = req.body
    const enrollment = await Enrollment.findOne({ _id: req.params.enrollmentId, user: req.user._id })
    if (!enrollment)
      return res.status(404).json({ success: false, message: 'Enrollment not found' })
    const existing = enrollment.progress.find(p => p.lessonId?.toString() === lessonId)
    if (existing) {
      existing.completed = completed
      if (completed) existing.completedAt = new Date()
    } else {
      enrollment.progress.push({ lessonId, completed, completedAt: completed ? new Date() : undefined })
    }
    const course = await Course.findById(enrollment.course)
    let total = 0
    if (course?.hasModules) course.modules.forEach(m => total += m.lessons.length)
    else total = course?.lessons?.length || 1
    const done = enrollment.progress.filter(p => p.completed).length
    enrollment.progressPercent = Math.round((done / total) * 100)
    if (enrollment.progressPercent === 100) {
      enrollment.isCompleted = true
      enrollment.completedAt = new Date()
    }
    await enrollment.save()
    res.json({ success: true, enrollment })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET — all enrollments (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email city')
      .populate('course', 'title slug')
      .sort('-enrolledAt')
    res.json({ success: true, count: enrollments.length, enrollments })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
