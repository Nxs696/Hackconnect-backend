const express = require('express');
const router = express.Router();
// --- THIS IS THE FIX ---
// Ensure all the required functions are imported correctly from the controller file.
const {
  getAllHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
} = require('../controllers/hackathonController');
// ----------------------
const { protect } = require('../middleware/authMiddleware');

// The router was trying to use 'getAllHackathons', but it was undefined because of the faulty import.
router.route('/').get(getAllHackathons).post(protect, createHackathon);

router
  .route('/:id')
  .get(getHackathonById)
  .put(protect, updateHackathon)
  .delete(protect, deleteHackathon);

module.exports = router;