# 🚀 Quick Start Guide

## Automatic Startup (Recommended)

Just run this single command from the root directory:

```powershell
npm start
```

or

```powershell
npm run dev
```

**That's it!** The script will:
- ✅ Install dependencies if needed
- ✅ Start backend on http://localhost:3001
- ✅ Start frontend on http://localhost:3000
- ✅ Auto-seed database with real data on first run

## What Gets Auto-Seeded

The database automatically populates with:
- **6 Real Products** from Amazon, Flipkart, Myntra
  - boAt Rockerz 450 (₹1,499)
  - Apple AirPods Pro (₹26,499)
  - Samsung Galaxy Buds Pro (₹9,999)
  - Nike Air Max 270 (₹7,495)
  - Canon EOS R6 (₹2,39,999)
  - Xiaomi Mi 11X Pro (₹39,999)

- **6 Analyses** with ethical scores and recommendations
- **12 Savings Records** totaling **₹1,04,455**

## Manual Startup (Alternative)

If you prefer to start servers separately:

### Backend
```powershell
cd backend
npm run start:dev
```

### Frontend
```powershell
cd frontend
npm run dev
```

## First Time Setup

1. **Clone the repository**
   ```powershell
   git clone <your-repo-url>
   cd ethical-shopping-platform
   ```

2. **Configure environment variables**
   - Copy `.env.example` to `.env` in both `backend` and `frontend` folders
   - Add your Supabase credentials to `backend/.env`

3. **Run database migrations** (if not already done)
   ```powershell
   cd backend
   npx prisma migrate deploy
   cd ..
   ```

4. **Start the app**
   ```powershell
   npm start
   ```

## How Auto-Seeding Works

The backend checks if the database is empty on startup:
- If **product count = 0** AND **savings count = 0**, it automatically seeds real data
- No manual `npm run seed` needed
- Safe to run multiple times (only seeds if database is empty)

## URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Live Stats**: http://localhost:3001/api/live-stats

## Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are occupied:
1. Close other apps using those ports
2. Or change ports in `backend/src/main.ts` (backend) and `frontend/package.json` (frontend)

### Database Not Seeding
Check backend logs for:
```
🌱 Database is empty, auto-seeding with real data...
✅ Created 6 products, 6 analyses, 12 savings
```

If you don't see this, manually clear and reseed:
```powershell
cd backend
npm run seed
```

### Dependencies Issues
```powershell
npm run install:all
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: NestJS, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **AI**: Google Gemini Pro

## Features

- 🛡️ Real ethical analysis of products
- 💰 Real savings tracking from actual purchases
- 📊 Live statistics from database
- 🌐 Multi-platform scraping (Amazon, Flipkart, Myntra)
- 🎨 Dark mode support
- 📱 Responsive design

---

**Made with ❤️ for ethical shopping**
