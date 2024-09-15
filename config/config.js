// config/config.js
require('dotenv').config();

module.exports = {
    ADMIN_PASSWORD_HASH: '$2a$12$TD.JzA/Feo2kFXfyW6y/beaLtSNRQhrghJpZb9xDhRSL9gVc1tjbW', // hashed password 'adminpassword'
    JWT_SECRET: process.env.JWT_TOKEN, // Replace with a secure key
    JWT_EXPIRATION: '1h' // Token expiration time
  };
  