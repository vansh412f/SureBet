import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// handling all the states here via zustand store
export const useOpportunityStore = create(
  persist(
    (set, get) => ({
      opportunities: [],                     //array of all arbitrage opportunities
      stats: {
        matchesScanned: 0,
        lastUpdated: null,
        nextRunTimestamp: null,
      },
      liveStatus: {
        message: 'Initializing...',
        activeSportsCount: 0,
        matchesScanned: 0,
      },
      liveFilters: {
        sport: 'All',
        leagues: [],
        bookmakers: [],
        minProfit: 0,
      },
      pastFilters: {
        sport: 'All',
        leagues: [],
        bookmakers: [],
        minProfit: 0,
      },
      viewMode: 'live', // 'live' or 'past'
      isLoading: true,
      connectionError: null,
      apiStatus: 'ok', // 'ok' or 'limit_reached'

      setOpportunities: (payload) =>
        set({
          opportunities: payload.opportunities || [],
          stats: payload.stats || { matchesScanned: 0, lastUpdated: null, nextRunTimestamp: null },
          isLoading: false,
          connectionError: null,
          apiStatus: payload.opportunities ? 'ok' : get().apiStatus, // Only reset to 'ok' if valid data received
        }),

      setConnectionError: (error) =>
        set({
          connectionError: error,
          isLoading: false,
          apiStatus: 'ok', // Reset apiStatus to avoid conflicts with connection error
        }),

      setApiStatus: (status) =>
        set({
          apiStatus: status,
          connectionError: status === 'limit_reached' ? null : get().connectionError,
          isLoading: status === 'limit_reached' ? false : get().isLoading,
        }),

      updateStatus: (newStatus) =>
        set((state) => {
          const updatedLiveStatus = {
            ...state.liveStatus,
            ...newStatus,
          };
          let isLoading = state.isLoading;
          const messageLower = updatedLiveStatus.message.toLowerCase();
          if (messageLower.includes('scanning') || messageLower.includes('initializing')) {
            isLoading = true;
          } else if (messageLower.includes('complete') || messageLower.includes('done')) {
            isLoading = false;
          }
          return {
            liveStatus: updatedLiveStatus,
            isLoading,
          };
        }),

      updateFilter: (filterKey, value, viewMode = get().viewMode) =>
        set((state) => ({
          [`${viewMode}Filters`]: {
            ...state[`${viewMode}Filters`],
            [filterKey]: value,
          },
        })),

      resetFilters: (viewMode = get().viewMode) =>
        set({
          [`${viewMode}Filters`]: {
            sport: 'All',
            leagues: [],
            bookmakers: [],
            minProfit: 0,
          },
        }),

      setViewMode: (mode) => set({ viewMode: mode }),

      getFilteredOpportunities: () => {
        const { opportunities, viewMode, liveFilters, pastFilters } = get();
        const filters = viewMode === 'live' ? liveFilters : pastFilters;
        const viewOpportunities = opportunities.filter(op => op.status === viewMode);

        return viewOpportunities.filter((op) => {
          if (filters.sport !== 'All' && op.sport_title !== filters.sport) return false;
          if (filters.leagues.length > 0 && !filters.leagues.includes(op.sport_title)) return false;

          if (filters.bookmakers.length > 0) {
            const hasMatchingBookmaker = op.bets_to_place.some((bet) =>
              filters.bookmakers.includes(bet.bookmaker_title)
            );
            if (!hasMatchingBookmaker) return false;
          }

          if (op.profit_percentage < filters.minProfit) return false;

          return true;
        });
      },

      getAvailableSports: () => {
        const { opportunities, viewMode } = get();
        const viewOpportunities = opportunities.filter(op => op.status === viewMode);
        const sports = [...new Set(viewOpportunities.map((op) => op.sport_title))];
        return sports.sort();
      },

      getAvailableLeagues: () => {
        const { opportunities, viewMode, liveFilters, pastFilters } = get();
        const filters = viewMode === 'live' ? liveFilters : pastFilters;
        const viewOpportunities = opportunities.filter(op => op.status === viewMode);
        let filteredOpps = viewOpportunities;

        if (filters.sport !== 'All') {
          filteredOpps = viewOpportunities.filter((op) => op.sport_title === filters.sport);
        }

        const leagues = [...new Set(filteredOpps.map((op) => op.sport_title))];
        return leagues.sort();
      },

      getAvailableBookmakers: () => {
        const { opportunities, viewMode } = get();
        const viewOpportunities = opportunities.filter(op => op.status === viewMode);
        const bookmakers = new Set();
        viewOpportunities.forEach((op) => {
          op.bets_to_place.forEach((bet) => bookmakers.add(bet.bookmaker_title));
        });
        return [...bookmakers].sort();
      },

      getCurrentFilters: () => {
        const { viewMode, liveFilters, pastFilters } = get();
        return viewMode === 'live' ? liveFilters : pastFilters;
      },
    }),
    {
      name: 'opportunity-store',
      partialize: (state) => ({
        apiStatus: state.apiStatus,
        liveStatus: state.liveStatus,
        stats: state.stats,
        opportunities: state.opportunities,
        liveFilters: state.liveFilters,
        pastFilters: state.pastFilters,
      }),
    }
  )
);
