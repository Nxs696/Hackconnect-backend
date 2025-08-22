require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const scheduleHackathonUpdates = require('./src/jobs/hackathonStatusUpdater');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const PORT = process.env.PORT || 3000;

// Connect to the database first
connectDB();

// If you have cron jobs, initialize them
scheduleHackathonUpdates();

const app = express();

// --- Essential Middlewares ---

// 1. CORS: Handles cross-origin requests from your frontend
const corsOptions = {
  origin: 'http://localhost:3001', // Your React app's URL
  credentials: true,
};
app.use(cors(corsOptions));

// 2. Body Parsers: Allow the server to read JSON and URL-encoded data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// --- API Routes ---
// All user-related routes will be prefixed with /api/users
app.use('/api/users', require('./routes/userRoutes'));
// All hackathon-related routes will be prefixed with /api/hackathons
app.use('/api/hackathons', require('./routes/hackathonRoutes'));

// A simple welcome route for the root URL
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to HackConnect API! 🎉' });
});


// --- Error Handling Middlewares (must be last) ---
app.use(notFound);
app.use(errorHandler);


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});