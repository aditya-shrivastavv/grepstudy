const Section = require('../models/Section')
const Course = require('../models/Course')

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body

    if (!sectionName || !courseId) {
      return res
        .status(400)
        .json({ success: false, error: 'Missing required fields' })
    }

    const newSection = await Section.create({ sectionName })

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { sections: newSection._id } },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: 'Section created successfully',
      updatedCourseDetails
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to create course section, please try again',
      error: error.message
    })
  }
}

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body

    if (!sectionName || !sectionId) {
      return res
        .status(400)
        .json({ success: false, error: 'Missing required fields' })
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: 'Section updated successfully',
      section
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to update course section, please try again',
      error: error.message
    })
  }
}

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params

    await Section.findByIdAndDelete(sectionId)

    return res.status(200).json({
      success: true,
      message: 'Section deleted successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to delete course section, please try again',
      error: error.message
    })
  }
}
