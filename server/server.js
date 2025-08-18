// /server/server.js
const express = require('express');
const http = require('http'); // Import the 'http' module
const { Server } = require("socket.io"); // Import the 'Server' class
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { runArbitrageCheck } = require('./services/arbitrageProcessor');
const cron = require('node-cron');

dotenv.config();
connectDB();

const app = express();

// This standard CORS is for regular HTTP requests (like your root GET route)
// It's good practice to keep it, but it won't fix the WebSocket issue.
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

// Create an HTTP server from the Express app
const httpServer = http.createServer(app);

// Create a new Socket.IO server and attach it to the HTTP server
// THIS IS THE CRITICAL FIX: Pass CORS options directly to Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// We will use this io instance later to broadcast opportunities
// For now, just a connection log is fine
io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: "Arbitrage Finder API is running" });
});

// Start the HTTP server, not the Express app directly
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Schedule the arbitrage check to run every 30 minutes
cron.schedule('*/30 * * * *', () => {
  console.log('Running scheduled arbitrage check...');
  // Pass the 'io' instance to your function so it can send updates
  runArbitrageCheck(io);
});

console.log('Scheduled arbitrage check to run every 30 minutes.');

// Run the check once on startup to populate data immediately
console.log('Running initial arbitrage check on startup...');
runArbitrageCheck(io); // Also pass 'io' here