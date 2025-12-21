# Port Configuration Guide

## Standard Port Assignment

This project uses the following consistent port configuration:

### **Backend (NestJS)**
- **Port**: `4000`
- **URL**: `http://localhost:4000`
- **Environment Variable**: `PORT=4000`
- **Configuration File**: `backend/.env`

### **Frontend (Next.js)**
- **Port**: `3000` 
- **URL**: `http://localhost:3000`
- **Environment Variable**: `PORT=3000`
- **Configuration File**: `frontend/.env`

### **Backend API Base URL (Frontend)**
- **Environment Variable**: `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
- **Configuration File**: `frontend/.env`
- **Used by**: Frontend API calls to backend

## Environment Files

### Backend `.env` Configuration
```env
# Backend Server Port
PORT=4000

# Node Environment
NODE_ENV=development

# CORS Origins (Frontend URL)
FRONTEND_URL=http://localhost:3000

# API Keys
GOOGLE_AI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ethical_shopping
```

### Frontend `.env` Configuration
```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Frontend Port
PORT=3000

# Node Environment
NODE_ENV=development
```

## Configuration Files

### 1. Backend Port (`backend/src/main.ts`)
```typescript
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
await app.listen(port);
```

### 2. Frontend API Base URL (`frontend/src/lib/env.ts`)
```typescript
NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
```

### 3. Frontend Port (Next.js)
- Default: 3000 (Next.js default)
- Override: Set `PORT=3000` in `frontend/.env`

## Running the Application

### Start Backend (Port 4000)
```bash
cd backend
npm run start:dev
# Server runs on http://localhost:4000
```

### Start Frontend (Port 3000)
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## API Endpoints

All backend API endpoints are accessed via:
- Base URL: `http://localhost:4000/api`
- Examples:
  - Health Check: `http://localhost:4000/api/health`
  - Live Stats: `http://localhost:4000/api/live-stats`
  - Analyze Product: `http://localhost:4000/api/analyze`
  - Get Alternatives: `http://localhost:4000/api/alternatives`

## CORS Configuration

Backend CORS is configured to allow requests from frontend:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

## Production Configuration

For production deployment, update environment variables:

### Backend Production
```env
PORT=4000  # Or your production port
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Production  
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api-domain.com
NODE_ENV=production
```

## Troubleshooting

### Port Already in Use
If port 4000 or 3000 is already in use:

**Windows:**
```powershell
# Find process using port
netstat -ano | findstr :4000

# Kill process
Stop-Process -Id <PID> -Force
```

**Linux/Mac:**
```bash
# Find process
lsof -i :4000

# Kill process
kill -9 <PID>
```

### Cannot Connect to Backend
1. Verify backend is running: `http://localhost:4000/api/health`
2. Check `.env` files exist with correct values
3. Ensure `NEXT_PUBLIC_API_BASE_URL` is set correctly in frontend `.env`
4. Restart both servers after changing `.env` files

## Key Files to Check

1. **Backend Port**:
   - `backend/.env` → `PORT=4000`
   - `backend/src/main.ts` → Port configuration

2. **Frontend API URL**:
   - `frontend/.env` → `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
   - `frontend/src/lib/env.ts` → Default fallback value

3. **CORS Configuration**:
   - `backend/src/main.ts` → CORS origin settings

## Quick Verification

After starting both servers, verify:
```bash
# Backend health check
curl http://localhost:4000/api/health

# Frontend accessibility
curl http://localhost:3000

# Live stats endpoint
curl http://localhost:4000/api/live-stats
```

All endpoints should return successful responses indicating proper configuration.
