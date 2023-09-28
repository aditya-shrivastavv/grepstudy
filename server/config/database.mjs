import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

function connect() {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB Connected Successfully.'))
    .catch((error) => {
      console.log('DB Connection Failure!! ')
      console.log(error)
      process.exit(1)
    })
}

export default connect
