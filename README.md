SureBet - Live Sports Arbitrage Finder
SureBet is a sophisticated, real-time web application designed to automatically scan, calculate, and display sports arbitrage opportunities from multiple international bookmakers. This MERN stack project leverages a resilient backend engine and a dynamic, fully responsive React frontend to provide users with actionable, risk-free betting insights.

Live Demo: https://sure-bet-hazel.vercel.app/

📖 The Story Behind SureBet
While exploring the world of sports betting, I discovered arbitrage betting—a 100% legal, mathematical approach to guarantee a profit by exploiting odds discrepancies across different bookmakers. I was fascinated by the concept but found that every existing tool or service charged a significant fee to access this information.

This project was born out of a challenge: could I build a professional-grade tool to provide this service for free? I wanted to see if I could engineer a complete, end-to-end system that could handle the complexities of real-time data ingestion, resiliently manage a large pool of resources, and present the findings in a polished, user-friendly interface. SureBet is the result of that challenge.

🚀 Key Features
Real-time Opportunity Updates: A live WebSocket connection pushes new opportunities to the UI instantly.

Live & Historical Views: Toggle between currently active opportunities and a historical archive of past bets.

Advanced Filtering & Sorting: A collapsible sidebar with multi-level filtering by sport, league, bookmaker, and profit percentage.

Dynamic UI: The interface dynamically generates filter options based on the available data for a clean and relevant user experience.

Resilient Backend Engine:

API Key Rotator: Automatically manages a pool of hundreds of API keys, rotating to a new key when a usage limit is reached.

Credit Safety Brake: A self-regulating mechanism that stops data fetching before an API key's credit limit is exceeded, guaranteeing no single run ever fails.

24/7 Scheduled Jobs: Uses node-cron to run the data-scanning process automatically in the background.

Fully Responsive Design: A professional and intuitive layout that works flawlessly on desktop, tablet, and mobile devices.

🛠 Tech Stack
This project is a full-stack MERN application, architected with modern, professional tools.

Frontend: React, Vite, Material-UI (MUI), Zustand, socket.io-client, Framer Motion, Styled-Components

Backend: Node.js, Express.js, Mongoose

Database: MongoDB Atlas

Real-time Communication: Socket.IO

Deployment: Frontend on Vercel, Backend on Render

📦 Installation & Setup
Prerequisites
Node.js (v18 or higher)

npm

A MongoDB Atlas account and a connection string.

At least one API key from The Odds API.

Setup Instructions
Clone the Repository:

Bash

git clone https://github.com/your-username/SureBet.git
cd SureBet
Backend Setup:

Bash

cd server
npm install
Create a .env file in the /server directory and add your variables:

Code snippet

MONGO_URI=your_mongodb_connection_string
ODDS_API_KEY=your_api_key1,your_api_key2,...
FRONTEND_URL=http://localhost:3000
Frontend Setup:

Bash

cd client
npm install
Create a .env file in the /client directory and add your backend URL:

Code snippet

VITE_WEBSOCKET_URL=http://localhost:5000
Running the Application
You will need two terminals to run the full application.

Terminal 1 (Backend):

Bash

cd server
npm run dev
Terminal 2 (Frontend):

Bash

cd client
npm run dev
Open your browser to http://localhost:3000.

⚠️ Disclaimer
This application is for educational and demonstration purposes only. It is a software engineering project and does not constitute financial advice. I do not promote or endorse gambling. Please be aware of and comply with the online betting regulations in your jurisdiction. Bet responsibly.

Due to the nature of free-tier APIs and regional restrictions on betting sites in countries like India, the bookmakers tracked are primarily international.
