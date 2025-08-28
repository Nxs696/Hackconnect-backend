const axios = require('axios');

const fetchHackathons = async () => {
    try {
        const response = await axios.get('https://devpost.com/api/hackathons');
        // If the API call is successful, return the hackathons array
        return response.data.hackathons;
    } catch (error) {
        console.error('Error fetching data from Devpost API:', error.message);
        // Re-throw the error to be handled by the controller
        throw new Error('Failed to fetch hackathons from the API.');
    }
};

module.exports = fetchHackathons;