const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Connection = require('../models/connectionModel');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// User Registration
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// User Authentication
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Get User Profile (Private)
const getUserProfile = asyncHandler(async (req, res) => {
  // The user object is already attached by the 'protect' middleware.
  // No need to find it again.
  res.json(req.user); 
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    // Update additional fields
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.college = req.body.college || user.college;
    user.branch = req.body.branch || user.branch;
    user.skills = req.body.skills || user.skills;
    user.bio = req.body.bio || user.bio;
    user.achievements = req.body.achievements || user.achievements;
    user.socialLinks = req.body.socialLinks || user.socialLinks;
    user.status = req.body.status || user.status;


    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// Get All Users (for Team Maker page)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
  });


// GET a user's public profile
const getPublicProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });

  // POST send a connection request
const sendConnectionRequest = asyncHandler(async (req, res) => {
    const { to } = req.body;
    const from = req.user._id;

    if (to === from.toString()) {
        res.status(400);
        throw new Error("You can't send a request to yourself.");
    }

    const existingConnection = await Connection.findOne({
        $or: [
            { from, to },
            { from: to, to: from }
        ]
    });

    if (existingConnection) {
        res.status(400);
        throw new Error('Connection request already sent or you are already connected.');
    }

    const connection = new Connection({ from, to });
    await connection.save();

    await User.findByIdAndUpdate(from, { $push: { sentRequests: connection._id } });
    await User.findByIdAndUpdate(to, { $push: { receivedRequests: connection._id } });

    res.status(201).json({ message: 'Connection request sent.' });
});

// POST accept a connection request
const acceptConnectionRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.body;
    const userId = req.user._id;

    const request = await Connection.findById(requestId);

    if (!request || request.to.toString() !== userId.toString()) {
        res.status(404);
        throw new Error('Request not found or you are not authorized to accept it.');
    }

    request.status = 'accepted';
    await request.save();

    // Add each user to the other's connections list
    await User.findByIdAndUpdate(request.from, { $push: { connections: request.to } });
    await User.findByIdAndUpdate(request.to, { $push: { connections: request.from } });

    // Remove the request from sent/received lists
    await User.findByIdAndUpdate(request.from, { $pull: { sentRequests: requestId } });
    await User.findByIdAndUpdate(request.to, { $pull: { receivedRequests: requestId } });


    res.json({ message: 'Connection request accepted.' });
});


// POST reject a connection request
const rejectConnectionRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.body;
    const userId = req.user._id;

    const request = await Connection.findById(requestId);

    if (!request || request.to.toString() !== userId.toString()) {
        res.status(404);
        throw new Error('Request not found or you are not authorized to reject it.');
    }

    // Instead of deleting, you might want to set status to 'rejected'
    // and then have a cleanup job, but for simplicity, we'll remove it.
    await Connection.findByIdAndRemove(requestId);

    // Also remove from sent/received arrays
    await User.findByIdAndUpdate(request.from, { $pull: { sentRequests: requestId } });
    await User.findByIdAndUpdate(request.to, { $pull: { receivedRequests: requestId } });


    res.json({ message: 'Connection request rejected.' });
});


module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getPublicProfile,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
};