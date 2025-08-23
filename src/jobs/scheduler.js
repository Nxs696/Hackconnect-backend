// In src/jobs/scheduler.js
const cron = require('node-cron');
// Import the new API fetcher script
const fetchHackathonsFromAPI = require('./apiFetcher'); 

const scheduleJobs = (io) => {
  // Run once every day at 2 AM
  cron.schedule('0 2 * * *', () => {
    console.log('Running the daily hackathon API fetch job...');
    fetchHackathonsFromAPI(io); // Call the new function
  });
  
  console.log('Cron jobs scheduled.');
};

module.exports = scheduleJobs;