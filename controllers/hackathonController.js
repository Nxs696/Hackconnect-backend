const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { z } = require('zod');
const Hackathon = require('../models/hackathonModel');

// --- Zod Schema for Validation ---
const hackathonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  themes: z.array(z.string()).optional(),
});

/**
 * @desc    Get all hackathons
 * @route   GET /api/hackathons
 * @access  Public
 */
const getHackathons = asyncHandler(async (req, res) => {
  // MODIFIED: Only find hackathons that are NOT 'completed' and sort by start date
  const hackathons = await Hackathon.find({ status: { $ne: 'completed' } })
    .sort({ startDate: 'asc' })
    .populate('createdBy', 'name email');
    
  res.status(200).json(hackathons);
});

// --- NO CHANGES NEEDED BELOW THIS LINE ---

/**
 * @desc    Create a new hackathon
 * @route   POST /api/hackathons
 * @access  Private
 */
const createHackathon = asyncHandler(async (req, res) => {
  const validation = hackathonSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400);
    throw new Error(validation.error.errors[0].message);
  }

  const { title, description, startDate, endDate, location, website, themes } = validation.data;
  
  if (new Date(endDate) < new Date(startDate)) {
    res.status(400);
    throw new Error('End date cannot be before the start date.');
  }

  const hackathon = await Hackathon.create({
    title,
    description,
    startDate,
    endDate,
    location,
    website,
    themes,
    createdBy: req.user._id,
  });

  res.status(201).json(hackathon);
});

/**
 * @desc    Get a single hackathon by ID
 * @route   GET /api/hackathons/:id
 * @access  Public
 */
const getHackathonById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid hackathon ID format');
  }

  const hackathon = await Hackathon.findById(req.params.id).populate('createdBy', 'name email');

  if (!hackathon) {
    res.status(404);
    throw new Error('Hackathon not found');
  }

  res.status(200).json(hackathon);
});

/**
 * @desc    Update a hackathon
 * @route   PUT /api/hackathons/:id
 * @access  Private
 */
const updateHackathon = asyncHandler(async (req, res) => {
  const validation = hackathonSchema.partial().safeParse(req.body);

  if (!validation.success) {
    res.status(400);
    throw new Error(validation.error.errors[0].message);
  }

  const hackathon = await Hackathon.findById(req.params.id);

  if (!hackathon) {
    res.status(404);
    throw new Error('Hackathon not found');
  }

  if (hackathon.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to update this hackathon');
  }

  const updatedHackathon = await Hackathon.findByIdAndUpdate(
    req.params.id,
    validation.data,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedHackathon);
});

/**
 * @desc    Delete a hackathon
 * @route   DELETE /api/hackathons/:id
 * @access  Private
 */
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

  res.status(200).json({ id: req.params.id, message: 'Hackathon removed successfully' });
});

module.exports = {
  getHackathons,
  createHackathon,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
};