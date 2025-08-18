const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe, 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Corrected route for user registration
router.post('/register', registerUser); 

// Route for user login
router.post('/login', loginUser);

// Corrected route to get user profile information
router.get('/me', protect, getMe); 

module.exports = router;