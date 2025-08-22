const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile, // Import the new controller
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Get user profile
router.get('/me', protect, getMe);

// UPDATE THIS ROUTE
router.route('/me').get(protect, getMe).put(protect, updateUserProfile);

module.exports = router;