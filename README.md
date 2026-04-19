# 🪙 Platinum Network - Crypto Mining Platform

**A full-stack cryptocurrency mining simulator with reward system, referrals, and admin panel.**

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Admin Access](#admin-access)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Roadmap](#roadmap)

---

## ✨ Features

### 🎯 Core Features (Phase 1 - COMPLETED)
- ✅ **Mining System** - 12-hour base mining with 24-hour boost via ads
- ✅ **Daily Rewards** - 3 ads per day (15, 25, 40 PNRP = 80 PNRP daily)
- ✅ **Daily Check-in** - 7-day streak system with increasing rewards
- ✅ **Referral Program** - 10% commission on referral mining
- ✅ **Social Tasks** - Earn PNRP by completing social media tasks
- ✅ **Leaderboard** - Global ranking system for top miners
- ✅ **Wallet** - Balance tracking, transaction history, Send/Receive/Swap (TGE-locked)
- ✅ **Notification System** - Real-time updates with navigation
- ✅ **Admin Panel** - Platform statistics and management
- ✅ **7-Phase Roadmap** - Complete development roadmap (37 items)
- ✅ **Legal Pages** - Terms, Privacy Policy, Disclaimer

### 🔐 Security
- JWT authentication
- Password hashing with bcrypt
- Auto-logout after 7 days of inactivity
- Admin role-based access control

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **FastAPI** - Python web framework
- **aiomysql** - Async MySQL driver
- **PyJWT** - JWT authentication
- **bcrypt** - Password hashing

### Database
- **MySQL (MariaDB)** - Relational database

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and Yarn
- Python 3.11+
- MySQL/MariaDB
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd platinum-network
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
yarn install
```

### 4. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE platinum_network;
USE platinum_network;

# Import schema
source MYSQL_TABLE_SCHEMAS.sql;
```

---

## ⚙️ Environment Setup

### Backend `.env` (Create in `/backend/.env`)
```env
# Database
MONGO_URL=mysql://root:your_password@localhost:3306/platinum_network
DB_NAME=platinum_network

# JWT Secret
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# CORS (for development)
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

### Frontend `.env` (Create in `/frontend/.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

**Note:** For production, update `REACT_APP_BACKEND_URL` to your live backend URL.

---

## 🚀 Running the Application

### Development Mode

**1. Start Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**2. Start Frontend:**
```bash
cd frontend
yarn start
```

**3. Access Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

### Production Mode

**Backend:**
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
```

**Frontend:**
```bash
yarn build
# Serve the build folder with nginx or any static server
```

---

## 👑 Admin Access

### Create Admin User
```bash
mysql -u root -p platinum_network

UPDATE users SET is_admin = 1 WHERE email = 'your@email.com';
```

### Admin Panel Features
- Total Users count
- Total Mining PNRP distributed
- Total PNRP distributed (all sources)
- Active mining sessions
- Platform status monitoring

**Access:** http://localhost:3000/admin (requires admin login)

---

## 📁 Project Structure

```
platinum-network/
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   └── Layout.js      # Main layout with navigation
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.js   # Main dashboard
│   │   │   ├── Wallet.js      # Wallet page
│   │   │   ├── Referrals.js   # Referral system
│   │   │   ├── Leaderboard.js # Rankings
│   │   │   ├── Profile.js     # User profile
│   │   │   ├── SocialTasks.js # Social tasks
│   │   │   ├── AdminPanel.js  # Admin dashboard
│   │   │   ├── Roadmap.js     # Development roadmap
│   │   │   ├── Terms.js       # Terms & Conditions
│   │   │   ├── Privacy.js     # Privacy Policy
│   │   │   └── Disclaimer.js  # Disclaimer
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   ├── package.json           # Node dependencies
│   └── .env                   # Environment variables
└── MYSQL_TABLE_SCHEMAS.sql    # Database schema
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Mining
- `POST /api/mining/start` - Start mining session
- `POST /api/mining/claim` - Claim mining rewards
- `GET /api/mining/status` - Check mining status

### Daily Rewards
- `GET /api/daily-reward/status` - Get daily reward status
- `POST /api/daily-reward/watch-ad` - Claim daily reward (3 per day)

### Daily Check-in
- `GET /api/daily-checkin/status` - Get check-in status
- `POST /api/daily-checkin/claim` - Claim daily check-in

### Wallet
- `GET /api/wallet` - Get wallet balance and transactions

### Referrals
- `GET /api/referrals` - Get referral stats

### Leaderboard
- `GET /api/leaderboard` - Get top miners

### Admin (Protected)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users list

---

## 🗺️ Roadmap

### ✅ Phase 1: Platform Launch & Core Features (COMPLETED)
- Mining system, Daily rewards, Referrals, Tasks, Leaderboard, Wallet, Notifications, Admin panel

### ⏳ Phase 2: Testnet Wallet Test & Feature Implementation
- Testnet wallet, Send/Receive testing, Swap testing, Security audit

### ⏳ Phase 3: KYC & Other Features
- KYC integration, Admin KYC approval, Document storage, Community features

### ⏳ Phase 4: Token Conversion & Other Features
- PNRP conversion, Auto-conversion, Conversion history, Rate alerts

### ⏳ Phase 5: TGE & Token Launch
- Smart contract audit, Liquidity pool, Mainnet wallet, Exchange listings

### ⏳ Phase 6: Mobile Expansion
- PWA support, iOS app, Push notifications, Enhanced mobile mining

### 🚀 Phase 7: Ecosystem Growth (Future)
- Exchange listings, Staking (12% APY), NFT marketplace, DeFi integration

---

## 📊 Daily Reward System

**3 Ads Per Day:**
1. **1st Ad:** 15 PNRP
2. **2nd Ad:** 25 PNRP
3. **3rd Ad:** 40 PNRP

**Total Daily Potential:** 80 PNRP

**Display:** Shows X/3 format (0/3 → 1/3 → 2/3 → 3/3)

---

## 🧪 Test Credentials

**Regular User:**
- Email: `mysqltest1@example.com`
- Password: `test1234`

**Admin Access:**
- Same credentials (set `is_admin = 1` in database)

---

## 📝 License

©2025 Platinum Network. All rights reserved.

---

## 🤝 Support

For issues or questions, contact: support@platinumnetwork.com

---

## 🎯 Key Features Breakdown

### Mining System
- **Duration:** 12 hours base, 24 hours with boost
- **Reward:** Variable based on level and multipliers
- **Boost:** Watch 10-second ad for extended session

### Reward Systems
- **Daily Ads:** 3 ads = 80 PNRP maximum per day
- **Daily Check-in:** 7-day streak with increasing rewards
- **Referrals:** 10% lifetime commission on referral earnings
- **Social Tasks:** One-time rewards for platform promotion

### Security Features
- **Auto-logout:** After 7 days of inactivity
- **JWT Authentication:** Secure token-based auth
- **Password Hashing:** Bcrypt encryption
- **Role-based Access:** Admin and user roles

---

**Made with ❤️ by Platinum Network Team**
