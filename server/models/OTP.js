const mongoose = require('mongoose')
import mailSender from '../utils/mailSender'

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60
  }
})

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      'Verification email from GrepStudy',
      otp
    )
    console.log('Email Sent successfully: ', mailResponse)
  } catch (error) {
    console.log('Error occured while sending verification email: ', error)
    throw error
  }
}

OTPSchema.pre('save', async function (next) {
  await sendVerificationEmail(this.email, this.otp)
  next()
})

module.exports = mongoose.model('OTP', OTPSchema)
