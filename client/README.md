# SureBet Hub - Sports Arbitrage Tracking Application

A modern, real-time React application for tracking sports arbitrage opportunities with advanced filtering and sorting capabilities.

## 🚀 Features

- **Real-time Data**: Live WebSocket connection to backend for instant updates
- **Advanced Filtering**: Multi-level filtering by sport, league, bookmaker, and profit percentage
- **Dynamic Sports Bar**: Auto-generated sport categories with opportunity counts
- **Responsive Design**: Modern dark theme inspired by oddsjam.com
- **Sophisticated Table**: Sortable columns, pagination, and detailed opportunity information
- **Professional UI**: Built with Material-UI components and custom styling

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Styling**: Styled-Components + Emotion
- **State Management**: Zustand
- **Real-time Communication**: Socket.io-client
- **Icons**: Material-UI Icons

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

### Quick Start

```bash
# Create the project
npm create vite@latest client -- --template react
cd client

# Install dependencies
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install styled-components
npm install zustand
npm install socket.io-client

# Start development server
npm run dev
```

### Project Structure

```
client/src/
├── api/
│   └── socket.js              # WebSocket configuration
├── components/
│   ├── filters/
│   │   ├── FilterSidebar.js   # Advanced filtering panel
│   │   └── SportFilterBar.js  # Dynamic sports filter
│   ├── layout/
│   │   └── Header.js          # Application header
│   └── table/
│       ├── OpportunityTable.js # Main data table
│       └── OpportunityRow.js   # Individual opportunity display
├── hooks/
│   └── useOpportunities.js    # WebSocket connection hook
├── store/
│   └── opportunityStore.js    # Zustand global state
├── styles/
│   └── theme.js              # MUI custom theme
├── App.js                    # Main application component
└── main.jsx                  # Entry point
```

## 🎨 Design System

### Color Palette
- **Background**: Very dark grey (`#1A202C`)
- **Content Background**: Slightly lighter dark grey (`#2D3748`)
- **Primary Text**: Light grey (`#E2E8F0`)
- **Accent/Profit**: Bright green (`#48BB78`)
- **Interactive Elements**: Bright blue (`#4299E1`)

### Key Components

#### Header
- Live connection status
- Opportunity count
- Settings and refresh actions

#### Sport Filter Bar
- Dynamic sport categories
- Opportunity count per sport
- Active filter indicators

#### Filter Sidebar
- Collapsible sections
- Search functionality for leagues/bookmakers
- Profit percentage slider
- Quick filter buttons

#### Opportunity Table
- Sortable columns
- Pagination (50 rows per page)
- Hover effects
- Favorite functionality
- Color-coded profit percentages

## 🔌 Backend Integration

The application expects a WebSocket server running on `http://localhost:5000` with the following events:

### Incoming Events
- `new_opportunities`: Array of opportunity objects
- `opportunity_update`: Single updated opportunity
- `opportunity_removed`: ID of removed opportunity

### Outgoing Events  
- `request_opportunities`: Request initial data

### Expected Data Format

```javascript
{
  id: "unique_id",
  sport: "Soccer",
  league: "Premier League", 
  match: "Team A vs Team B",
  bookmaker1: {
    "Bookmaker Name": {
      odds: "2.10",
      market: "1X2"
    }
  },
  bookmaker2: {
    "Another Bookmaker": {
      odds: "1.95", 
      market: "1X2"
    }
  },
  profit: 5.25,
  stakes: {
    stake1: 100,
    stake2: 107.69,
    totalReturn: 210
  },
  lastUpdated: "2024-01-15T10:30:00Z"
}
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🔧 Configuration

### Vite Configuration
- Proxy setup for WebSocket connections
- Optimized chunk splitting
- Source maps for debugging

### Environment Variables
Create a `.env` file for configuration:

```env
VITE_WEBSOCKET_URL=http://localhost:5000
VITE_APP_TITLE=SureBet Hub
```

## 📱 Responsive Design

The application is fully responsive with:
- Desktop-first design approach
- Collapsible sidebar for mobile
- Touch-friendly controls
- Optimized table scrolling

## 🎯 Performance Optimizations

- **Code Splitting**: Vendor chunks separated
- **Memoization**: React.memo and useMemo for expensive calculations
- **Virtual Scrolling**: Pagination to handle large datasets
- **Debounced Search**: Smooth filtering experience
- **WebSocket Optimization**: Efficient connection management

## 🔒 Security Considerations

- WebSocket connection with reconnection logic
- Input validation on all filters
- XSS protection through React's built-in escaping
- CORS configuration for production deployment

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Build the project
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up WebSocket proxy if needed

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments for implementation details