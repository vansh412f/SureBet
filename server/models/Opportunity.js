const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  match_id: {
    type: String,
    required: true
  },
  sport_key: {
    type: String,
    default: ''
  },
  sport_category: {
    type: String,
    default: ''
  },
  sport_title: {
    type: String,
    required: true
  },
  home_team: {
    type: String,
    required: true
  },
  away_team: {
    type: String,
    required: true
  },
  commence_time: {
    type: Date,
    required: true
  },
  profit_percentage: {
    type: Number,
    required: true
  },
  total_profit_on_100: {
    type: Number,
    default: 0
  },
  bets_to_place: [
    {
      bookmaker_key: {
        type: String,
        required: true
      },
      bookmaker_title: {
        type: String,
        required: true
      },
      outcome_name: {
        type: String,
        required: true
      },
      outcome_price: {
        type: Number,
        required: true
      },
      wager_amount: { 
        type: Number, 
        required: true 
      }
    }
  ],
  last_updated: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['live', 'past'],
    default: 'live'
  }
});

OpportunitySchema.index({ match_id: 1 }, { unique: true });

module.exports = mongoose.model('Opportunity', OpportunitySchema);
