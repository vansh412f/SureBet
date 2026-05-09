import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSportCat, filterOpportunities } from '../utils/sportUtils';

// BUG-06 fix: maximum time (ms) to wait for new_opportunities before clearing the loading spinner.
// Prevents a permanent spinner if the server emits status_update but then silently fails.
const LOADING_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

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
      // BUG-12 fix: start as false so persisted opportunities are shown immediately on reload
      // instead of a spinner covering them while waiting for the socket.
      isLoading: false,
      isConnected: false,      // reactive connection state
      connectionError: null,
      apiStatus: 'ok',
      _loadingTimeoutId: null, // internal — not persisted

      setOpportunities: (payload) => {
        // Clear any pending loading timeout when we receive data
        const { _loadingTimeoutId } = get();
        if (_loadingTimeoutId) {
          clearTimeout(_loadingTimeoutId);
        }
        set({
          opportunities: payload.opportunities || [],
          stats: payload.stats || { matchesScanned: 0, lastUpdated: null, nextRunTimestamp: null },
          isLoading: false,
          connectionError: null,
          _loadingTimeoutId: null,
          apiStatus: payload.opportunities ? 'ok' : get().apiStatus,
        });
      },

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

      setIsConnected: (value) => set({ isConnected: value }),

      updateStatus: (newStatus) =>
        set((state) => {
          const updatedLiveStatus = { ...state.liveStatus, ...newStatus };
          let isLoading = state.isLoading;
          let _loadingTimeoutId = state._loadingTimeoutId;
          const msgLower = updatedLiveStatus.message.toLowerCase();

          if (msgLower.includes('scanning') || msgLower.includes('initializing') || msgLower.includes('discovering')) {
            isLoading = true;
            // BUG-06 fix: start a safety timeout to clear the spinner if no data arrives
            if (!_loadingTimeoutId) {
              _loadingTimeoutId = setTimeout(() => {
                const s = useOpportunityStore.getState();
                if (s.isLoading) {
                  useOpportunityStore.setState({ isLoading: false, _loadingTimeoutId: null });
                  console.warn('Loading timeout reached — clearing spinner.');
                }
              }, LOADING_TIMEOUT_MS);
            }
          } else if (msgLower.includes('complete') || msgLower.includes('done')) {
            isLoading = false;
          }

          return { liveStatus: updatedLiveStatus, isLoading, _loadingTimeoutId };
        }),

      // BUG-04 fix: always pass explicit viewMode so there's no stale-closure risk
      // (callers pass viewMode; defaults to current store viewMode as fallback)
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

      // BUG-03 fix: delegates to the single centralised filterOpportunities() helper
      getFilteredOpportunities: () => {
        const { opportunities, viewMode, liveFilters, pastFilters } = get();
        const filters = viewMode === 'live' ? liveFilters : pastFilters;
        return filterOpportunities(opportunities, viewMode, filters);
      },

      // Returns unique sport categories: "Soccer", "Basketball", etc. (with null fallback)
      getAvailableSports: () => {
        const { opportunities, viewMode } = get();
        const viewOpps = opportunities.filter((op) => op.status === viewMode);
        const sports = [...new Set(viewOpps.map(op => getSportCat(op)).filter(Boolean))];
        return sports.sort();
      },

      // BUG-03 fix: now uses getSportCat() consistently (was using raw sport_category before)
      getAvailableLeagues: () => {
        const { opportunities, viewMode, liveFilters, pastFilters } = get();
        const filters = viewMode === 'live' ? liveFilters : pastFilters;
        let viewOpps = opportunities.filter((op) => op.status === viewMode);

        if (filters.sport !== 'All') {
          viewOpps = viewOpps.filter((op) => getSportCat(op) === filters.sport);
        }

        const leagues = [...new Set(viewOpps.map((op) => op.sport_title).filter(Boolean))];
        return leagues.sort();
      },

      getAvailableBookmakers: () => {
        const { opportunities, viewMode } = get();
        const viewOpps = opportunities.filter((op) => op.status === viewMode);
        const bookmakers = new Set();
        viewOpps.forEach((op) => {
          op.bets_to_place?.forEach((bet) => bookmakers.add(bet.bookmaker_title));
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
        viewMode: state.viewMode,
        // Note: isConnected and _loadingTimeoutId are intentionally NOT persisted
      }),
    }
  )
);
