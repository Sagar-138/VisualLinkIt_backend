// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const connectDB = require('./config/db');
const questionRoutes = require('./routes/qaRoutes');
const authRoutes = require('./routes/authRoutes');
const { initDB }  = require('./models/index'); // Import the initialize function
require('dotenv').config();


// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Initialize the database and synchronize models
initDB().then(() => {
  // Use routes
  app.use('/api', questionRoutes);
  app.use('/api', authRoutes); // Use auth routes

  // Error handling middleware for 500 Internal Server Error
  app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message || 'Something went wrong!',
    });
  });

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1); // Exit process with failure
});