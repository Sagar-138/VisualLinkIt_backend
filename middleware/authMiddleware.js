// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const isAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    next(); // Token is valid
  });
};

module.exports = isAdmin;
