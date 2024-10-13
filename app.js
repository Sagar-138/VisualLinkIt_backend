// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const questionRoutes = require('./routes/qaRoutes');
const authRoutes = require('./routes/authRoutes');
const { initDB }  = require('./models/index'); // Import the initialize function
require('dotenv').config();


const hostname = '127.0.0.1';
const port = process.env.PORT || 5000;

// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors({ origin: process.env.REMOTE_CLIENT_APP, credentials: true }));


// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the VisualLinkit Bot Server!');
});


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
  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1); // Exit process with failure
});