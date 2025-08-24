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

router.route('/').post(registerUser).get(protect, getAllUsers);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').get(getPublicProfile);


// Connection Requests
router.post('/request', protect, sendConnectionRequest);
router.post('/request/accept', protect, acceptConnectionRequest);
router.post('/request/reject', protect, rejectConnectionRequest);


module.exports = router;