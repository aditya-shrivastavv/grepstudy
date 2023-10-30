const mongoose = require('mongoose')
const mailSender = require('../utils/mailSender')
const emailVerificationTemplate = require('../mail/templates/emailVerificationTemplate')

/**
 * OTP schema for storing email and OTP details
 * @typedef {Object} OTPSchema
 * @property {string} email - The email address of the user
 * @property {string} otp - The OTP generated for the user
 * @property {Date} createdAt - The date and time when the OTP was created
 */
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

/**
 * Pre-save hook for OTP schema that sends verification email to the user
 */
OTPSchema.pre('save', async function (next) {
  await sendVerificationEmail(this.email, this.otp)
  next()
})

/**
 * Sends verification email to the user
 * @param {string} email - The email address of the user
 * @param {string} otp - The OTP generated for the user
 * @returns {Promise} - A promise that resolves when the email is sent successfully
 */
async function sendVerificationEmail(email, otp) {
  console.log('Sending verification email to: ', email)
  console.log('OTP: ', otp)
  try {
    const mailResponse = await mailSender(
      email,
      'Verification email from GrepStudy',
      emailVerificationTemplate(otp)
    )
    console.log('Email Sent successfully: ', mailResponse)
  } catch (error) {
    console.log('Error occurred while sending verification email: ', error)
    throw error
  }
}

module.exports = mongoose.model('OTP', OTPSchema)
