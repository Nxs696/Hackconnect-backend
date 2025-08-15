const cron = require('node-cron');
const Hackathon = require('../models/hackathonModel');

// This task will run every hour
const scheduleHackathonUpdates = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running a job every hour to update hackathon statuses...');
    const now = new Date();

    try {
      // Find ongoing hackathons that have ended and mark them as 'completed'
      await Hackathon.updateMany(
        { status: 'ongoing', endDate: { $lt: now } },
        { $set: { status: 'completed' } }
      );

      // Find upcoming hackathons that have started and mark them as 'ongoing'
      await Hackathon.updateMany(
        { status: 'upcoming', startDate: { $lte: now }, endDate: { $gte: now } },
        { $set: { status: 'ongoing' } }
      );

      console.log('Hackathon statuses updated successfully.');
    } catch (error) {
      console.error('Error updating hackathon statuses:', error);
    }
  });
};

module.exports = scheduleHackathonUpdates;