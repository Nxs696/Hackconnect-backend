// routes/protectedRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Example of a route that requires authentication
router.get('/data', protect, (req, res) => {
  // Access authenticated user info via req.user (attached by the 'protect' middleware)
  res.status(200).json({
    message: `This is protected data for user ${req.user.name} (${req.user.email})`,
    userId: req.user.id,
    timestamp: new Date()
  });
});

module.exports = router;