const express = require('express');
const router = express.Router();
const {
  getHackathons,
  createHackathon,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
} = require('../controllers/hackathonController');
const { protect } = require('../middleware/authMiddleware');

// Route for /api/hackathons
router.route('/')
  .get(getHackathons)
  .post(protect, createHackathon);

// Route for /api/hackathons/:id
router.route('/:id')
  .get(getHackathonById)
  .put(protect, updateHackathon)
  .delete(protect, deleteHackathon);

module.exports = router;