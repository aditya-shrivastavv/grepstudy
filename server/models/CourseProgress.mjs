import mongoose from 'mongoose'

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

export default mongoose.model('CourseProgress', courseProgressSchema)
