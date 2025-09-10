// anubhav-753/hackconnect-backend/Hackconnect-backend-808601dc6aa6ed8c6890bd63b7f5d7242f84a3b1/index.js (FIXED)

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const fetchHackathonsFromAPI = require('./src/jobs/apiFetcher');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// --- MIDDLEWARE SETUP ---
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// --- API ROUTES ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/hackathons', require('./routes/hackathonRoutes'));

// --- ERROR HANDLING ---
app.use(notFound);
app.use(errorHandler);

// --- SERVER STARTUP ---
const startServer = async () => {
  try {
    // 1. Connect to the database and WAIT for it to finish
    await connectDB();
    console.log("MongoDB connected successfully.");

    // 2. Now that the database is connected, start the server
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

    // --- MANUAL TEST ---
    console.log("Attempting to run API fetcher manually for testing...");
    fetchHackathonsFromAPI(io);

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit if the database connection fails
  }
};

// Start the server
startServer();