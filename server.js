// hackconnect-backend/server.js
require('dotenv').config(); // Load environment variables first

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes'); // Auth routes
const userRoutes = require('./routes/userRoutes');   // User routes
const protectedRoutes = require('./routes/protectedRoutes'); // Example protected routes

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable express to parse JSON request bodies

// --- API Routes ---

// Basic Test Route
app.get('/', (req, res) => {
  res.send('HackConnect Backend API is running!');
});

// Example API Route (for frontend testing) - remains public
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from HackConnect API!', timestamp: new Date() });
});

// Mount authentication routes
app.use('/api/auth', authRoutes);

// Mount user-specific routes (some might be protected)
app.use('/api/users', userRoutes);

// Mount example protected routes
app.use('/api/protected', protectedRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`HackConnect Backend API listening on port ${PORT}`);
  console.log(`Access it at: http://localhost:${PORT}`);
});