const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // No need for extra options
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
  }
};

module.exports = { connectToDb };
