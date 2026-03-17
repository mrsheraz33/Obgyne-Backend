const express = require('express')
const router  = express.Router()
const Course  = require('../models/Course')
const { protect, admin } = require('../middleware/auth')

// GET all published courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
    res.json({ success: true, count: courses.length, courses })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET all courses (admin — includes unpublished)
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const courses = await Course.find().sort('-createdAt')
    res.json({ success: true, count: courses.length, courses })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET single course by slug
router.get('/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
    if (!course)
      return res.status(404).json({ success: false, message: 'Course not found' })
    res.json({ success: true, course })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// CREATE course (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const course = await Course.create(req.body)
    res.status(201).json({ success: true, course })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// UPDATE course (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    )
    if (!course)
      return res.status(404).json({ success: false, message: 'Course not found' })
    res.json({ success: true, course })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// DELETE course (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id)
    if (!course)
      return res.status(404).json({ success: false, message: 'Course not found' })
    res.json({ success: true, message: 'Course deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
