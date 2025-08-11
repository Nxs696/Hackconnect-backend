const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/userController');
// You can remove the next line as 'auth' is no longer used in this file
// const auth = require('../middleware/authMiddleware');

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', getAllUsers); // The 'auth' middleware has been removed from here

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', getUserById);

module.exports = router;