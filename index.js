// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const userRoutes = require('./routes/userRoutes.js');
const hackathonRoutes = require('./routes/hackathonRoutes.js');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express app
const app = express();

// Use CORS middleware
app.use(cors());

// index.js
app.use(express.json({ limit: '10mb' }));  // or even '50mb' if needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(
  PORT,
  () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);