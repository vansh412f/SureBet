// /services/arbitrageProcessor.js
const axios = require('axios');
const cronParser = require('cron-parser');
const Match = require('../models/Match');
const Opportunity = require('../models/Opportunity');
const SystemState = require('../models/SystemState'); // <-- persistent state

// --- Target Bookmakers (new 10 list) ---
const TARGET_BOOKMAKERS = [
  'betfair',
  'pinnacle',
  'williamhill',
  'bet365',
  'unibet',
  '888sport',
  'betway',
  'coral',
  'ladbrokes',
  'boylesports',
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Helper: read persisted currentKeyIndex (default: 0)
async function readCurrentKeyIndex() {
  const doc = await SystemState.findOne({ key: 'api_state' });
  return doc?.value ?? 0;
}

// Helper: persist currentKeyIndex
async function writeCurrentKeyIndex(newIndex) {
  await SystemState.findOneAndUpdate(
    { key: 'api_state' },
    { $set: { value: newIndex } },
    { upsert: true, new: true }
  );
}

const runArbitrageCheck = async (io) => {
  console.log('Starting arbitrage check with key rotation, safety brake, timestamps, and status stream...');

  // --- Safety brake limit (configurable via .env, fallback to 450) ---
  const CREDIT_SAFETY_LIMIT = 450;
  let processedOddsSnapshots = 0;

  // --- Load API Keys
  const apiKeys = process.env.ODDS_API_KEY?.split(',').map((s) => s.trim()).filter(Boolean) || [];
  if (apiKeys.length === 0) {
    console.error('No API keys found in environment variable.');
    io?.emit('api_error', { message: 'No API keys configured.' });
    return;
  }

  // --- Persistent API key index
  let currentKeyIndex = await readCurrentKeyIndex();
  if (currentKeyIndex >= apiKeys.length) {
    // clamp to a valid index if keys changed
    currentKeyIndex = 0;
    await writeCurrentKeyIndex(0);
  }

  const apiKey = apiKeys[currentKeyIndex];
  console.log(`🔑 Using API Key ${currentKeyIndex + 1}/${apiKeys.length}`);

  const sportsUrl = `https://api.the-odds-api.com/v4/sports?apiKey=${apiKey}`;
  let activeSports = [];

  try {
    // --- Discovery phase ---
    io?.emit('status_update', { message: 'Waking up the engine... Discovering active sports.' });

    const sportsResponse = await axios.get(sportsUrl);
    activeSports = sportsResponse.data.filter(
      (sport) => sport.active === true && sport.has_outrights === false
    );
    console.log(`Found ${activeSports.length} active sports`);

    io?.emit('status_update', {
      message: `Found ${activeSports.length} active leagues. Beginning scan...`,
      activeSportsCount: activeSports.length,
    });
  } catch (e) {
    if (e.response && (e.response.status === 401 || e.response.status === 429)) {
      console.error(`API Key ${currentKeyIndex + 1} exhausted (discovery).`);
      io?.emit('api_error', {
        message:
          "Oops! We've hit our data limit. The system has notified the admin and will be back online shortly.",
      });

      // rotate & persist
      const nextIndex = currentKeyIndex + 1;
      if (nextIndex >= apiKeys.length) {
        console.error('❌ All API keys have been exhausted.');
        await writeCurrentKeyIndex(apiKeys.length - 1); // persist last tried index
        io?.emit('api_error', { message: 'All API keys have been exhausted.' });
        return;
      }
      await writeCurrentKeyIndex(nextIndex);
      console.log(`➡️ Switching to API Key ${nextIndex + 1} on next run.`);
      return;
    }
    console.error('Error fetching sports:', e.message);
    return;
  }

  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  let totalHistoricalSaved = 0;
  const live_opportunities = [];

  // In /services/arbitrageProcessor.js, replace your existing "for" loop

for (const sport of activeSports) {
    console.log(`Fetching odds for ${sport.title}...`);
    const oddsUrl = `https://api.the-odds-api.com/v4/sports/${sport.key}/odds?apiKey=${apiKey}&regions=uk,eu`;

    let matches = [];
    try {
        const oddsResponse = await axios.get(oddsUrl);
        matches = oddsResponse.data;
    } catch (e) {
        if (e.response && (e.response.status === 401 || e.response.status === 429)) {
            console.error(`API Key ${currentKeyIndex + 1} exhausted (odds).`);
            io?.emit('api_error', {
                message: "Oops! We've hit our data limit. The system has notified the admin and will be back online shortly.",
            });
            const nextIndex = currentKeyIndex + 1;
            if (nextIndex >= apiKeys.length) {
                console.error('❌ All API keys have been exhausted.');
                await writeCurrentKeyIndex(apiKeys.length - 1);
                io?.emit('api_error', { message: 'All API keys have been exhausted.' });
                return;
            }
            await writeCurrentKeyIndex(nextIndex);
            console.log(`➡️ Switching to API Key ${nextIndex + 1} on next run.`);
            return;
        }
        console.error(`Error fetching odds for ${sport.key}:`, e.message);
        continue;
    }

    // --- ACCURATE Credit Safety Brake ---
    // First, filter the matches to see exactly what we are going to process.
    const timeFilteredMatches = matches.filter(
        (match) => new Date(match.commence_time) < oneWeekFromNow
    );
    const fullyFilteredMatches = timeFilteredMatches
        .map((match) => {
            const filteredBookmakers = match.bookmakers.filter((bookmaker) =>
                TARGET_BOOKMAKERS.includes(bookmaker.key)
            );
            return { ...match, bookmakers: filteredBookmakers };
        })
        .filter((match) => match.bookmakers.length >= 2);

    // Now, calculate the ACCURATE cost of this batch.
    let costOfThisBatch = 0;
    fullyFilteredMatches.forEach(match => {
        costOfThisBatch += match.bookmakers.length;
    });

    if (processedOddsSnapshots + costOfThisBatch > CREDIT_SAFETY_LIMIT) {
        console.warn(`⚠️ Credit safety limit would be exceeded (Current: ${processedOddsSnapshots}, Batch Cost: ${costOfThisBatch}). Stopping fetch.`);
        io?.emit('status_update', {
            message: 'Credit safety limit reached. Pausing further scans for this run.',
        });
        break; // Stop fetching more sports
    }
    // If the check passes, update the counter BEFORE processing
    processedOddsSnapshots += costOfThisBatch;

    // Now, process the matches you've already filtered.
    for (const match of fullyFilteredMatches) { // Use the already filtered list
        // --- Save raw match (historical) ---
        const matchData = {
            id: match.id,
            sport_key: match.sport_key,
            sport_title: match.sport_title,
            commence_time: new Date(match.commence_time),
            home_team: match.home_team,
            away_team: match.away_team,
            bookmakers: match.bookmakers.map((bookmaker) => ({
                key: bookmaker.key,
                title: bookmaker.title,
                last_update: new Date(bookmaker.last_update),
                markets: bookmaker.markets.map((market) => ({
                    key: market.key,
                    outcomes: market.outcomes.map((outcome) => ({
                        name: outcome.name,
                        price: outcome.price,
                    })),
                })),
            })),
        };
        await Match.findOneAndUpdate({ id: match.id }, matchData, {
            upsert: true,
            new: true,
        });
        totalHistoricalSaved++;

        // --- Arbitrage calculation ---
        const outcomes = new Map();
        match.bookmakers.forEach((bookmaker) => {
            const h2hMarket = bookmaker.markets.find((market) => market.key === 'h2h');
            if (!h2hMarket) return;
            h2hMarket.outcomes.forEach((outcome) => {
                const currentBest = outcomes.get(outcome.name);
                if (!currentBest || outcome.price > currentBest.best_price) {
                    outcomes.set(outcome.name, {
                        best_price: outcome.price,
                        bookmaker_key: bookmaker.key,
                        bookmaker_title: bookmaker.title,
                    });
                }
            });
        });

        const numOutcomes = outcomes.size;
        if (numOutcomes !== 2 && numOutcomes !== 3) continue;

        let sumProb = 0;
        outcomes.forEach((info) => (sumProb += 1 / info.best_price));

        if (sumProb < 1) {
            const profit_percentage = (1 / sumProb - 1) * 100;
            const total_stake = 100;
            const total_profit_on_100 = total_stake * (1 / sumProb - 1);
            const bets = Array.from(outcomes.entries()).map(([outcome_name, info]) => ({
                bookmaker_key: info.bookmaker_key,
                bookmaker_title: info.bookmaker_title,
                outcome_name,
                outcome_price: info.best_price,
                wager_amount: (total_stake * (1 / info.best_price)) / sumProb,
            }));
            live_opportunities.push({
                match_id: match.id,
                sport_key: match.sport_key,
                sport_title: match.sport_title,
                home_team: match.home_team,
                away_team: match.away_team,
                commence_time: new Date(match.commence_time),
                profit_percentage,
                total_profit_on_100,
                bets_to_place: bets,
                last_updated: new Date(),
                status: 'live',
            });
        }
    }

    console.log(`📊 Processed snapshots: ${processedOddsSnapshots}/${CREDIT_SAFETY_LIMIT}`);

    // Emit progress update after finishing a sport
    io?.emit('status_update', {
        message: `Scanning ${sport.title}...`,
        matchesScanned: totalHistoricalSaved,
    });

    await delay(2000);
}

  console.log(`Saved/Updated ${totalHistoricalSaved} historical matches.`);
  console.log(`Calculated ${live_opportunities.length} currently live opportunities.`);

  // --- Status maintenance ---
  const liveMatchIds = live_opportunities.map((opp) => opp.match_id);
  await Opportunity.updateMany(
    { match_id: { $nin: liveMatchIds } },
    { $set: { status: 'past' } }
  );

  for (const opp of live_opportunities) {
    await Opportunity.findOneAndUpdate(
      { match_id: opp.match_id },
      { ...opp, status: 'live' },
      { upsert: true, new: true }
    );
  }
  console.log(`Upserted ${live_opportunities.length} 'live' opportunities.`);

   let nextRunTimestamp = null;
     if (cronExpression) { // <-- ADD THIS CHECK
        try {
            const interval = cronParser.parseExpression(cronExpression);
            nextRunTimestamp = interval.next().toDate();
        } catch (err) {
            console.error("Could not parse cron expression:", err.message);
        }
    }

    // Final broadcast with all stats
    if (io) {
        const opportunities = await Opportunity.find({});
        io.emit('new_opportunities', {
            opportunities,
            stats: {
                matchesScanned: totalHistoricalSaved,
                lastUpdated: new Date(),
                nextRunTimestamp, // <-- ADD THIS
            },
        });
        console.log('Broadcasted latest data to all clients.');
    }
};

module.exports = { runArbitrageCheck };