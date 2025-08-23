const mongoose = require('mongoose');

const SystemStateSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true }, 
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemState', SystemStateSchema);
