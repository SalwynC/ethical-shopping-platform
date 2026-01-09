# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Status

### GitHub ✅
- [x] Repository: `SalwynC/ethical-shopping-platform`
- [x] Branch: `main` (synced and up to date)
- [x] Working tree: Clean (no uncommitted changes)
- [x] CI/CD workflows: Active and configured

### Supabase ✅
- [x] Database: **CONNECTED** (aws-1-ap-northeast-1.pooler.supabase.com:6543)
- [x] Connection mode: Transaction pooler (pgbouncer)
- [x] Schema: Synced and applied
- [x] Test data: 24 products seeded

### Local Builds ✅
- [x] Backend: Compiled successfully (`backend/dist/src/main.js`)
- [x] Frontend: Compiled successfully (`frontend/.next/BUILD_ID`)
- [x] Tests: All 9/9 passing
- [x] VS Code errors: 0

### GitHub Actions ✅
- [x] CI - Build & Test: Active and passing
- [x] Deploy frontend to Vercel: Active
- [x] Integration Tests: Active

---

## 📋 Deployment Steps

### Step 1: Deploy Backend to Vercel

1. **Create Vercel Project**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select `SalwynC/ethical-shopping-platform`
   - Framework Preset: **Other**
   - Root Directory: `backend`

2. **Configure Build Settings**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `DATABASE_URL` | `postgresql://postgres.ppcytspeyrtgamykqayj:c6kgqIXpq0L54wcS@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Production |
   | `GOOGLE_AI_API_KEY` | `AIzaSyC6wJhXILe3tpXl9UXN1VgfXmZHUgNKk_U` | Production |
   | `NODE_ENV` | `production` | Production |
   | `PORT` | `4000` | Production (optional) |

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - **Save your backend URL**: `https://your-backend-project.vercel.app`

### Step 2: Deploy Frontend to Vercel

1. **Create Another Vercel Project**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Select `SalwynC/ethical-shopping-platform`
   - Framework Preset: **Next.js**
   - Root Directory: `frontend`

2. **Configure Build Settings**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Add Environment Variables**
   
   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `NEXT_PUBLIC_BACKEND_URL` | `https://your-backend-project.vercel.app` (from Step 1) | Production |
   | `NODE_ENV` | `production` | Production |

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Your app is now live! 🎉

### Step 3: Update API Rewrites (Root vercel.json)

1. **Update Root Configuration**
   Edit `vercel.json` in the root directory:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://YOUR-ACTUAL-BACKEND.vercel.app/api/:path*"
       }
     ]
   }
   ```
   Replace with your actual backend URL from Step 1.

2. **Commit and Push**
   ```bash
   git add vercel.json
   git commit -m "chore: update API rewrite with deployed backend URL"
   git push origin main
   ```

3. **Redeploy Frontend**
   - Go to Vercel dashboard → Frontend project
   - Click "Redeploy" to apply the change

---

## 🔐 GitHub Actions Auto-Deploy (Optional)

If you want automatic deployments on every push to `main`:

### Add GitHub Secrets

Go to: `https://github.com/SalwynC/ethical-shopping-platform/settings/secrets/actions`

Add these secrets:

1. **VERCEL_TOKEN**
   - Get from: Vercel Dashboard → Settings → Tokens
   - Click "Create Token"
   - Copy and paste as GitHub secret

2. **VERCEL_ORG_ID**
   - Get from: Vercel Dashboard → Settings → General
   - Copy "Team ID" or "User ID"

3. **VERCEL_PROJECT_ID** (for frontend)
   - Get from: Vercel → Frontend Project → Settings → General
   - Copy "Project ID"

4. **VERCEL_BACKEND_PROJECT_ID** (for backend)
   - Get from: Vercel → Backend Project → Settings → General
   - Copy "Project ID"

After adding secrets, every push to `main` will auto-deploy! ✨

---

## ✅ Post-Deployment Verification

### Test Backend API
```bash
curl https://your-backend.vercel.app/health
```
Expected response:
```json
{"status":"ok","timestamp":"2026-01-09T..."}
```

### Test Frontend
1. Open `https://your-frontend.vercel.app`
2. Try analyzing a product URL
3. Check if data loads from Supabase

### Test Database Connection
- Verify products appear in the frontend
- Check Supabase dashboard for query logs
- Monitor for any connection errors

---

## 🎯 Environment Variables Summary

### Backend (Vercel)
```env
DATABASE_URL=postgresql://postgres.ppcytspeyrtgamykqayj:c6kgqIXpq0L54wcS@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
GOOGLE_AI_API_KEY=AIzaSyC6wJhXILe3tpXl9UXN1VgfXmZHUgNKk_U
NODE_ENV=production
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.vercel.app
NODE_ENV=production
```

### GitHub Secrets (for auto-deploy)
```
VERCEL_TOKEN=<from Vercel account settings>
VERCEL_ORG_ID=<from Vercel team/user settings>
VERCEL_PROJECT_ID=<frontend project ID>
VERCEL_BACKEND_PROJECT_ID=<backend project ID>
```

---

## 📊 Success Criteria

- ✅ Backend deploys without errors
- ✅ Frontend deploys without errors
- ✅ API endpoints return 200 status
- ✅ Database queries work
- ✅ Frontend loads and displays data
- ✅ No CORS errors in browser console
- ✅ GitHub Actions show green checks

---

## 🐛 Troubleshooting

### Backend won't deploy
- Check environment variables are set correctly
- Verify DATABASE_URL uses port 6543 (not 5432)
- Check build logs in Vercel dashboard

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check CORS settings in `backend/src/main.ts`
- Verify API rewrite in root `vercel.json`

### Database connection fails
- Verify Supabase project is active
- Check DATABASE_URL includes `?pgbouncer=true`
- Ensure using Transaction mode pooler (port 6543)

### GitHub Actions not deploying
- Verify all GitHub secrets are added
- Check workflow files in `.github/workflows/`
- Review Actions logs for errors

---

## 📝 Next Steps After Deployment

1. **Custom Domain** (optional)
   - Add custom domain in Vercel dashboard
   - Update DNS records
   - Enable automatic HTTPS

2. **Monitoring**
   - Enable Vercel Analytics
   - Set up error tracking (Sentry)
   - Monitor Supabase usage

3. **Performance**
   - Enable Vercel Speed Insights
   - Check Lighthouse scores
   - Optimize images and assets

4. **Security**
   - Rotate API keys regularly
   - Enable Dependabot alerts
   - Review Supabase RLS policies

---

## ✨ You're All Set!

Everything is configured and ready. Follow the steps above to deploy to Vercel.

**Estimated deployment time**: 10-15 minutes

Good luck! 🚀
