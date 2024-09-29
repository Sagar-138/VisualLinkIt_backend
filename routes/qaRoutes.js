// routes/questionRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const questionController = require('../controllers/qaController');
const isAdmin = require('../middleware/authMiddleware');




// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to upload questions from a JSON file (admin only)
router.post('/questions/upload', isAdmin, upload.single('file'), questionController.uploadQuestionsFromFile);




// Route to add a new question (admin only)
router.post('/questions', isAdmin, questionController.addQuestion);

// Route to get all questions (admin only)
router.get('/questions', isAdmin, questionController.getQuestions);

// // Route to add a new question
// router.post('/questions', questionController.addQuestion);

// // Route to get all questions
// router.get('/questions', questionController.getQuestions);

// Route to search for a specific question
router.get('/questions/search', questionController.searchQuestion);

// Route to search for a specific question using MongoDB text search
// router.get('/questions/searchQuestionTokenize', questionController.searchQuestionTokenize);



module.exports = router;
