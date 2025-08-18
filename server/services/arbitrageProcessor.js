// /services/arbitrageProcessor.js
const axios = require('axios');
const Match = require('../models/Match');
const Opportunity = require('../models/Opportunity');

const TARGET_BOOKMAKERS = ['betway', 'williamhill', 'betfair_sb_uk', 'sport888', 'unibet_uk', 'onexbet'];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const runArbitrageCheck = async (io) => {
  console.log('Starting arbitrage check with live/past status maintenance...');

  const apiKey = process.env.ODDS_API_KEY;
  const sportsUrl = `https://api.the-odds-api.com/v4/sports?apiKey=${apiKey}`;

  try {
    const sportsResponse = await axios.get(sportsUrl);
    const activeSports = sportsResponse.data.filter(
      (sport) => sport.active === true && sport.has_outrights === false
    );
    console.log(`Found ${activeSports.length} active sports`);

    const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    let totalHistoricalSaved = 0;

    // Collect newly found live opportunities here
    const live_opportunities = [];

    for (const sport of activeSports) {
      console.log(`Fetching odds for ${sport.title}...`);

      const oddsUrl = `https://api.the-odds-api.com/v4/sports/${sport.key}/odds?apiKey=${apiKey}&regions=uk,eu`;
      const oddsResponse = await axios.get(oddsUrl);
      const matches = oddsResponse.data;

      const timeFilteredMatches = matches.filter(
        (match) => new Date(match.commence_time) < oneWeekFromNow
      );

      const filteredMatches = timeFilteredMatches
        .map((match) => {
          const filteredBookmakers = match.bookmakers.filter((bookmaker) =>
            TARGET_BOOKMAKERS.includes(bookmaker.key)
          );
          return { ...match, bookmakers: filteredBookmakers };
        })
        .filter((match) => match.bookmakers.length >= 2);

      for (const match of filteredMatches) {
        // --- Persist raw match (historical) data ---
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

        // --- In-memory arbitrage calculation ---
        const outcomes = new Map(); // outcome_name -> { best_price, bookmaker_key, bookmaker_title }
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
        outcomes.forEach((info) => {
          sumProb += 1 / info.best_price;
        });

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

          // Collect the live opportunity (do not upsert yet)
          live_opportunities.push({
            match_id: match.id,
            sport_key: match.sport_key,
            sport_title: match.sport_title,
            home_team: match.home_team,
            away_team: match.away_team,
            // Normalize to Date to be consistent
            commence_time: new Date(match.commence_time),
            profit_percentage,
            total_profit_on_100,
            bets_to_place: bets,
            last_updated: new Date(),
          });
        }
      }

      // Be kind to the API
      await delay(2000);
    }

    console.log(`Saved/Updated ${totalHistoricalSaved} historical matches.`);
    console.log(`Calculated ${live_opportunities.length} currently live opportunities.`);

    // --- NEW STATUS LOGIC ---

    // 1) Build the list of current live match_ids
    const liveMatchIds = live_opportunities.map((opp) => opp.match_id);

    // 2) Mark old opportunities (not in the new live list) as 'past'
    // If no live opportunities found, this will mark all existing as 'past' — desired behavior.
    const pastResult = await Opportunity.updateMany(
      { match_id: { $nin: liveMatchIds } },
      { $set: { status: 'past' } }
    );
    console.log(
      `Marked ${pastResult.modifiedCount ?? pastResult.nModified ?? 0} opportunities as 'past'.`
    );

    // 3) Upsert live opportunities and explicitly set status to 'live'
    for (const opp of live_opportunities) {
      await Opportunity.findOneAndUpdate(
        { match_id: opp.match_id },
        { ...opp, status: 'live' },
        { upsert: true, new: true }
      );
    }
    console.log(`Upserted ${live_opportunities.length} 'live' opportunities.`);

    // Broadcast latest opportunities (both live and past) to clients
    if (io) {
      const opportunities = await Opportunity.find({});
      io.emit('new_opportunities', opportunities);
      console.log('Broadcasted latest opportunities to all clients.');
    }
  } catch (error) {
    console.error('Error in arbitrage processing:', error);
  }
};

module.exports = { runArbitrageCheck };
