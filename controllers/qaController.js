// controller/questionController.js
const fs = require('fs');
const {Question, sequelize} = require('../models'); // Import your question model


console.log('Question Model:', Question); // Should log the Question model
console.log('Sequelize Instance:', sequelize); // Should log the Sequelize instance

// Controller function to add a new question and answer
exports.addQuestion = async (req, res) => {
  try {
    let { question, answer } = req.body;

    // Validate input
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    // Sanitize the question
    const sanitizedQuestion = question.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');

    // Check if the question already exists
    const existingQuestion = await Question.findOne({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('question')),
        sanitizedQuestion
      ),
    });

    if (existingQuestion) {
      return res.status(400).json({ error: 'Question already exists' });
    }

    // Create and save the new question
    const newQuestion = await Question.create({
      question: sanitizedQuestion,
      answer,
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to get all questions and answers
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to search for a specific question
exports.searchQuestion = async (req, res) => {
  try {
    let { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Sanitize the query
    query = query.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');

    // Search for the question
    const question = await Question.findOne({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('question')),
        query
      ),
    });

    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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

      if (!question || !answer) continue; // Skip invalid entries

      // Sanitize the question
      const sanitizedQuestion = question.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');

      // Check if the question already exists (case-insensitive)
      const existingQuestion = await Question.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('question')),
          sanitizedQuestion
        ),
      });

      if (!existingQuestion) {
        // Save the question and answer to the database
        await Question.create({
          question: sanitizedQuestion,
          answer,
        });
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

// // MongoDB Text Search function
// exports.mongoTextSearchQuestion = async (req, res) => {
//   try {
//       let { query } = req.query;
//       if (!query) {
//           return res.status(400).json({ error: 'Query parameter is required' });
//       }

//       // Use MongoDB's text search to find relevant questions
//       const results = await Question.find({
//           $text: { $search: query }
//       });

//       if (results.length > 0) {
//           return res.status(200).json(results);
//       } else {
//           return res.status(404).json({ error: 'No relevant question found' });
//       }
//   } catch (error) {
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// };



// Helper function to sanitize and tokenize a string
const sanitizeAndTokenize = (str) => {
  return str.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/);
};

// Controller function to search for a question using keyword matching
exports.searchQuestionTokenize = async (req, res) => {
  try {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'No query provided' });
    }

    // Sanitize and tokenize the user's query
    const queryTokens = sanitizeAndTokenize(query);

    // Retrieve all questions from the database
    const allQuestions = await Question.find();

    let bestMatch = null;
    let highestMatchCount = 0;

    // Loop through each question in the database to find the best match
    allQuestions.forEach(dbQuestion => {
      const dbQuestionTokens = sanitizeAndTokenize(dbQuestion.question);

      // Count how many tokens match between the user's query and the database question
      const matchCount = queryTokens.filter(token => dbQuestionTokens.includes(token)).length;

      // If the current question has more matches than the previous best match, update bestMatch
      if (matchCount > highestMatchCount) {
        bestMatch = dbQuestion;
        highestMatchCount = matchCount;
      }
    });

    // Return the best matching question if one is found
    if (bestMatch) {
      res.status(200).json(bestMatch);
    } else {
      res.status(404).json({ error: 'No relevant question found' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
