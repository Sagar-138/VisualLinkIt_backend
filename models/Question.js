// models/Question.js

const mongoose = require('mongoose');

// Define the schema for questions
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

// Create and export the Question model
module.exports = mongoose.model('Question', questionSchema);
