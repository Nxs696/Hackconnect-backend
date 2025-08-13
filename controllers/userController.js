const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

//... at the top

/**
 * @desc    Get user profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
    // The user is already available in req.user thanks to the protect middleware
    res.status(200).json(req.user);
  });

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/signup
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  // 2. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with that email already exists');
  }

  // 3. Create and save the new user
  // The password will be automatically hashed by the middleware in userModel.js
  const user = await User.create({
    name,
    email,
    password,
  });

  // 4. Respond with user data and a token
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // 1. Check for email and password
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide an email and password');
    }
  
    // 2. Find user by email
    // We use .select('+password') to explicitly get the password,
    // since we set select: false in our schema.
    const user = await User.findOne({ email }).select('+password');
  
    // 3. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // 4. Respond with user data and a new token
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401); // 401 Unauthorized
      throw new Error('Invalid email or password');
    }
  });

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};