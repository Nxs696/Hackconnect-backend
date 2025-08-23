require('dotenv').config();
const express = require('express'); // This line is correct
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const fetchHackathonsFromAPI = require('./src/jobs/apiFetcher'); 

const PORT = process.env.PORT || 3000;

connectDB();

const app = express(); // <-- THIS WAS THE LINE WITH THE TYPO
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

// Middlewares and Routes
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/hackathons', require('./routes/hackathonRoutes'));
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// --- MANUAL TEST ---
console.log("Attempting to run API fetcher manually for testing...");
fetchHackathonsFromAPI(io);