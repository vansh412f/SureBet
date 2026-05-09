# SureBet — Real-Time Sports Arbitrage Finder

> **Live Demo:** [sure-bet-hazel.vercel.app](https://sure-bet-hazel.vercel.app)

A professional-grade, full-stack MERN application that scans odds across multiple international bookmakers in real time, calculates risk-free arbitrage opportunities, and delivers them to a polished React dashboard via WebSocket streaming.

---

## 📖 The Story Behind SureBet

While exploring sports betting I discovered **arbitrage betting** — a 100% legal, mathematical approach to lock in a guaranteed profit by exploiting odds discrepancies across different bookmakers. Every existing tool charged a subscription fee for this data.

The challenge: could I build the same thing, end-to-end, for free?

SureBet is the result. It handles real-time data ingestion, resilient multi-key API management, mathematical arbitrage calculation, and presents findings in a polished, professional dashboard.

---

## ✨ Key Features

| Feature | Detail |
|---|---|
| **Real-Time WebSocket** | Socket.IO pushes new opportunities the instant they are found — no polling, no refresh |
| **Live & History Views** | Toggle between currently active opportunities and a full historical archive |
| **Stake Calculator** | Every row has a built-in stake input — enter your total stake and all individual bets scale instantly |
| **Bookmaker Deep-Links** | Each bookmaker badge is a direct link to that bookmaker's sports page |
| **Copy to Clipboard** | One-click copy of all bet instructions in a formatted, readable string |
| **Match Countdown** | Each row shows the match start time and a live "in Xh Ym" countdown |
| **Advanced Filtering** | Filter by sport, competition/league, bookmaker, and minimum profit % |
| **Sort & Paginate** | Sort by profit %, match time, or last updated. 20 rows per page |
| **Stats Bar** | Live count of opportunities, best profit %, and average profit % |
| **Multi-Key Rotation** | Automatically rotates to the next API key on 401/429 responses |
| **Data Integrity Filter** | Opportunities with profit > 60% are treated as data errors — never stored in MongoDB or shown in the UI |
| **Reactive UI** | All filter sidebar data (leagues, bookmakers, counts) updates reactively the moment WebSocket data arrives |
| **Responsive Design** | Mobile drawer sidebar, horizontal-scroll sport bar, adaptive table layout |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  React Frontend (Vite)                                       │
│  ┌──────────┐  ┌─────────────┐  ┌───────────────────────┐   │
│  │  Header  │  │ FilterSide  │  │   OpportunityTable    │   │
│  │countdown │  │  bar (reac  │  │  stats bar | rows     │   │
│  │  badge   │  │  tive MUI)  │  │  stake calc | links   │   │
│  └──────────┘  └─────────────┘  └───────────────────────┘   │
│        │              │                   │                  │
│        └──────────────┴───────────────────┘                  │
│                  Zustand Store                               │
│            (opportunities, filters, stats)                   │
│                       │                                      │
│              Socket.IO Client                                │
└──────────────────────────┬───────────────────────────────────┘
                           │  WebSocket  (ws://localhost:5000)
┌──────────────────────────┴───────────────────────────────────┐
│  Node.js / Express Backend                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  arbitrageProcessor.js                                  │ │
│  │  ┌───────────────┐  ┌─────────────────────────────────┐  │ │
│  │  │  API Key      │  │  Arbitrage Engine               │  │ │
│  │  │  Rotator      │  │  (sumProb < 1 test, 60% cap,    │  │ │
│  │  │  (401/429)    │  │   fuzzy 3-way team matching)    │  │ │
│  │  └───────────────┘  └─────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│  node-cron  →  runs every hour  →  broadcasts via Socket.IO  │
└──────────────────────────┬───────────────────────────────────┘
                           │  Mongoose / MongoDB Atlas
                    ┌──────┴───────┐
                    │  Opportunity  │  (live | past, profit_percentage,
                    │  Match        │   sport_category, bets_to_place,
                    └──────────────┘   total_profit_on_100, …)
```

---

## 🧮 How the Arbitrage Calculation Works

For a 2-way or 3-way market, the engine:

1. Finds the **best available price for each outcome** across all supported bookmakers
2. Computes `sumProb = Σ (1 / best_odds_i)`
3. If `sumProb < 1` — an arbitrage exists:
   - `profit_percentage = (1 / sumProb − 1) × 100`
   - `total_return = $100 / sumProb` (guaranteed return on $100 staked)
   - `wager_i = total_return / odds_i` (individual stake per outcome — all wagers sum to exactly $100)
4. Records where `profit_percentage > 60%` are discarded as data errors before being saved

---

## 🛠 Tech Stack

**Backend**
- Node.js + Express
- Socket.IO (real-time bidirectional events)
- Mongoose + MongoDB Atlas
- node-cron (hourly scanning scheduler)
- cron-parser (next-run timestamp for frontend countdown)
- Axios (Odds API HTTP client)

**Frontend**
- React 18 + Vite
- Material UI v5 (MUI)
- Zustand (global state with `persist` middleware)
- Socket.IO Client
- date-fns (date formatting and countdowns)

**Data**
- [The Odds API](https://the-odds-api.com) — odds data across 20+ sports

---

## 📁 Project Structure

```
ARBIT PROFIT/
├── server/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── Opportunity.js           # Schema: match, profit, bets, sport_category
│   │   ├── Match.js                 # Full bookmaker odds history
│   │   └── SystemState.js           # API key rotation index persistence
│   ├── services/
│   │   └── arbitrageProcessor.js    # Core scan engine (key rotation, arb calc, 60% outlier cap)
│   └── server.js                    # Express, Socket.IO, cron scheduler
│
└── client/
    └── src/
        ├── api/
        │   └── socket.js            # Singleton Socket.IO client
        ├── hooks/
        │   ├── useOpportunities.js  # Socket event handlers → Zustand store
        │   └── useCountdown.js      # Reactive countdown (returns "45m 30s" / "1h 02m")
        ├── store/
        │   └── opportunityStore.js  # Zustand store (opportunities, filters, isConnected)
        ├── utils/
        │   └── sportUtils.js        # getSportCat, formatOdd, scaleWager, BOOKMAKER_URLS
        ├── styles/
        │   └── theme.js             # MUI dark theme tokens
        └── components/
            ├── layout/
            │   ├── Header.jsx       # Logo, view toggle, countdown badge, connection dot
            │   └── Footer.jsx       # Brand, feature cards, socials
            ├── filters/
            │   ├── FilterSidebar.jsx  # Reactive leagues/bookmakers/profit filters
            │   └── SportFilterBar.jsx # Horizontal sport category pills with counts
            └── table/
                ├── OpportunityTable.jsx  # Stats bar, sort, paginate
                └── OpportunityRow.jsx    # Stake calc, bookmaker links, copy, countdown
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Free API key from [the-odds-api.com](https://the-odds-api.com)

### 1. Clone
```bash
git clone https://github.com/vansh412f/SureBet.git
cd SureBet
```

### 2. Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/surebet
ODDS_API_KEY=your_api_key_here          # comma-separate multiple keys: key1,key2,key3
FRONTEND_URL=http://localhost:3000
```

```bash
node server.js
# Server runs on http://localhost:5000
# Initial arbitrage scan fires immediately on startup
```

### 3. Frontend
```bash
cd ../client
npm install
```

Create `client/.env`:
```env
VITE_WEBSOCKET_URL=http://localhost:5000
```

```bash
npm run dev
# App runs on http://localhost:3000
```

---

## 🔑 API Key Management

The engine supports **multiple Odds API keys** for uninterrupted 24/7 scanning:

```env
ODDS_API_KEY=key_primary,key_secondary,key_tertiary
```

**Key Rotation** — on a `401` (unauthorised), `422`, or `429` (rate limited) response the engine switches to the next key in the list and retries the current sport immediately. If all keys are exhausted, a **6-hour cooldown** is stored in MongoDB so the next cron tick doesn't immediately hammer the same depleted keys.

---

## 📊 Data Model

### Opportunity
```js
{
  match_id:            String,   // unique, indexed
  sport_key:           String,   // e.g. "soccer_epl"
  sport_category:      String,   // e.g. "Soccer"  (derived from sport_title)
  sport_title:         String,   // e.g. "Soccer - EPL"
  home_team:           String,
  away_team:           String,
  commence_time:       Date,
  profit_percentage:   Number,   // e.g. 2.34  (%)
  total_profit_on_100: Number,   // e.g. 2.34  ($ profit on a $100 stake)
  bets_to_place: [{
    bookmaker_key:   String,
    bookmaker_title: String,
    outcome_name:    String,   // "Arsenal", "Draw", "Chelsea"
    outcome_price:   Number,   // decimal odds
    wager_amount:    Number,   // $ stake on a $100 base
  }],
  last_updated:  Date,
  status:        "live" | "past",
}
```

---

## 🧰 Utility Reference (`sportUtils.js`)

| Export | Purpose |
|---|---|
| `getSportCat(op)` | Returns sport category ("Soccer") — falls back to splitting `sport_title` for legacy records |
| `formatOdd(price)` | Formats decimal odds to 2dp — `"2.10"` |
| `scaleWager(wager, stake)` | Scales a $100-base wager to any stake — `scaleWager(48.02, 250)` → `"120.05"` |
| `filterOpportunities(opps, mode, filters)` | Single centralised filter predicate used by table, sidebar, and store |
| `BOOKMAKER_URLS` | Map of bookmaker key → homepage URL (20+ bookmakers) |
| `getBookmakerUrl(key)` | Returns direct URL or `null` if not mapped |

---

## 🐛 Bugs Fixed in This Release

| # | Component | Bug | Fix |
|---|---|---|---|
| 1 | `FilterSidebar` | Leagues/bookmakers not reactive — never updated when data loaded | Rewrote to subscribe to raw Zustand state + `useMemo` |
| 2 | `OpportunityRow` | Profit dollar label showed `profit_%` instead of actual dollar value | Added `total_profit_on_100` to schema; row now uses it |
| 3 | `Header` | `useOpportunities` called twice — double socket listeners | Hook called once in `App.jsx`; Header reads store |
| 4 | `Header` | Countdown used a stale, hardcoded timestamp | Uses `stats.nextRunTimestamp` computed from real cron schedule |
| 5 | `opportunityStore` | Leagues filter compared `sport_title` (wrong) | Leagues use `sport_title`; sport bar uses `sport_category` |
| 6 | `FilterSidebar` | `useMemo` missing `filters.sport` in deps | Added `filters.sport` to dependency array |
| 7 | `opportunityStore` | Stale closure in `updateFilter` default arg | Reads `get().viewMode` inside the setter |
| 8 | `useOpportunities` | `isConnected` was a non-reactive snapshot | Driven by real `connect`/`disconnect` socket events |
| 9 | `arbitrageProcessor` | Credit Safety Brake described in README but not implemented | Reads `x-requests-remaining` header after every request |
| 10 | `server.js` | `nextRunTimestamp` was `null` on initial connect | Computed from `cron-parser` and sent with initial payload |
| 11 | `main.jsx` + `App.jsx` | `<CssBaseline />` rendered twice | Removed from `main.jsx`, kept in `App.jsx` only |
| 12 | `Match.js` | Duplicate index (schema field + `.index()`) | Removed `unique: true` from field; kept explicit `.index()` |
| 13 | `Opportunity.js` | `sport_key`, `sport_category`, `total_profit_on_100` missing from schema | All three fields added |

---

## 📄 Licence

MIT — free to use, fork, and build upon. Not financial advice. Gamble responsibly.

---

*Built by [Vansh Singh](https://github.com/vansh412f)*
