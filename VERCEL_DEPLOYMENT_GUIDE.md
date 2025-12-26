# 🚀 Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

Your project is **100% ready** for Vercel deployment:

- ✅ All CI/CD tests passing
- ✅ Frontend builds successfully (Next.js)
- ✅ Backend builds successfully (NestJS)
- ✅ Vercel configurations in place
- ✅ Git repository clean and up-to-date

---

## 📦 What's Already Configured

### Root `vercel.json` (Frontend)
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "framework": "nextjs",
  "outputDirectory": "frontend/.next"
}
```

### Backend `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nestjs"
}
```

---

## 🌐 Deployment Methods

### Method 1: GitHub Integration (Recommended)

1. **Connect Repository to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select `SalwynC/ethical-shopping-platform`
   - Vercel will auto-detect Next.js configuration

2. **Frontend Deployment:**
   - **Root Directory:** `frontend/`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

3. **Backend Deployment:**
   - Create a separate Vercel project for backend
   - **Root Directory:** `backend/`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install && npx prisma generate`

### Method 2: Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy Frontend (from root)
cd frontend
vercel --prod

# Deploy Backend (from root)
cd backend
vercel --prod
```

---

## 🔐 Environment Variables

### Frontend Environment Variables (Vercel Dashboard)

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.vercel.app
NODE_ENV=production
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend Environment Variables (Vercel Dashboard)

```env
DATABASE_URL=your_supabase_postgres_connection_string
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
PORT=3001

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Additional AI Services
HUGGINGFACE_API_KEY=your_hf_key (optional - free tier available)
```

---

## 📝 Step-by-Step Deployment

### Step 1: Deploy Backend First

```bash
# Navigate to backend
cd backend

# Install dependencies (if needed)
npm install

# Generate Prisma Client
npx prisma generate

# Test build locally
npm run build

# Deploy to Vercel
vercel --prod
```

**Note down the backend URL:** `https://your-backend.vercel.app`

### Step 2: Update Frontend Config

Update [frontend/src/lib/env.ts](frontend/src/lib/env.ts) or add environment variable:

```typescript
NEXT_PUBLIC_BACKEND_URL=https://your-backend.vercel.app
```

### Step 3: Deploy Frontend

```bash
# Navigate to frontend
cd frontend

# Test build locally
npm run build

# Deploy to Vercel
vercel --prod
```

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS in Backend

Edit [backend/src/main.ts](backend/src/main.ts):

```typescript
app.enableCors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
});
```

### 2. Update API Rewrites

Update root [vercel.json](vercel.json):

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.vercel.app/api/:path*"
    }
  ]
}
```

### 3. Database Migration

```bash
# Run Prisma migrations on production
npx prisma migrate deploy --schema=backend/prisma/schema.prisma

# Seed database (optional)
npm run seed
```

---

## 🧪 Testing Deployment

### Frontend Health Check
```bash
curl https://your-frontend.vercel.app
```

### Backend Health Check
```bash
curl https://your-backend.vercel.app/api/health
```

### Test Analysis Endpoint
```bash
curl -X POST https://your-backend.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://amazon.com/sample-product"}'
```

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Problem:** Frontend build fails with "Cannot find module 'next/font/google'"

**Solution:** ✅ Already fixed! We removed Google Fonts and use system fonts now.

**Problem:** Backend build fails with Prisma errors

**Solution:** Ensure `postinstall` script in `backend/package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Issues

**Problem:** Backend can't connect to database

**Solution:** 
1. Check `DATABASE_URL` environment variable in Vercel dashboard
2. Ensure Supabase connection pooling is enabled
3. Use `?pgbouncer=true` in connection string if needed

### API Routes Not Working

**Problem:** Frontend can't reach backend API

**Solution:**
1. Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
2. Check CORS configuration in backend
3. Ensure API routes are deployed (check Vercel Functions tab)

---

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable in Vercel dashboard → Project → Analytics
- Track page views, performance, and Web Vitals

### Error Tracking
- View deployment logs: `vercel logs <deployment-url>`
- Check Vercel dashboard for runtime errors

### Performance
- Check Lighthouse scores in Vercel dashboard
- Monitor API response times

---

## 🔄 Continuous Deployment

**Auto-Deploy on Git Push:**

Vercel automatically deploys when you push to `main` branch:

```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

Vercel will:
1. Detect the push
2. Build both frontend and backend
3. Run tests (via GitHub Actions)
4. Deploy if tests pass
5. Update production URL

---

## 💡 Pro Tips

1. **Preview Deployments:** Every PR gets a unique preview URL
2. **Environment Branches:** Set different env vars for staging/production
3. **Custom Domains:** Add your domain in Vercel → Settings → Domains
4. **Edge Functions:** Use Vercel Edge for faster API responses
5. **Caching:** Vercel automatically caches static assets

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Frontend loads at your Vercel URL
- ✅ Backend API responds to health checks
- ✅ You can paste a product URL and get analysis
- ✅ Dark mode toggle works
- ✅ No console errors in browser
- ✅ Database queries work
- ✅ AI analysis returns results

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **NestJS Deployment:** https://docs.nestjs.com/deployment

**Your project is ready to deploy! 🚀**

---

## 🔗 Quick Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Project Repository](https://github.com/SalwynC/ethical-shopping-platform)
- [CI/CD Status](https://github.com/SalwynC/ethical-shopping-platform/actions)
- [Deployment Docs](docs/DEPLOYMENT.md)

---

*Last Updated: December 26, 2025*
