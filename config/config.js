// config/config.js
require('dotenv').config();

const { Sequelize } = require('sequelize');

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

module.exports = {
  ADMIN_PASSWORD_HASH: '$2a$12$TD.JzA/Feo2kFXfyW6y/beaLtSNRQhrghJpZb9xDhRSL9gVc1tjbW', // hashed password 'adminpassword'
  JWT_SECRET: process.env.JWT_TOKEN, // Replace with a secure key
  JWT_EXPIRATION: '1h', // Token expiration time
  sequelize, // Export Sequelize instance
};
