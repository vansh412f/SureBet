/**
 * Derives a high-level sport category from an opportunity object.
 * Handles legacy DB records that pre-date the sport_category field.
 * "Soccer - EPL" → "Soccer" | "Basketball" → "Basketball"
 */
export const getSportCat = (op) => {
  if (op?.sport_category) return op.sport_category;
  if (op?.sport_title) return op.sport_title.split(' - ')[0].trim();
  return 'Other';
};

/** Formats a decimal odd to 2 decimal places, e.g. 2.1 → "2.10" */
export const formatOdd = (price) =>
  typeof price === 'number' ? price.toFixed(2) : String(price ?? '—');

/**
 * Scales a wager_amount (computed against a $100 base stake) to any user stake.
 * e.g. wager_amount=48.02, totalStake=250 → "$120.05"
 */
export const scaleWager = (wager_amount, totalStake) =>
  ((wager_amount / 100) * totalStake).toFixed(2);

/**
 * Direct homepage URLs for each supported bookmaker.
 * Used to let users click through to the bookmaker's site.
 * Key = bookmaker_key returned by The Odds API.
 */
export const BOOKMAKER_URLS = {
  bet365:       'https://www.bet365.com',
  betfair:      'https://www.betfair.com/sport',
  betfair_ex_uk:'https://www.betfair.com/exchange/plus',
  betfair_ex_eu:'https://www.betfair.com/exchange/plus',
  pinnacle:     'https://www.pinnacle.com/en/sport/soccer/matchups',
  williamhill:  'https://sports.williamhill.com',
  unibet:       'https://www.unibet.com/betting/sports',
  unibet_eu:    'https://www.unibet.eu/betting/sports',
  unibet_us:    'https://www.unibet.com/betting/sports',
  '888sport':   'https://www.888sport.com',
  betway:       'https://www.betway.com',
  coral:        'https://sports.coral.co.uk',
  ladbrokes:    'https://sports.ladbrokes.com',
  boylesports:  'https://www.boylesports.com',
  draftkings:   'https://sportsbook.draftkings.com',
  fanduel:      'https://www.fanduel.com/sports',
  betmgm:       'https://sports.betmgm.com',
  caesars:      'https://www.caesars.com/sportsbook-and-casino',
  pointsbetus:  'https://www.pointsbet.com',
  barstool:     'https://www.barstoolsportsbook.com',
  betonlineag:  'https://www.betonline.ag/sportsbook',
  mybookieag:   'https://www.mybookie.ag/sportsbook',
};

/** Returns the direct link for a bookmaker, or null if not mapped. */
export const getBookmakerUrl = (bookmakerKey) =>
  BOOKMAKER_URLS[bookmakerKey] ?? null;
