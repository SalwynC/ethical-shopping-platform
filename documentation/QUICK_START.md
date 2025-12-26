# 🚀 Quick Start Guide - Port Configuration

This project uses **consistent, long-lasting port configuration** across all environments.

## Port Assignment

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Frontend** | `3000` | http://localhost:3000 | Next.js application (User Interface) |
| **Backend** | `4000` | http://localhost:4000 | NestJS API server (Business Logic) |

---

## 🎯 One-Command Startup

### Windows (PowerShell)
```powershell
.\start.ps1
```

This script will:
1. ✅ Check if ports 3000 & 4000 are available
2. 🧹 Clean up any processes using those ports
3. 🔧 Start backend on port 4000
4. 🎨 Start frontend on port 3000
5. 🌐 Open browser to http://localhost:3000

---

## 📝 Environment Configuration

### Backend Configuration (`backend/.env`)
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GOOGLE_AI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ethical_shopping
```

### Frontend Configuration (`frontend/.env`)
```env
PORT=3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NODE_ENV=development
```

---

## 🔧 Manual Startup

### Start Backend (Terminal 1)
```bash
cd backend
npm run start:dev
```
✅ Backend runs on: http://localhost:4000

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Frontend runs on: http://localhost:3000

---

## 🌐 API Endpoints

All API requests go through port **4000**:

| Endpoint | URL | Method |
|----------|-----|--------|
| Health Check | http://localhost:4000/api/health | GET |
| Live Stats | http://localhost:4000/api/live-stats | GET |
| Analyze Product | http://localhost:4000/api/analyze | POST |
| Get Alternatives | http://localhost:4000/api/alternatives | GET |
| Price Prediction | http://localhost:4000/api/predict | POST |
| History | http://localhost:4000/api/history | GET |

---

## 🔍 Verify Configuration

### Check if ports are correct:
```powershell
# Backend
curl http://localhost:4000/api/health

# Frontend
curl http://localhost:3000
```

Both should return successful responses ✅

---

## 🛠 Troubleshooting

### Port Already in Use

**Check what's using the port:**
```powershell
netstat -ano | findstr :4000
netstat -ano | findstr :3000
```

**Kill the process:**
```powershell
# Find PID from above command, then:
Stop-Process -Id <PID> -Force
```

**Or use the startup script** - it automatically handles this!

### Cannot Connect to Backend

1. **Verify backend is running:**
   ```bash
   curl http://localhost:4000/api/health
   ```

2. **Check environment files exist:**
   - `backend/.env` → Must have `PORT=4000`
   - `frontend/.env` → Must have `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`

3. **Restart both servers** after any `.env` changes

---

## 📦 Configuration Files Reference

| File | Purpose |
|------|---------|
| `backend/.env` | Backend port and API keys |
| `frontend/.env` | Frontend port and backend URL |
| `backend/src/main.ts` | Backend port configuration code |
| `frontend/src/lib/env.ts` | Frontend API URL defaults |
| `port-config.json` | Machine-readable config reference |
| `PORT_CONFIGURATION.md` | Detailed configuration guide |
| `start.ps1` | Automated startup script |

---

## 🚀 Production Deployment

For production, update environment variables:

### Backend Production
```env
PORT=4000  # Or cloud provider port
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

### Frontend Production
```env
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NODE_ENV=production
```

---

## ✅ Key Points

1. **Backend always runs on port 4000** - This is configured in `backend/.env`
2. **Frontend always runs on port 3000** - This is Next.js default
3. **Frontend calls backend at** `http://localhost:4000` - Set via `NEXT_PUBLIC_API_BASE_URL`
4. **Use `start.ps1`** for easiest startup - Handles everything automatically
5. **CORS is configured** - Backend accepts requests from frontend URL

---

## 📚 Additional Resources

- Full configuration details: [PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md)
- Machine-readable config: [port-config.json](./port-config.json)
- Test backend: http://localhost:4000/api/health
- Access app: http://localhost:3000

---

**Need help?** Check the troubleshooting section above or refer to the detailed docs in `PORT_CONFIGURATION.md`.
