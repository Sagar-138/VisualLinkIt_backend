// config/db.js

const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatbotDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
