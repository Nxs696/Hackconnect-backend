const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    default: 'Online'
  },
  website: {
    type: String,
  },
  themes: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // --- NEW FIELD ADDED ---
  // This field tracks the event's lifecycle automatically.
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Hackathon', hackathonSchema);