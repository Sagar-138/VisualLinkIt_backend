// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authContorller');

// Route to handle admin login
router.post('/login', authController.login);

module.exports = router;
