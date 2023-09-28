import mongoose from 'mongoose'

const tagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
})

export default mongoose.model('Tags', tagsSchema)
 