const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { runArbitrageCheck } = require('./services/arbitrageProcessor');
const cron = require('node-cron');

dotenv.config();

connectDB();

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.json({ message: "Arbitrage Finder API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Schedule the arbitrage check to run every 30 minutes
cron.schedule('*/30 * * * *', () => {
  console.log('Running scheduled arbitrage check...');
  runArbitrageCheck();
});

console.log('Scheduled arbitrage check to run every 30 minutes.');

// Run the check once on startup to populate data immediately
console.log('Running initial arbitrage check on startup...');
runArbitrageCheck();