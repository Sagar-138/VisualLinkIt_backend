// controller/questionController.js

const fs = require('fs');
const Question = require('../models/Question');

// Controller function to add a new question and answer
exports.addQuestion = async (req, res) => {
    try {
      let { question, answer } = req.body;
  
      // Convert the question to lowercase and remove special characters
      const sanitizedQuestion = question.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');
  
      // Check if a question with the sanitized content already exists
      const existingQuestion = await Question.findOne({
        question: new RegExp(`^${sanitizedQuestion}$`, 'i')
      });
  
      if (existingQuestion) {
        return res.status(400).json({ error: 'Question already exists' }); // Respond with an error if the question is not unique
      }
  
      // Save the sanitized question in lowercase
      const newQuestion = new Question({
        question: sanitizedQuestion,
        answer
      });
  
      await newQuestion.save(); // Save the new question to the database
      res.status(201).json(newQuestion); // Respond with the created question
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' }); // Handle server errors
    }
  };
  

// Controller function to get all questions and answers
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find(); // Retrieve all questions from the database
    res.status(200).json(questions); // Respond with the list of questions
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' }); // Handle server errors
  }
};

// Controller function to search for a specific question
exports.searchQuestion = async (req, res) => {
    try {
      let { query } = req.query;
  
      // Convert the query to lowercase
      query = query.toLowerCase();
  
      // Remove special characters from the query
      query = query.replace(/[^a-zA-Z0-9\s]/g, '');
  
      // Use a regular expression to search for the sanitized query in a case-insensitive manner
      const question = await Question.findOne({
        question: new RegExp(`^${query}$`, 'i') // Match the entire string
      });
  
      if (question) {
        res.status(200).json(question); // Respond with the found question and its answer
      } else {
        res.status(404).json({ error: 'Question not found' }); // Handle case where the question isn't found
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' }); // Handle server errors
    }
  };
  

// Controller function to upload questions from a JSON file
exports.uploadQuestionsFromFile = async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
      }

      // Read the uploaded file
      const filePath = req.file.path;
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Parse JSON data from the file
      const questionsData = JSON.parse(fileContent);

      if (!Array.isArray(questionsData)) {
          return res.status(400).json({ error: 'Invalid file format' });
      }

      // Iterate over the questions and insert them into the database
      for (let item of questionsData) {
          const { question, answer } = item;

          // Sanitize the question
          const sanitizedQuestion = question.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');

          // Check if the question already exists
          const existingQuestion = await Question.findOne({ question: new RegExp(`^${sanitizedQuestion}$`, 'i') });
          if (!existingQuestion) {
              // Save the question and answer to the database
              const newQuestion = new Question({ question: sanitizedQuestion, answer });
              await newQuestion.save();
          }
      }

      // Clean up the uploaded file after processing
      fs.unlinkSync(filePath);

      res.status(201).json({ message: 'Questions uploaded successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};