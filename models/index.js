// models/index.js
const { sequelize, initializeDatabase } = require('../config/db'); // Adjust the path as needed
const Question = require('./Question');

// Initialize models
Question.initModel(sequelize);

// Function to initialize database and synchronize models
const initDB = async () => {
  await initializeDatabase();
  await sequelize.sync(); // This will create tables if they don't exist
  console.log('All models were synchronized successfully.');
};

module.exports = {
  sequelize,
  initializeDatabase,
  initDB,
  Question,
};
