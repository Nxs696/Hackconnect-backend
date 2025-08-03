// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt'); // Get secret from config
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for 'Bearer' token in Authorization header
  // Example: Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (split "Bearer" and the token string)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, jwtSecret);

      // Find user by ID from decoded token and attach user to the request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Proceed to the next middleware/route handler if token is valid
    } catch (error) {
      console.error('Not authorized, token failed:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired.' });
      }
      res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

module.exports = { protect };