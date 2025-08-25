// HACKCONNECT-BACKEND/middleware/authMiddleware.js (Corrected Version)

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if the authorization header exists and is correctly formatted
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get the token from the header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user by the ID stored in the token and attach to the request
      // We exclude the password from the user object
      req.user = await User.findById(decoded.id).select('-password');
      
      // If the user associated with the token is not found in the DB
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); // If everything is successful, proceed to the next route
      return; // Stop the function here
    } catch (error) {
      // This will catch errors from jwt.verify (e.g., token expired, invalid signature)
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // 5. If the 'if' block was skipped, it means no token was found in the header
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };