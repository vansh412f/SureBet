const axios = require('axios');
const cronParser = require('cron-parser');
const Match = require('../models/Match');
const Opportunity = require('../models/Opportunity');
const SystemState = require('../models/SystemState');

const TARGET_BOOKMAKERS = ['betfair', 'pinnacle', 'williamhill', 'bet365', 'unibet', '888sport', 'betway', 'coral', 'ladbrokes', 'boylesports',];

// promise is future result of async function
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// for keeping track of index of api key used
async function readCurrentKeyIndex() {
  const doc = await SystemState.findOne({ key: 'api_state' });
  return doc?.value ?? 0;
}

// initially writes the api state key as 0 because when read function is performed the data is null, so it sets the value to 0
async function writeCurrentKeyIndex(newIndex) {
  await SystemState.findOneAndUpdate(
    { key: 'api_state' },
    { $set: { value: newIndex } },
    { upsert: true, new: true }
  );
}

const runArbitrageCheck = async (io) => {
  console.log('Starting initial arbitrage check .....');

  // safety for api usage limit reached
  const MATCH_SCAN_LIMIT = 250;
  let matchesProcessedThisRun = 0;
  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // loads the api keys 
  const apiKeys = process.env.ODDS_API_KEY?.split(',').map((s) => s.trim()).filter(Boolean) || [];
  if (apiKeys.length === 0) {
    console.error('No API keys found.');
    io?.emit('api_error', { message: 'No API keys configured.' });
    return;
  }

  let currentKeyIndex = await readCurrentKeyIndex();
  if (currentKeyIndex >= apiKeys.length) {
    currentKeyIndex = 0;                            // if by chance, error occurs, then switch to start, avoiding failure  
    await writeCurrentKeyIndex(0);
  }

  let apiKey = apiKeys[currentKeyIndex];
  console.log(`🔑 Using API Key ${currentKeyIndex + 1}/${apiKeys.length}`);

  let activeSports = [];
  try {
    // updates frontend about starting work
    io?.emit('status_update', { message: 'Waking up the server... Discovering active sports.' });
    const sportsUrl = `https://api.the-odds-api.com/v4/sports?apiKey=${apiKey}`;   //first check for the ongoing sports in realtime
    const sportsResponse = await axios.get(sportsUrl);
    activeSports = sportsResponse.data.filter(
      (sport) => sport.active === true && sport.has_outrights === false
    );
    console.log(`Found ${activeSports.length} active sports.`);

  } catch (e) {                       // this block executes if the api usage has reached while fetching active sports                 
    console.error('Failed to fetch active sports list. A valid API key is needed to start. Stopping run.', e.message);
    io?.emit('api_error', { message: 'Could not fetch active sports. Please check API keys.' });
    return;
  }

  let totalHistoricalSaved = 0;
  const live_opportunities = [];

  // main loop for fetching odds for matches from each sport
  for (const sport of activeSports) {
    if (matchesProcessedThisRun >= MATCH_SCAN_LIMIT) {
      console.log(`✅ Match scan limit of ${MATCH_SCAN_LIMIT} reached. Ending session.`);
      break; // main loop stop if number of matches scanned satisfied
    }
    console.log(`Fetching odds for ${sport.title}...`);
    let matches = [];

    let fetchSuccessful = false;    // for continue retrying fetch if key exhausted
    while (!fetchSuccessful) {
      try {
        const oddsUrl = `https://api.the-odds-api.com/v4/sports/${sport.key}/odds?apiKey=${apiKey}&regions=uk,eu`;
        const oddsResponse = await axios.get(oddsUrl);
        matches = oddsResponse.data;
        fetchSuccessful = true;  // retry loop stop if number of matches scanned satisfied
      } catch (e) {

        //--------------------------------- API Key Rotation Logic -------------------------------

        if (e.response && (e.response.status === 401 || e.response.status === 429)) {
          console.error(`API Key ${currentKeyIndex + 1} exhausted for sport: ${sport.title}.`);
          io?.emit('status_update', { message: `Key ${currentKeyIndex + 1} exhausted, trying next key...` });

          currentKeyIndex++;

          if (currentKeyIndex >= apiKeys.length) {
            console.error('❌ All API keys have been exhausted for this session.');
            io?.emit('api_error', { message: 'All available API keys have been exhausted.' });

            console.log('♻️ Resetting key index to 0 for the next scheduled run.');
            await writeCurrentKeyIndex(0);
            return;     // no rotation here because of infinite loop, so we exit now but next time it will start from 0
          }

          apiKey = apiKeys[currentKeyIndex];
          await writeCurrentKeyIndex(currentKeyIndex);
          console.log(`➡️ Switched to API Key ${currentKeyIndex + 1}/${apiKeys.length}. Retrying fetch for ${sport.title}...`);
          await delay(1000);          // small delay before retrying with the new key
        } else {
          // this is for other errors (network, etc.), not key exhaustion
          console.error(`An unexpected error occurred fetching odds for ${sport.key}:`, e.message);
          break; // exit the retry loop for this sport and move to the next one
        }
      }
    }

    // -------------------------------Filtering matches------------------------------------

    // First, filter the matches to see what will actually be processed.
    const timeFilteredMatches = matches.filter(
      (match) => new Date(match.commence_time) < oneWeekFromNow
    );
    const fullyFilteredMatches = timeFilteredMatches  // filtering for atleast 2 bookmakers from target list
      .map((match) => {
        const filteredBookmakers = match.bookmakers.filter((bookmaker) =>
          TARGET_BOOKMAKERS.includes(bookmaker.key)
        );
        return { ...match, bookmakers: filteredBookmakers };
      })
      .filter((match) => match.bookmakers.length >= 2); // need at least 2 bookmakers to consider

    // -------------------------------------Storing filtered matches in Match DB----------------------------
    for (const match of fullyFilteredMatches) {
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
      matchesProcessedThisRun++;

      // ---------------------------------- Arbitrage Calculation Logic for filtered matches ------------------------------------

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
      // upto here it finds the best odds available for each outcome from different bookmakers
      const numOutcomes = outcomes.size;
      const outcomeNames = Array.from(outcomes.keys());

      // Check if it's a valid 2-way market (no "Draw" outcome)
      const isTwoWay = numOutcomes === 2 && !outcomeNames.includes('Draw');
      // Check if it's a valid 3-way market (must include home, away, and draw)
      const isThreeWay = numOutcomes === 3 && outcomeNames.includes('Draw') && outcomeNames.includes(match.home_team) && outcomeNames.includes(match.away_team);

      if (!isTwoWay && !isThreeWay) {
        continue; // skip this match if it's not a complete 2-way or 3-way market
      }

      let sumProb = 0;
      outcomes.forEach((info) => (sumProb += 1 / info.best_price));

      if (sumProb < 1) {
        const profit_percentage = (1 / sumProb - 1) * 100;
        const total_stake = 100;
        const total_return = total_stake / sumProb;
        const total_profit_on_100 = total_return - total_stake;

        const bets = Array.from(outcomes.entries()).map(([outcome_name, info]) => {
          const wager_amount = total_return / info.best_price;
          return {
            bookmaker_key: info.bookmaker_key,
            bookmaker_title: info.bookmaker_title,
            outcome_name,
            outcome_price: info.best_price,
            wager_amount: wager_amount,
          };
        });
// pushes into the array and later stored in opportunity db
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

    // progress update after finishing a sport
    io?.emit('status_update', {
      message: `Scanning ${sport.title}...`,
      matchesScanned: totalHistoricalSaved,
    });

    await delay(1000);
  }

  console.log(`Saved/Updated ${totalHistoricalSaved} historical matches.`);
  console.log(`Calculated ${live_opportunities.length} currently live opportunities.`);

  // Marks the opportunities as 'past' if from previous session run and not in current live opportunities
  const liveMatchIds = live_opportunities.map((opp) => opp.match_id);
  await Opportunity.updateMany(
    { status: 'live', match_id: { $nin: liveMatchIds } },
    { $set: { status: 'past' } }
  );
// ------------------------------- Storing live opportunities in opportunity DB ------------------------------------

  for (const opp of live_opportunities) {
    await Opportunity.findOneAndUpdate(
      { match_id: opp.match_id },
      { ...opp, status: 'live' }, // set status to 'live'
      { upsert: true, new: true }
    );
  }
  console.log(`Upserted ${live_opportunities.length} live opportunities.`);

  const cronExpression = '0 * * * *';    // runs at the start of every hour
  let nextRunTimestamp = null;
  try {
    const interval = cronParser.parseExpression(cronExpression);
    nextRunTimestamp = interval.next().toDate();
  } catch (err) {
    console.error("Could not parse cron expression:", err.message);
  }
// -------------------------------- Broadcasting results to all----------------------------------------------
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
