import mongoose from 'mongoose';
import ApiError from '../error/ApiError.js';

mongoose.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    },
)

mongoose.connection.on('open', () => {
  console.log("Connected to MongoDB...")
})

mongoose.connection.on('error', () => {
  console.error(ApiError.internal('Connection Refused... MONGODB'))
})