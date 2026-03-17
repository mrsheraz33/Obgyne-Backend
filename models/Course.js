const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  duration: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  isFree:   { type: Boolean, default: false },
  order:    { type: Number, default: 0 },
})

const moduleSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  order:   { type: Number, default: 0 },
  lessons: [lessonSchema],
})

const courseSchema = new mongoose.Schema({
  title:           { type: String, required: true, trim: true },
  slug:            { type: String, unique: true, lowercase: true },
  description:     { type: String, required: true },
  shortDesc:       { type: String, default: '' },
  instructor:      { type: String, default: 'Dr. Mariam' },
  tags:            [String],
  level:           { type: String, default: 'All Levels' },
  language:        { type: String, default: 'Urdu / English' },
  price:           { type: Number, default: 0 },
  isFree:          { type: Boolean, default: false },
  isPaid:          { type: Boolean, default: true },
  isPublished:     { type: Boolean, default: true },
  enrollmentCount: { type: Number, default: 0 },
  rating:          { type: Number, default: 5.0 },
  totalReviews:    { type: Number, default: 0 },
  modules:         [moduleSchema],
  lessons:         [lessonSchema],
  whatYouLearn:    [String],
  requirements:    [String],
  colorTheme:      { type: String, default: 'teal' },
  iconClass:       { type: String, default: 'fa-book-medical' },
  badge:           { type: String, default: 'Enroll Now' },
  hasModules:      { type: Boolean, default: false },
}, { timestamps: true })

courseSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

module.exports = mongoose.model('Course', courseSchema)
