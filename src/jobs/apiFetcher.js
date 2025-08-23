const axios = require('axios');
const Hackathon = require('../../models/hackathonModel');

// Array of different User-Agent strings to rotate through
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
];

const fetchHackathonsFromAPI = async (io) => {
  console.log('--- Fetching hackathons from MLH API (Robust Mode) ---');
  try {
    // Select a random User-Agent for each request
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    const { data } = await axios.get('https://mlh.io/api/v2/events.json', {
      headers: {
        'User-Agent': randomUserAgent, // Use the randomized User-Agent
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000 // Add a 10-second timeout
    });

    if (!data || !Array.isArray(data)) {
      console.log('No hackathons found in API response.');
      return;
    }

    console.log(`Successfully fetched ${data.length} hackathons from the API.`);
    
    for (const event of data) {
      const hackathonData = {
        title: event.name,
        description: `An official MLH event. Visit the website for more details.`,
        startDate: new Date(event.start_date),
        endDate: new Date(event.end_date),
        website: event.url,
        location: event.is_online ? 'Online' : event.location,
      };

      await Hackathon.updateOne(
        { title: hackathonData.title },
        { $set: hackathonData },
        { upsert: true }
      );
    }
    console.log('Hackathon data saved/updated in the database.');

    if (io) {
      const updatedHackathons = await Hackathon.find({}).sort({ startDate: 'asc' });
      io.emit('hackathons-updated', updatedHackathons);
      console.log('Sent real-time update to clients.');
    }

  } catch (error) {
    console.error('An error occurred during API fetch:', error.message);
  } finally {
    console.log('--- API fetch finished ---');
  }
};

module.exports = fetchHackathonsFromAPI;