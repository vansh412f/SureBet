// /src/store/opportunityStore.js
import { create } from 'zustand';

export const useOpportunityStore = create((set, get) => ({
  // State
  opportunities: [],
  filters: {
    sport: 'All',
    leagues: [],
    bookmakers: [],
    minProfit: 0,
  },
  isLoading: true,
  connectionError: null, 

  // Actions
  setOpportunities: (opportunities) =>
    set({ opportunities, isLoading: false, connectionError: null }),

   setConnectionError: (error) => 
    set({ connectionError: error, isLoading: false }),

  updateFilter: (filterKey, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [filterKey]: value,
      },
    })),

  // Reset filters
  resetFilters: () =>
    set({
      filters: {
        sport: 'All',
        leagues: [],
        bookmakers: [],
        minProfit: 0,
      },
    }),

  // Computed getters
  getFilteredOpportunities: () => {
    const { opportunities, filters } = get();
    
    return opportunities.filter((opp) => {
      // Sport filter
      if (filters.sport !== 'All' && opp.sport !== filters.sport) {
        return false;
      }

      // Leagues filter
      if (filters.leagues.length > 0 && !filters.leagues.includes(opp.league)) {
        return false;
      }

      // Bookmakers filter
      if (filters.bookmakers.length > 0) {
        const oppBookmakers = [
          ...Object.keys(opp.bookmaker1 || {}),
          ...Object.keys(opp.bookmaker2 || {}),
        ];
        const hasMatchingBookmaker = filters.bookmakers.some(bookmaker =>
          oppBookmakers.includes(bookmaker)
        );
        if (!hasMatchingBookmaker) {
          return false;
        }
      }

      // Profit filter
      if (opp.profit < filters.minProfit) {
        return false;
      }

      return true;
    });
  },

  // Helper methods for dynamic filter options
  getAvailableSports: () => {
    const { opportunities } = get();
    const sports = [...new Set(opportunities.map(opp => opp.sport))];
    return sports.sort();
  },

  getAvailableLeagues: () => {
    const { opportunities, filters } = get();
    let filteredOpps = opportunities;
    
    // Filter by sport first if selected
    if (filters.sport !== 'All') {
      filteredOpps = opportunities.filter(opp => opp.sport === filters.sport);
    }
    
    const leagues = [...new Set(filteredOpps.map(opp => opp.league))];
    return leagues.sort();
  },

  getAvailableBookmakers: () => {
    const { opportunities, filters } = get();
    let filteredOpps = opportunities;
    
    // Filter by sport and leagues first if selected
    if (filters.sport !== 'All') {
      filteredOpps = filteredOpps.filter(opp => opp.sport === filters.sport);
    }
    
    if (filters.leagues.length > 0) {
      filteredOpps = filteredOpps.filter(opp => filters.leagues.includes(opp.league));
    }
    
    const bookmakers = new Set();
    filteredOpps.forEach(opp => {
      if (opp.bookmaker1) {
        Object.keys(opp.bookmaker1).forEach(bm => bookmakers.add(bm));
      }
      if (opp.bookmaker2) {
        Object.keys(opp.bookmaker2).forEach(bm => bookmakers.add(bm));
      }
    });
    
    return [...bookmakers].sort();
  },
}));