const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Register and get all users
router.route('/').post(registerUser).get(protect, getUsers);

// Login
router.post('/login', authUser);

// Current logged-in user
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin routes
router
  .route('/:id')
  .delete(protect, deleteUser)
  .get(protect, getUserById)
  .put(protect, updateUser);

module.exports = router;