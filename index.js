const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // 1. Import the cors package
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');

dotenv.config();

connectDB();

const app = express();

// 2. Use CORS middleware - This should be placed before your routes
app.use(cors()); 

// Middleware to accept JSON data
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Your API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);

// --- Error Middleware ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);