const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// User registration
// Path: POST /api/users/register
router.post('/register', registerUser);

// User login
// Path: POST /api/users/login
router.post('/login', loginUser);

// Get and Update user profile
// GET Path: /api/users/me
// PUT Path: /api/users/me
router.route('/me').get(protect, getMe).put(protect, updateUserProfile);

module.exports = router;