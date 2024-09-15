// controller/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ADMIN_PASSWORD_HASH, JWT_SECRET, JWT_EXPIRATION } = require('../config/config');


console.log('JWT_SECRET:', JWT_SECRET); // Add this line to debug

// Controller function to handle admin login
exports.login = (req, res) => {
  const { password } = req.body;

  // Verify the password
  bcrypt.compare(password, ADMIN_PASSWORD_HASH, (err, result) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    if (result) {
      // Generate a token
      const token = jwt.sign({}, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
      res.status(200).json({ token }); // Respond with the token
    } else {
      res.status(401).json({ error: 'Invalid credentials' }); // Invalid password
    }
  });
};
