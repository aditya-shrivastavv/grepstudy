const Course = require('../models/Course')
const Tag = require('./Tag')
const User = require('../models/User')
const uploadToCloudinary = require('../utils/uploadToCloudinary')
const CourseProgress = require('../models/CourseProgress')

exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body

    const thumbnail = req.files.thumbnailImage

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    const userId = req.user.id
    const instructorDetails = await User.findById(userId)
    console.log('instructor details: ', instructorDetails)

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: 'Instructor not found'
      })
    }

    const tagDetails = Tag.findById(tag)
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: 'Tag not found'
      })
    }

    const thumbnailImage = await uploadToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
      instructor: instructorDetails._id
    })

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: { courses: newCourse._id }
      },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true
      }
    )
      .populate('instructor')
      .exec()

    return res.status(200).json({
      success: true,
      message: 'All courses',
      data: allCourses
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body

    const courseDetails = await Course.findOne({
      _id: courseId
    })
      .populate({
        path: 'instructor',
        populate: {
          path: 'additionalDetails'
        }
      })
      .populate('category')
      .populate('ratingAndReviews')
      .populate({
        path: 'courseContent',
        populate: {
          path: 'subSection'
        }
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with id: ${courseId}`
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Course details fetched successfully',
      data: courseDetails
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
