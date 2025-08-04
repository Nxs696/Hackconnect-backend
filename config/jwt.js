// config/jwt.js
require('dotenv').config(); // Ensure environment variables are loaded here too

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined. Please set this environment variable.');
  process.exit(1); // Exit the process if the secret is not defined
}

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '1h' // Token expiration time (e.g., '1h', '7d')
  };