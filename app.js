// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const questionRoutes = require('./routes/qaRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

// Initialize Express app
const app = express();
// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api', questionRoutes);
app.use('/api', authRoutes); // Add this line to use auth routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
