// controllers/userController.js
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires authentication)
const getUserProfile = async (req, res) => {
  // req.user will be available from the authMiddleware after successful token verification
  const user = await User.findById(req.user.id).select('-password'); // Exclude password from response

  if (user) {
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } else {
    // This case should ideally not be reached if middleware correctly authenticates
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  getUserProfile,
};