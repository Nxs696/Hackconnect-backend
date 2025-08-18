const express = require('express');
const router = express.Router();
const {
  getHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
} = require('../controllers/hackathonController');
const { protect } = require('../middleware/authMiddleware');

// Routes for getting all hackathons and creating a new one
router.route('/').get(getHackathons).post(protect, createHackathon);

// Routes for a specific hackathon
router
  .route('/:id')
  .get(getHackathonById) // ✅ added
  .put(protect, updateHackathon)
  .delete(protect, deleteHackathon);

module.exports = router;
