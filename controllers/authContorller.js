// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ADMIN_PASSWORD_HASH, JWT_SECRET, JWT_EXPIRATION } = require('../config/config');

// Controller function to handle admin login
exports.login = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    // Verify the password
    const result = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (result) {
      // Generate a token
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
      res.status(200).json({ token }); // Respond with the token
    } else {
      res.status(401).json({ error: 'Invalid credentials' }); // Invalid password
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
