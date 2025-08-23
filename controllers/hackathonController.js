const asyncHandler = require('express-async-handler');
const Hackathon = require('../models/hackathonModel');

// @desc    Get all hackathons with search and sorting
// @route   GET /api/hackathons
// @access  Public
const getAllHackathons = asyncHandler(async (req, res) => { // <-- RENAMED THIS FUNCTION
  const keyword = req.query.search
    ? {
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const hackathons = await Hackathon.find({ ...keyword }).sort({ startDate: 'asc' });
  res.json(hackathons);
});

// @desc    Get a single hackathon by ID
// @route   GET /api/hackathons/:id
// @access  Public
const getHackathonById = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id);

  if (!hackathon) {
    res.status(404);
    throw new Error('Hackathon not found');
  }

  res.json(hackathon);
});

// @desc    Create a hackathon
// @route   POST /api/hackathons
// @access  Private
const createHackathon = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate, location, website, themes } = req.body;

  if (!title || !description || !startDate || !endDate) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const hackathon = await Hackathon.create({
    title,
    description,
    startDate,
    endDate,
    location: location || 'Online',
    website,
    themes,
    createdBy: req.user._id,
  });

  res.status(201).json(hackathon);
});

// @desc    Update a hackathon
// @route   PUT /api/hackathons/:id
// @access  Private
const updateHackathon = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id);

  if (!hackathon) {
    res.status(404);
    throw new Error('Hackathon not found');
  }

  if (hackathon.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to update this hackathon');
  }

  const updatedHackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updatedHackathon);
});

// @desc    Delete a hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private
const deleteHackathon = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id);

  if (!hackathon) {
    res.status(404);
    throw new Error('Hackathon not found');
  }

  if (hackathon.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to delete this hackathon');
  }

  await hackathon.deleteOne();
  res.json({ id: req.params.id });
});

module.exports = {
  getAllHackathons, // <-- UPDATED THE EXPORT NAME
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
};