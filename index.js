require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const fetchHackathonsFromAPI = require('./src/jobs/apiFetcher');

// Your backend will run on the port specified in .env, likely 3000
const PORT = process.env.PORT || 3000;

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // ✅ CORRECTED: Allow your frontend origin
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
// ✅ CORRECTED: Allow your frontend origin and send credentials
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// --- API ROUTES ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/hackathons', require('./routes/hackathonRoutes'));

// --- ERROR HANDLING ---
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// --- MANUAL TEST ---
console.log("Attempting to run API fetcher manually for testing...");
fetchHackathonsFromAPI(io);