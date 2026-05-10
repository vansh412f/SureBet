const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected successfully');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, error.message);
      if (attempt === MAX_RETRIES) {
        console.error('All MongoDB connection attempts failed. Exiting.');
        process.exit(1);
      }
      const backoff = RETRY_DELAY_MS * attempt;
      console.log(`Retrying in ${backoff / 1000}s...`);
      await new Promise((res) => setTimeout(res, backoff));
    }
  }
};

module.exports = connectDB;