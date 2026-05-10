export const getSportCat = (op) => {
  if (op?.sport_category) return op.sport_category;
  if (op?.sport_title) return op.sport_title.split(' - ')[0].trim();
  return 'Other';
};

export const formatOdd = (price) =>
  typeof price === 'number' ? price.toFixed(2) : String(price ?? '—');

export const scaleWager = (wager_amount, totalStake) =>
  ((wager_amount / 100) * totalStake).toFixed(2);

export const filterOpportunities = (opportunities, viewMode, filters) => {
  const viewOpps = opportunities.filter((op) => op.status === viewMode);
  return viewOpps.filter((op) => {
    if ((op.profit_percentage || 0) > 60) return false;
    if (filters.sport !== 'All' && getSportCat(op) !== filters.sport) return false;
    if (filters.leagues.length > 0 && !filters.leagues.includes(op.sport_title)) return false;
    if (filters.bookmakers.length > 0) {
      const hasMatchingBookmaker = op.bets_to_place?.some((bet) =>
        filters.bookmakers.includes(bet.bookmaker_title)
      );
      if (!hasMatchingBookmaker) return false;
    }
    if (op.profit_percentage < filters.minProfit) return false;
    return true;
  });
};

export const BOOKMAKER_URLS = {
  bet365:        'https://www.bet365.com',
  betfair:       'https://www.betfair.com/sport',
  betfair_ex_uk: 'https://www.betfair.com/exchange/plus',
  betfair_ex_eu: 'https://www.betfair.com/exchange/plus',
  pinnacle:      'https://www.pinnacle.com/en/sport/soccer/matchups',
  williamhill:   'https://sports.williamhill.com',
  unibet:        'https://www.unibet.com/betting/sports',
  unibet_eu:     'https://www.unibet.eu/betting/sports',
  unibet_us:     'https://www.unibet.com/betting/sports',
  '888sport':    'https://www.888sport.com',
  betway:        'https://www.betway.com',
  coral:         'https://sports.coral.co.uk',
  ladbrokes:     'https://sports.ladbrokes.com',
  boylesports:   'https://www.boylesports.com',
  draftkings:    'https://sportsbook.draftkings.com',
  fanduel:       'https://www.fanduel.com/sports',
  betmgm:        'https://sports.betmgm.com',
  caesars:       'https://www.caesars.com/sportsbook-and-casino',
  pointsbetus:   'https://www.pointsbet.com',
  barstool:      'https://www.barstoolsportsbook.com',
  betonlineag:   'https://www.betonline.ag/sportsbook',
  mybookieag:    'https://www.mybookie.ag/sportsbook',
};

export const getBookmakerUrl = (bookmakerKey) =>
  BOOKMAKER_URLS[bookmakerKey] ?? null;
