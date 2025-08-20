// /models/SystemState.js
const mongoose = require('mongoose');

const SystemStateSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true }, // e.g., "api_state"
    value: { type: Number, required: true }, // e.g., currentKeyIndex
  },
  { timestamps: true }
);

// Simple key-value store for system-wide state
module.exports = mongoose.model('SystemState', SystemStateSchema);
