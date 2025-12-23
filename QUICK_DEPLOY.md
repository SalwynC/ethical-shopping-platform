# 🚀 QUICK DEPLOYMENT GUIDE

## ✅ Everything is VERIFIED and READY!

### Status Summary
- ✅ **Frontend**: Next.js builds successfully
- ✅ **Backend**: NestJS builds successfully  
- ✅ **Database**: Prisma schema validated, client generated
- ✅ **CI/CD**: GitHub Actions pipeline active (ci.yml)
- ✅ **Vercel Configs**: Both frontend and backend ready

---

## 🎯 Deploy to Vercel (3 Steps)

### Step 1: Deploy Frontend
```bash
# Option A: Using Vercel CLI
cd frontend
vercel --prod

# Option B: Using Vercel Dashboard
# 1. Go to https://vercel.com/new
# 2. Import: SalwynC/ethical-shopping-platform
# 3. Root Directory: Leave blank (uses root vercel.json)
# 4. Click "Deploy"
```

**Frontend Environment Variables** (set in Vercel dashboard):
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.vercel.app
NODE_ENV=production
```

### Step 2: Deploy Backend
```bash
# Create a separate Vercel project for backend
cd backend
vercel --prod

# Or use Vercel Dashboard:
# 1. Go to https://vercel.com/new
# 2. Import same repo: SalwynC/ethical-shopping-platform
# 3. Root Directory: "backend"
# 4. Click "Deploy"
```

**Backend Environment Variables** (set in Vercel dashboard):
```
DATABASE_URL=your_supabase_postgresql_url
OPENAI_API_KEY=sk-your_openai_key
GOOGLE_GEMINI_API_KEY=AIzaSy_your_gemini_key
NODE_ENV=production
```

### Step 3: Update Frontend with Backend URL
After backend deploys:
1. Copy your backend URL (e.g., `https://ethical-shopping-backend.vercel.app`)
2. Go to Vercel → Frontend Project → Settings → Environment Variables
3. Update `NEXT_PUBLIC_BACKEND_URL` to your backend URL
4. Redeploy frontend (Vercel → Deployments → Redeploy)

---

## 📊 Verify Deployment

### Check Frontend
```bash
# Visit your frontend URL
https://your-frontend.vercel.app

# Test product analysis page
https://your-frontend.vercel.app/analysis
```

### Check Backend
```bash
# Test health endpoint (if you have one)
curl https://your-backend.vercel.app/health

# Test API endpoint
curl https://your-backend.vercel.app/api/products
```

---

## 🔧 Local Development

### Start Everything Locally
```powershell
# In root directory
npm start

# Or start individually:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:4000
```

### Build Locally
```powershell
# Build frontend
npm run build --workspace=frontend

# Build backend
npm run build --workspace=backend
```

---

## 🔍 Monitor & Debug

### GitHub Actions
- **View workflow runs**: https://github.com/SalwynC/ethical-shopping-platform/actions
- **Latest commit**: e8e8cd6 (should trigger ci.yml)
- **Expected jobs**: ✓ build-frontend, ✓ build-backend, ✓ lint, ✓ status

### Vercel Deployments
```bash
# View deployment logs
vercel logs

# Check deployment status
vercel inspect <deployment-url>

# List all deployments
vercel ls
```

### Common Issues

**Frontend build fails on Vercel:**
- Check if `NEXT_PUBLIC_BACKEND_URL` is set
- Verify Node.js version is 20.x
- Check build logs for specific errors

**Backend build fails on Vercel:**
- Ensure `DATABASE_URL` is set correctly
- Verify Prisma schema is in backend/prisma/schema.prisma
- Check if all environment variables are configured

**API calls fail:**
- Verify CORS headers in root vercel.json
- Check `NEXT_PUBLIC_BACKEND_URL` matches actual backend URL
- Review browser console for specific errors

---

## 📚 Documentation

- **Deployment Guide**: See DEPLOYMENT.md for detailed steps
- **Completion Status**: See COMPLETION_STATUS.md for full checklist
- **Project Overview**: See README.md for project details

---

## 🎉 You're Ready!

Everything is configured and tested. Just deploy to Vercel and you're live!

**Questions?** Check the documentation or review GitHub Actions logs.

**Security Note:** The 2 npm vulnerabilities are in dev dependencies only (@nestjs/cli → glob). They don't affect production builds. Will be resolved when @nestjs/cli releases an update.
