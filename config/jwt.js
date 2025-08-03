// config/jwt.js
module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_if_not_set', // Use process.env.JWT_SECRET
    jwtExpiresIn: '1h' // Token expiration time (e.g., '1h', '7d')
  };