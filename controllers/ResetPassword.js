const bcrypt = require('bcrypt')
const User = require('../models/User')
const mailSender = require('../utils/mailSender')

// reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body

    const user = User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // generate token
    const token = crypto.randomUUID()

    const updatedDetails = await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000
      }
    )

    const url = `http://localhost:3000/update-password/${token}`

    await mailSender(
      email,
      'Password Reset Link',
      `Password Reset Link: ${url}`
    )

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to email'
    })
  } catch (error) {
    console.log('Reset password error: ', error)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while resetting password sending mail'
    })
  }
}

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password does not match'
      })
    }

    const userDetails = await User.findOne({ token })

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      })
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Token expired, please regenerate token'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.findOneAndUpdate(
      { token },
      { password: hashedPassword },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.log('Reset password error: ', error)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while resetting password'
    })
  }
}
