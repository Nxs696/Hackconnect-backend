const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getPublicProfile,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// --- Public Routes ---
router.post('/login', authUser);
router.route('/').post(registerUser);
router.route('/:id/profile').get(getPublicProfile);

// --- Protected Routes (for the logged-in user) ---
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// --- Connection Request Routes ---
router.post('/request', protect, sendConnectionRequest);
router.post('/request/accept', protect, acceptConnectionRequest);
router.post('/request/reject', protect, rejectConnectionRequest);

// --- Admin Routes ---
router.route('/').get(protect, admin, getUsers);
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;