const mongoose = require('mongoose')

const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  completedVideos: [
    // Videos = Subsections
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subSection',
    },
  ],
})

module.exports = mongoose.model('CourseProgress', courseProgressSchema)
