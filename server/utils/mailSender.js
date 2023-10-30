const nodemailer = require('nodemailer')

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_MAIL_HOST,
      auth: {
        user: process.env.NODEMAILER_MAIL_USER,
        pass: process.env.NODEMAILER_MAIL_PASS
      }
    })

    const info = await transporter.sendMail({
      from: 'GrepStudy',
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`
    })

    console.log(info)
    return info
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = mailSender
