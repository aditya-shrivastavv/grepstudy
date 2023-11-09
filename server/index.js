const express = require('express')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const cors = require('cors')
// - - - - -
const userRoutes = require('./routes/User')
const profileRoutes = require('./routes/Profile')
const paymentsRoutes = require('./routes/Payments')
const courseRoutes = require('./routes/Course')
const database = require('./config/database')
const { cloudinaryConnect } = require('./config/cloudinary')
// - - - - -

const app = express()
require('dotenv').config()

const PORT = process.env.PORT || 4000

database.connect()
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)

app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp' }))

cloudinaryConnect()

// Routes
app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/profile', profileRoutes)
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/payment', paymentsRoutes)

// Default route
app.get('/', (req, res) => {
  return res.json({ success: true, message: 'Your server is up and running.!' })
})

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`)
})
