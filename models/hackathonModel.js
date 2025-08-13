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
    type: [String], // An array of strings like ["AI", "Blockchain", "HealthTech"]
    default: [],
  },
  // Link this hackathon to the user who created it
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This creates a reference to the 'User' model
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Hackathon', hackathonSchema);