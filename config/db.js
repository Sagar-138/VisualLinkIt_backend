// config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'visualchat_bot',
  process.env.DB_USER || 'your_mysql_username',
  process.env.DB_PASSWORD || 'your_mysql_password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to true for debugging
  }
);

// Function to connect to MySQL
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database');
    // You can add more initialization logic here if needed
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = {
  sequelize,
  initializeDatabase,
};
