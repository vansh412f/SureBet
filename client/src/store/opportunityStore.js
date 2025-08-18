import { create } from 'zustand';

export const useOpportunityStore = create((set, get) => ({
  // --- State ---
  opportunities: [],
  stats: {
    matchesScanned: 0,
  },
  filters: {
    sport: 'All',
    leagues: [],
    bookmakers: [],
    minProfit: 0,
  },
  viewMode: 'live', // 'live' or 'past'
  isLoading: true,
  connectionError: null,
  apiStatus: 'ok', // 'ok' or 'limit_reached'

  // --- Actions ---
  setOpportunities: (payload) =>
    set({
      opportunities: payload.opportunities || [],
      stats: payload.stats || { matchesScanned: 0 },
      isLoading: false,
      connectionError: null,
      apiStatus: 'ok', // Reset apiStatus to 'ok' on successful data fetch
    }),

  setConnectionError: (error) =>
    set({ connectionError: error, isLoading: false }),

  setApiStatus: (status) => set({ apiStatus: status }),

  updateFilter: (filterKey, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [filterKey]: value,
      },
    })),

  resetFilters: () =>
    set({
      filters: {
        sport: 'All',
        leagues: [],
        bookmakers: [],
        minProfit: 0,
      },
    }),

  setViewMode: (mode) => set({ viewMode: mode }),

  // --- Getters ---

  getFilteredOpportunities: () => {
    const { opportunities, filters, viewMode } = get();

    return opportunities.filter((op) => {
      // View mode filter (status check: 'live' vs 'past')
      if (op.status !== viewMode) {
        return false;
      }

      // Sport filter (uses sport_title)
      if (filters.sport !== 'All' && op.sport_title !== filters.sport) {
        return false;
      }

      // Leagues filter
      if (filters.leagues.length > 0 && !filters.leagues.includes(op.sport_title)) {
        return false;
      }

      // Bookmakers filter
      if (filters.bookmakers.length > 0) {
        const hasMatchingBookmaker = op.bets_to_place.some((bet) =>
          filters.bookmakers.includes(bet.bookmaker_title)
        );
        if (!hasMatchingBookmaker) return false;
      }

      // Profit filter
      if (op.profit_percentage < filters.minProfit) {
        return false;
      }

      return true;
    });
  },

  getAvailableSports: () => {
    const { opportunities } = get();
    const sports = [...new Set(opportunities.map((op) => op.sport_title))];
    return sports.sort();
  },

  getAvailableLeagues: () => {
    const { opportunities, filters } = get();
    let filteredOpps = opportunities;

    if (filters.sport !== 'All') {
      filteredOpps = opportunities.filter((op) => op.sport_title === filters.sport);
    }

    const leagues = [...new Set(filteredOpps.map((op) => op.sport_title))];
    return leagues.sort();
  },

  getAvailableBookmakers: () => {
    const { opportunities } = get();
    const bookmakers = new Set();

    opportunities.forEach((op) => {
      op.bets_to_place.forEach((bet) => bookmakers.add(bet.bookmaker_title));
    });

    return [...bookmakers].sort();
  },
}));