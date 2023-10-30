const User = require('../models/User')
const Profile = require('../models/Profile')
const OTP = require('../models/OTP')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()

/**
 * Sends OTP to a user's email and saves it in the database
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} - A response object with a success status and a message
 */
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body

    // Check if a user exists with the given email
    const isExistingUser = await User.findOne({ email })
    if (isExistingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already registered'
      })
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    })

    // TODO: Bad Approach: DB call inside a loop
    let result = await OTP.findOne({ otp })
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
      })
      result = await OTP.findOne({ otp })
    }

    const otpPayload = { email, otp }
    await OTP.create(otpPayload)

    return res.status(200).json({
      success: true,
      message: 'OTP Sent Successfully',
      otp
    })
  } catch (error) {
    console.log('sendOTP error: ', error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp
    } = req.body

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: 'All fields are required'
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          'Password and ConfirmPassword Value do not match, please try again'
      })
    }

    // Check if a user exists with the given email
    const isExistingUser = await User.findOne({ email })
    if (isExistingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already registered'
      })
    }

    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    console.log('Most recent OTP: ', recentOtp)

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'OTP Not Found'
      })
    }

    const correctOtp = recentOtp[0].otp
    if (otp !== correctOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      })
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a profile for the user
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null
    })

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })

    return res.status(200).json({
      success: true,
      message: 'User is registered Successfully',
      user
    })
  } catch (error) {
    console.log('signUp error: ', error)
    return res.status(500).json({
      success: false,
      message: 'User cannot be registered. Please try again'
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: 'All fields are required, please try again'
      })
    }

    const user = await User.findOne({ email }).populate('additionalDetails')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User is not registered, please signUp first'
      })
    }

    //generate JWT, after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h'
      })
      user.token = token
      user.password = undefined

      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true
      }
      return res.cookie('token', token, options).status(200).json({
        success: true,
        token,
        user,
        message: 'Logged in successfully'
      })
    } else {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      })
    }
  } catch (error) {
    console.log('Login error: ', error)
    return res.status(500).json({
      success: false,
      message: 'Login Failure, please try again'
    })
  }
}

exports.changePassword = async (req, res) => {
  //get data from req body
  const { oldPassword, newPassword, confirmNewPassword } = req.body
  //get oldPassword, newPassword, confirmNewPassword
  //validation
  //update pwd in DB
  //send mail - Password updated
  //return response
}
