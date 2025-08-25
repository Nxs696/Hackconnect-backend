const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getPublicProfile,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Register and get all users
router.route('/').post(registerUser).get(protect, getAllUsers);

// Login
router.post('/login', authUser);

// ✅ Current logged-in user
router.route('/me')
  .get(protect, getUserProfile)     // get own profile
  .put(protect, updateUserProfile); // update own profile

// Public user profile by ID
router.route('/:id').get(getPublicProfile);

// Connection Requests
router.post('/request', protect, sendConnectionRequest);
router.post('/request/accept', protect, acceptConnectionRequest);
router.post('/request/reject', protect, rejectConnectionRequest);

module.exports = router;
