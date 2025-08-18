require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
// Import the scheduler function
const scheduleHackathonUpdates = require('./src/jobs/hackathonStatusUpdater');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Call the function to start the cron job
scheduleHackathonUpdates();

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/hackathons', require('./routes/hackathonRoutes'));

// A simple test route for the server's root URL
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to HackConnect API! 🎉' });
});

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});