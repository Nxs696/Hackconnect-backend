const express = require('express');
const router = express.Router();
const {
  getHackathons,
  setHackathon, // Corrected function name
  updateHackathon,
  deleteHackathon,
} = require('../controllers/hackathonController');
const { protect } = require('../middleware/authMiddleware');

// Routes for getting all hackathons and creating a new one
router.route('/').get(getHackathons).post(protect, setHackathon);

// Routes for updating and deleting a specific hackathon
router
  .route('/:id')
  .put(protect, updateHackathon)
  .delete(protect, deleteHackathon);

module.exports = router;