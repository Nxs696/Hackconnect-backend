const express = require('express');
const router = express.Router();
const { getHackathons, createHackathon } = require('../controllers/hackathonController');
const { protect } = require('../middleware/authMiddleware');

// Chaining routes that have the same path
router.route('/')
  .get(getHackathons) // Anyone can get hackathons
  .post(protect, createHackathon); // Only logged-in users can create one

module.exports = router;