const asyncHandler = require('express-async-handler');
const { z } = require('zod');
const Hackathon = require('../models/hackathonModel');

// --- Zod Schema for Validation ---
const hackathonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  startDate: z.coerce.date(), // coerce will try to convert string to Date
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
  const hackathons = await Hackathon.find({}).populate('createdBy', 'name email');
  res.status(200).json(hackathons);
});


/**
 * @desc    Create a new hackathon
 * @route   POST /api/hackathons
 * @access  Private
 */
const createHackathon = asyncHandler(async (req, res) => {
  // Validate request body against Zod schema
  const validation = hackathonSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400);
    //throw new Error(validation.error.errors[0].message); // a bit messy
    throw new Error(validation.error.flatten().fieldErrors)
  }

  const { title, description, startDate, endDate, location, website, themes } = validation.data;

  const hackathon = await Hackathon.create({
    title,
    description,
    startDate,
    endDate,
    location,
    website,
    themes,
    createdBy: req.user._id, // Attach the logged-in user's ID
  });

  res.status(201).json(hackathon);
});

/**
 * @desc    Delete a hackathon
 * @route   DELETE /api/hackathons/:id
 * @access  Private
 */
const deleteHackathon = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id);

  // Check if hackathon exists
  if (!hackathon) {
    res.status(404);
    throw new Error('Hackathon not found');
  }

  // Check if the logged-in user is the one who created the hackathon
  if (hackathon.createdBy.toString() !== req.user.id) {
    res.status(401); // 401 Unauthorized
    throw new Error('User not authorized to delete this hackathon');
  }

  // If checks pass, delete the hackathon
  await hackathon.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Hackathon removed successfully' });
});


module.exports = {
  getHackathons,
  createHackathon,
  deleteHackathon, 
};