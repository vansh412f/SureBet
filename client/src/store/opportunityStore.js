import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSportCat } from '../utils/sportUtils';

export const useOpportunityStore = create(
  persist(
    (set, get) => ({
      opportunities: [],
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
      viewMode: 'live',
      isLoading: true,
      isConnected: false,      // reactive connection state (Bug 10)
      connectionError: null,
      apiStatus: 'ok',

      setOpportunities: (payload) =>
        set({
          opportunities: payload.opportunities || [],
          stats: payload.stats || { matchesScanned: 0, lastUpdated: null, nextRunTimestamp: null },
          isLoading: false,
          connectionError: null,
          apiStatus: payload.opportunities ? 'ok' : get().apiStatus,
        }),

      setConnectionError: (error) =>
        set({
          connectionError: error,
          isLoading: false,
          apiStatus: 'ok',
        }),

      setApiStatus: (status) =>
        set({
          apiStatus: status,
          connectionError: status === 'limit_reached' ? null : get().connectionError,
          isLoading: status === 'limit_reached' ? false : get().isLoading,
        }),

      // Reactive connection status (Bug 10)
      setIsConnected: (value) => set({ isConnected: value }),

      updateStatus: (newStatus) =>
        set((state) => {
          const updatedLiveStatus = { ...state.liveStatus, ...newStatus };
          let isLoading = state.isLoading;
          const msgLower = updatedLiveStatus.message.toLowerCase();
          if (msgLower.includes('scanning') || msgLower.includes('initializing') || msgLower.includes('discovering')) {
            isLoading = true;
          } else if (msgLower.includes('complete') || msgLower.includes('done')) {
            isLoading = false;
          }
          return { liveStatus: updatedLiveStatus, isLoading };
        }),

      // Bug 15 fix: read viewMode fresh via get() so there's no stale-closure risk
      updateFilter: (filterKey, value, viewMode) =>
        set((state) => {
          const mode = viewMode || get().viewMode;
          return {
            [`${mode}Filters`]: {
              ...state[`${mode}Filters`],
              [filterKey]: value,
            },
          };
        }),

      resetFilters: (viewMode) =>
        set(() => {
          const mode = viewMode || get().viewMode;
          return {
            [`${mode}Filters`]: {
              sport: 'All',
              leagues: [],
              bookmakers: [],
              minProfit: 0,
            },
          };
        }),

      setViewMode: (mode) => set({ viewMode: mode }),

      getFilteredOpportunities: () => {
        const { opportunities, viewMode, liveFilters, pastFilters } = get();
        const filters = viewMode === 'live' ? liveFilters : pastFilters;
        const viewOpportunities = opportunities.filter((op) => op.status === viewMode);

        return viewOpportunities.filter((op) => {
          // Permanent cap: discard records above 60% (matches backend MAX_ARBIT_PROFIT)
          if ((op.profit_percentage || 0) > 60) return false;

          // Sport filter — use getSportCat for null sport_category fallback
          if (filters.sport !== 'All' && getSportCat(op) !== filters.sport) return false;

          // Leagues filter — match against sport_title (e.g. "Soccer - EPL")
          if (filters.leagues.length > 0 && !filters.leagues.includes(op.sport_title)) return false;

          // Bookmakers filter
          if (filters.bookmakers.length > 0) {
            const hasMatchingBookmaker = op.bets_to_place?.some((bet) =>
              filters.bookmakers.includes(bet.bookmaker_title)
            );
            if (!hasMatchingBookmaker) return false;
          }

          // Minimum profit filter
          if (op.profit_percentage < filters.minProfit) return false;

          return true;
        });
      },

      // Returns unique sport categories: "Soccer", "Basketball", etc. (with null fallback)
      getAvailableSports: () => {
        const { opportunities, viewMode } = get();
        const viewOpps = opportunities.filter((op) => op.status === viewMode);
        const sports = [...new Set(viewOpps.map(op => getSportCat(op)).filter(Boolean))];
        return sports.sort();
      },

      // Returns unique sport_titles within the selected sport category: "Soccer - EPL", etc.
      getAvailableLeagues: () => {
        const { opportunities, viewMode, liveFilters, pastFilters } = get();
        const filters = viewMode === 'live' ? liveFilters : pastFilters;
        let viewOpps = opportunities.filter((op) => op.status === viewMode);

        if (filters.sport !== 'All') {
          viewOpps = viewOpps.filter((op) => op.sport_category === filters.sport);
        }

        const leagues = [...new Set(viewOpps.map((op) => op.sport_title).filter(Boolean))];
        return leagues.sort();
      },

      getAvailableBookmakers: () => {
        const { opportunities, viewMode } = get();
        const viewOpps = opportunities.filter((op) => op.status === viewMode);
        const bookmakers = new Set();
        viewOpps.forEach((op) => {
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
        // Note: isConnected is intentionally NOT persisted — it must reflect true socket state on load
      }),
    }
  )
);
