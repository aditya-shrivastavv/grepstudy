const mongoose = require('mongoose')
const { instance } = require('../config/razorpay')
const User = require('../models/User')
const Course = require('../models/Course')
const mailSender = require('../utils/mailSender')
const courseEnrollmentEmail = require('../mail/templates/courseEnrollmentEmail')

exports.capturePayment = async (req, res) => {
  const { course_id } = req.body
  const userId = req.user.id

  if (!course_id) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide valid course Id' })
  }

  let course
  try {
    course = await Course.findById(course_id)
    if (!course) {
      return res
        .status(400)
        .json({ success: false, message: 'Could not find the course' })
    }

    const uid = new mongoose.Types.ObjectId(userId)
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: 'You have already enrolled for this course'
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }

  const amount = course.price
  const currency = 'INR'

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString()
  }

  try {
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)

    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, message: 'Could not initiate order' })
  }
}

exports.verifySignature = async (req, res) => {
  const webHookSecret = '12345678'

  const signature = req.headers['x-razorpay-signature']

  const shasum = crypto.createHmac('sha256', webHookSecret)
  shasum.update(JSON.stringify(req.body))
  const digest = shasum.digest('hex')

  if (digest === signature) {
    console.log('Payment is authorized')
  }
}
