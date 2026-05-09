const axios = require('axios');
const { parseExpression } = require('cron-parser');
const Match = require('../models/Match');
const Opportunity = require('../models/Opportunity');
const SystemState = require('../models/SystemState');

const TARGET_BOOKMAKERS = [
  'betfair', 'pinnacle', 'williamhill', 'bet365', 'unibet',
  '888sport', 'betway', 'coral', 'ladbrokes', 'boylesports',
];

// Permanent cap: profit_percentage above this value is a data error, never stored or broadcast.
const MAX_ARBIT_PROFIT = 60;

// Cooldown period after all API keys are exhausted (ms). Prevents hammering on the next cron tick.
const ALL_KEYS_EXHAUSTED_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours

// Promise-based delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Extracts a clean sport category from the sport_title string.
// e.g. "Soccer - EPL" -> "Soccer", "Basketball" -> "Basketball"
function extractSportCategory(sportTitle) {
  if (!sportTitle) return 'Other';
  const parts = sportTitle.split(' - ');
  return parts[0].trim();
}

// Normalises a team name for fuzzy comparison.
function normaliseTeamName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/\b(fc|afc|cf|sc|united|city|town|rovers|wanderers|athletic|utd)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Returns true if two team names are "close enough" to be the same club.
function teamsMatch(a, b) {
  if (!a || !b) return false;
  const na = normaliseTeamName(a);
  const nb = normaliseTeamName(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

// ── SystemState helpers ──────────────────────────────────────────────────────
async function readCurrentKeyIndex() {
  const doc = await SystemState.findOne({ key: 'api_state' });
  return doc?.value ?? 0;
}

async function writeCurrentKeyIndex(newIndex) {
  await SystemState.findOneAndUpdate(
    { key: 'api_state' },
    { $set: { value: newIndex } },
    { upsert: true, new: true }
  );
}

async function readExhaustedAt() {
  const doc = await SystemState.findOne({ key: 'exhausted_at' });
  return doc?.value ?? 0;
}

async function writeExhaustedAt(ts) {
  await SystemState.findOneAndUpdate(
    { key: 'exhausted_at' },
    { $set: { value: ts } },
    { upsert: true, new: true }
  );
}

// Main arbitrage scanning function.
// @param {SocketIO.Server} io - Socket.IO server instance for live status updates
// @param {string} cronSchedule - The cron string used to schedule this job
const runArbitrageCheck = async (io, cronSchedule = '0 * * * *') => {
  console.log('Starting arbitrage check...');

  // ── All-keys-exhausted cooldown check ───────────────────────────────────
  const exhaustedAt = await readExhaustedAt();
  if (exhaustedAt > 0) {
    const msSinceExhausted = Date.now() - exhaustedAt;
    if (msSinceExhausted < ALL_KEYS_EXHAUSTED_COOLDOWN_MS) {
      const hoursLeft = ((ALL_KEYS_EXHAUSTED_COOLDOWN_MS - msSinceExhausted) / 3600000).toFixed(1);
      console.warn(`⏳ All API keys were recently exhausted. Cooldown: ${hoursLeft}h remaining.`);
      io?.emit('status_update', { message: `API key cooldown active. Next attempt in ${hoursLeft}h.` });
      return;
    }
    // Cooldown expired — clear the flag and proceed
    await writeExhaustedAt(0);
  }

  const MATCH_SCAN_LIMIT = 250;
  let matchesProcessedThisRun = 0;
  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Load API keys
  const apiKeys = process.env.ODDS_API_KEY?.split(',').map((s) => s.trim()).filter(Boolean) || [];
  if (apiKeys.length === 0) {
    console.error('No API keys found.');
    io?.emit('api_error', { message: 'No API keys configured.' });
    return;
  }

  let currentKeyIndex = await readCurrentKeyIndex();
  if (currentKeyIndex >= apiKeys.length) {
    currentKeyIndex = 0;
    await writeCurrentKeyIndex(0);
  }

  let apiKey = apiKeys[currentKeyIndex];
  console.log(`🔑 Using API Key ${currentKeyIndex + 1}/${apiKeys.length}`);

  // ── Fetch active sports ──────────────────────────────────────────────────
  let activeSports = [];
  try {
    io?.emit('status_update', { message: 'Discovering active sports...' });
    const sportsRes = await axios.get(
      `https://api.the-odds-api.com/v4/sports?apiKey=${apiKey}`
    );
    activeSports = sportsRes.data.filter(
      (s) => s.active === true && s.has_outrights === false
    );
    console.log(`Found ${activeSports.length} active sports.`);
  } catch (e) {
    console.error('Failed to fetch active sports list:', e.message);
    io?.emit('api_error', { message: 'Could not fetch active sports. Please check API keys.' });
    return;
  }

  let totalHistoricalSaved = 0;
  const live_opportunities = [];
  let scanCompletedFully = false;

  // ── Main scanning loop ───────────────────────────────────────────────────
  for (const sport of activeSports) {
    if (matchesProcessedThisRun >= MATCH_SCAN_LIMIT) {
      console.log(`✅ Match scan limit of ${MATCH_SCAN_LIMIT} reached. Ending session.`);
      scanCompletedFully = true;
      break;
    }

    console.log(`Fetching odds for ${sport.title}...`);
    let matches = [];
    let fetchSuccessful = false;

    while (!fetchSuccessful) {
      try {
        const oddsRes = await axios.get(
          `https://api.the-odds-api.com/v4/sports/${sport.key}/odds?apiKey=${apiKey}&regions=uk,eu`
        );
        matches = oddsRes.data;
        fetchSuccessful = true;
      } catch (e) {
        // ── API Key Rotation ─────────────────────────────────────────────
        if (e.response && (e.response.status === 401 || e.response.status === 422 || e.response.status === 429)) {
          console.error(`API Key ${currentKeyIndex + 1} exhausted/invalid for: ${sport.title}`);
          io?.emit('status_update', { message: `Key ${currentKeyIndex + 1} exhausted, trying next key...` });

          currentKeyIndex++;
          if (currentKeyIndex >= apiKeys.length) {
            console.error('❌ All API keys exhausted for this session.');
            io?.emit('api_error', { message: 'All available API keys have been exhausted.' });
            await writeCurrentKeyIndex(0);            // reset index for next run
            await writeExhaustedAt(Date.now());       // record exhaustion time for cooldown
            return;
          }

          apiKey = apiKeys[currentKeyIndex];
          await writeCurrentKeyIndex(currentKeyIndex);
          console.log(`➡️ Switched to API Key ${currentKeyIndex + 1}/${apiKeys.length}. Retrying ${sport.title}...`);
          await delay(1000);
        } else {
          console.error(`Unexpected error fetching odds for ${sport.key}:`, e.message);
          break; // non-key error — skip this sport
        }
      }
    }

    // ── Filter matches ───────────────────────────────────────────────────
    const timeFiltered = matches.filter(
      (m) => new Date(m.commence_time) < oneWeekFromNow
    );
    const fullyFiltered = timeFiltered
      .map((m) => ({
        ...m,
        bookmakers: m.bookmakers.filter((bk) => TARGET_BOOKMAKERS.includes(bk.key)),
      }))
      .filter((m) => m.bookmakers.length >= 2);

    // ── Save matches & calculate arbitrage ───────────────────────────────
    for (const match of fullyFiltered) {
      const sportCategory = extractSportCategory(match.sport_title);

      // Persist match history
      const matchData = {
        id: match.id,
        sport_key: match.sport_key,
        sport_title: match.sport_title,
        commence_time: new Date(match.commence_time),
        home_team: match.home_team,
        away_team: match.away_team,
        bookmakers: match.bookmakers.map((bk) => ({
          key: bk.key,
          title: bk.title,
          last_update: new Date(bk.last_update),
          markets: bk.markets.map((mkt) => ({
            key: mkt.key,
            outcomes: mkt.outcomes.map((o) => ({ name: o.name, price: o.price })),
          })),
        })),
      };
      await Match.findOneAndUpdate({ id: match.id }, matchData, { upsert: true, new: true });
      totalHistoricalSaved++;
      matchesProcessedThisRun++;

      // ── Arbitrage calculation ────────────────────────────────────────
      const outcomes = new Map();
      match.bookmakers.forEach((bk) => {
        const h2h = bk.markets.find((mkt) => mkt.key === 'h2h');
        if (!h2h) return;
        h2h.outcomes.forEach((o) => {
          const current = outcomes.get(o.name);
          if (!current || o.price > current.best_price) {
            outcomes.set(o.name, {
              best_price: o.price,
              bookmaker_key: bk.key,
              bookmaker_title: bk.title,
            });
          }
        });
      });

      const numOutcomes = outcomes.size;
      const outcomeNames = Array.from(outcomes.keys());
      const hasDrawOutcome = outcomeNames.includes('Draw');

      const isTwoWay = numOutcomes === 2 && !hasDrawOutcome;
      const isThreeWay =
        numOutcomes === 3 &&
        hasDrawOutcome &&
        outcomeNames.some((n) => teamsMatch(n, match.home_team)) &&
        outcomeNames.some((n) => teamsMatch(n, match.away_team));

      if (!isTwoWay && !isThreeWay) continue;

      let sumProb = 0;
      outcomes.forEach((info) => (sumProb += 1 / info.best_price));

      if (sumProb < 1) {
        const profit_percentage = (1 / sumProb - 1) * 100;

        if (profit_percentage > MAX_ARBIT_PROFIT) {
          console.warn(`Skipping ${match.home_team} vs ${match.away_team}: profit ${profit_percentage.toFixed(1)}% exceeds cap`);
          continue;
        }

        const total_stake = 100;
        const total_return = total_stake / sumProb;

        const bets = Array.from(outcomes.entries()).map(([outcome_name, info]) => ({
          bookmaker_key: info.bookmaker_key,
          bookmaker_title: info.bookmaker_title,
          outcome_name,
          outcome_price: info.best_price,
          wager_amount: total_return / info.best_price,
        }));

        live_opportunities.push({
          match_id: match.id,
          sport_key: match.sport_key,
          sport_category: sportCategory,
          sport_title: match.sport_title,
          home_team: match.home_team,
          away_team: match.away_team,
          commence_time: new Date(match.commence_time),
          profit_percentage,
          total_profit_on_100: total_return - total_stake,
          bets_to_place: bets,
          last_updated: new Date(),
          status: 'live',
        });
      }
    }

    io?.emit('status_update', {
      message: `Scanning ${sport.title}...`,
      matchesScanned: totalHistoricalSaved,
    });

    await delay(500);
  }

  // Mark fully completed if we exhausted all sports before hitting the match limit
  if (!scanCompletedFully) {
    scanCompletedFully = true;
  }

  console.log(`Saved/updated ${totalHistoricalSaved} matches.`);
  console.log(`Found ${live_opportunities.length} live arbitrage opportunities.`);

  // Only purge old 'live' opportunities when the scan ran to completion.
  if (scanCompletedFully) {
    const liveMatchIds = live_opportunities.map((o) => o.match_id);
    await Opportunity.updateMany(
      { status: 'live', match_id: { $nin: liveMatchIds } },
      { $set: { status: 'past' } }
    );
    console.log(`Marked old live opportunities as past (full scan).`);
  }

  // Upsert live opportunities
  for (const opp of live_opportunities) {
    await Opportunity.findOneAndUpdate(
      { match_id: opp.match_id },
      { ...opp, status: 'live' },
      { upsert: true, new: true }
    );
  }
  console.log(`Upserted ${live_opportunities.length} live opportunities.`);

  // Calculate next run timestamp
  let nextRunTimestamp = null;
  try {
    nextRunTimestamp = parseExpression(cronSchedule).next().toDate();
  } catch (err) {
    console.error('Could not parse cron expression:', err.message);
  }

  // Broadcast results
  if (io) {
    const allOpportunities = await Opportunity.find({});
    io.emit('new_opportunities', {
      opportunities: allOpportunities,
      stats: {
        matchesScanned: totalHistoricalSaved,
        lastUpdated: new Date(),
        nextRunTimestamp,
      },
    });
  }
};

module.exports = { runArbitrageCheck };
