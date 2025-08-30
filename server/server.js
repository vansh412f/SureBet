const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { runArbitrageCheck } = require('./services/arbitrageProcessor');
const cron = require('node-cron');
const Opportunity = require('./models/Opportunity');

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

io.on('connection', async (socket) => { 
  console.log('A user connected via WebSocket:', socket.id);
  
  try {
    const allOpportunities = await Opportunity.find({});
    socket.emit('new_opportunities', {
      opportunities: allOpportunities,
      stats: {
        matchesScanned: 0, 
        lastUpdated: new Date(),
        nextRunTimestamp: null, 
      }
    });

    console.log(`Sent initial data load of ${allOpportunities.length} opportunities to ${socket.id}`);
  } catch (error) {
    console.error('Failed to send initial data to new user:', error);
  }
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
