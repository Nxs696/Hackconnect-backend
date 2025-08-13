const express = require('express');
const router = express.Router();
// Update the import to include loginUser
const { registerUser, loginUser ,  getUserProfile, } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Define the signup route
router.post('/signup', registerUser);

// Define the login route
router.post('/login', loginUser);
// Add the new protected route
router.get('/me', protect, getUserProfile);

module.exports = router;