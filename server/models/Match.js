const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    sport_key: {
        type: String,
        required: true
    },
    sport_title: {
        type: String,
        required: true
    },
    commence_time: {
        type: Date,
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
    bookmakers: [
        {
            key: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            last_update: {
                type: Date,
                required: true
            },
            markets: [
                {
                    key: {
                        type: String,
                        required: true
                    },
                    outcomes: [
                        {
                            name: {
                                type: String,
                                required: true
                            },
                            price: {
                                type: Number,
                                required: true
                            }
                        }
                    ]
                }
            ]
        }
    ]
});

MatchSchema.index({ id: 1 }, { unique: true });

// BUG-19 fix: Auto-expire historical match documents 30 days after the match starts.
// This prevents the matches collection from growing unbounded over months of operation.
MatchSchema.index({ commence_time: 1 }, { expireAfterSeconds: 30 * 24 * 3600 });

module.exports = mongoose.model('Match', MatchSchema);