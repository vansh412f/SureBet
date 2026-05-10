const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const dotenv = require('dotenv');
const { parseExpression } = require('cron-parser');
const connectDB = require('./config/db');
const { runArbitrageCheck } = require('./services/arbitrageProcessor');
const cron = require('node-cron');
const Opportunity = require('./models/Opportunity');

dotenv.config();
connectDB();

const app = express();

const rawOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = rawOrigin.split(',').map((o) => o.trim()).filter(Boolean);
const corsOrigin = allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins;

app.use(cors({ origin: corsOrigin }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
  },
});

const CRON_SCHEDULE = '0 * * * *';

io.on('connection', async (socket) => {
  console.log('A user connected via WebSocket:', socket.id);

  try {
    const allOpportunities = await Opportunity.find({});

    let nextRunTimestamp = null;
    try {
      nextRunTimestamp = parseExpression(CRON_SCHEDULE).next().toDate();
    } catch (_) {}

    socket.emit('new_opportunities', {
      opportunities: allOpportunities,
      stats: {
        matchesScanned: 0,
        lastUpdated: new Date(),
        nextRunTimestamp,
      }
    });

    console.log(`Sent ${allOpportunities.length} opportunities to ${socket.id}`);
  } catch (error) {
    console.error('Failed to send initial data to new user:', error);
  }
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Arbitrage Finder API is running' });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

cron.schedule(CRON_SCHEDULE, () => {
  console.log('Running scheduled arbitrage check...');
  runArbitrageCheck(io, CRON_SCHEDULE);
});

console.log('Scheduled arbitrage check to run every hour.');

runArbitrageCheck(io, CRON_SCHEDULE);
