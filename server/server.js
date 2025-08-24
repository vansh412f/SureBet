const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { runArbitrageCheck } = require('./services/arbitrageProcessor');
const cron = require('node-cron');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: "Arbitrage Finder API is running" });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// schedule the arbitrage check to run every hour
const CRON_SCHEDULE = '0 * * * *'; 
cron.schedule(CRON_SCHEDULE, () => {
  console.log('Running scheduled arbitrage check...');
  runArbitrageCheck(io, CRON_SCHEDULE); 
});

console.log(`Scheduled arbitrage check to run every hour.`);
// initial run on server start
runArbitrageCheck(io, CRON_SCHEDULE);
