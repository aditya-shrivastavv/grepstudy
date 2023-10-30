const Section = require('../models/Section')
const uploadToCloudinary = require('../utils/uploadToCloudinary')
const SubSection = require('../models/SubSection')

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body
    const video = req.files.videoFile

    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: 'All Fields are Required' })
    }
    console.log(video)

    const uploadDetails = await uploadToCloudinary(
      video,
      process.env.CLOUDINARY_FOLDER_NAME
    )

    const SubSectionDetails = await SubSection.create({
      title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url
    })

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate('subSection')

    return res.status(200).json({ success: true, data: updatedSection })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: 'SubSection not found'
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadToCloudinary(
        video,
        process.env.CLOUDINARY_FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    const updatedSection = await Section.findById(sectionId).populate(
      'subSection'
    )

    console.log('updated section', updatedSection)

    return res.json({
      success: true,
      message: 'Section updated successfully',
      data: updatedSection
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the section'
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId
        }
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: 'SubSection not found' })
    }

    const updatedSection = await Section.findById(sectionId).populate(
      'subSection'
    )

    return res.json({
      success: true,
      message: 'SubSection deleted successfully',
      data: updatedSection
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the SubSection'
    })
  }
}
