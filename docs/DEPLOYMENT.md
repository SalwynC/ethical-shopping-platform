# Deployment Guide - Ethical Shopping Platform

## Current Status ✅

- **GitHub Actions**: CI/CD workflow active (ci.yml with 4 parallel jobs)
- **Code Quality**: ESLint passing, builds successful
- **Database**: PostgreSQL/Supabase configured
- **Frontend Builds**: ✓ Next.js build verified
- **Backend Builds**: ✓ NestJS build verified

## Vercel Deployment Setup

### Step 1: Deploy Backend to Vercel
```bash
# In backend folder, create a Vercel project
vercel --prod

# Or use Vercel dashboard to connect the GitHub repo
```

**Backend Configuration** (vercel.json in backend/):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production",
    "DATABASE_URL": "@database_url",
    "OPENAI_API_KEY": "@openai_api_key",
    "GOOGLE_GEMINI_API_KEY": "@gemini_api_key"
  }
}
```

**Backend Environment Variables** (to set in Vercel):
- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key
- `GOOGLE_GEMINI_API_KEY`: Google Gemini API key

### Step 2: Deploy Frontend to Vercel
```bash
# In root folder
vercel --prod
```

**Frontend Already Configured** (vercel.json in root):
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/.next`
- Framework: Next.js
- API Rewrites: All `/api/*` requests proxy to backend
- CORS Headers: Configured for cross-origin requests
- Environment: `NEXT_PUBLIC_BACKEND_URL` set to backend deployment URL

### Step 3: Update Environment Variables

**After deploying backend**, update the frontend's vercel.json:
```json
"env": {
  "NEXT_PUBLIC_BACKEND_URL": "https://your-backend.vercel.app"
}
```

Then redeploy frontend with the updated environment variable.

## GitHub Integration

### Connect Repository to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Select `ethical-shopping-platform` repository
5. Vercel will auto-detect Next.js configuration
6. Deploy

### Auto-Deployment
Once connected:
- Every push to `main` branch triggers automatic deployment
- Pull requests get preview deployments
- Deployment status shown in GitHub checks

## CI/CD Pipeline

### GitHub Actions (ci.yml)
Runs on every push to `main`:
1. **build-frontend** - Builds Next.js app
2. **build-backend** - Builds NestJS API + generates Prisma Client
3. **lint** - Runs ESLint on frontend code
4. **status** - Reports overall build status

### Database Migrations
⚠️ **Important**: Prisma migrations are NOT run in CI/CD (safer approach)

**To migrate database locally**:
```bash
cd backend
npx prisma db push
```

**To migrate in production**:
1. Run migration locally first
2. Verify schema is correct
3. Push to GitHub
4. Vercel backend deployment will have updated schema

## Security

### Known Issues
- **2 high vulnerabilities** in @nestjs/cli (transitive glob dependency)
- Status: Awaiting @nestjs/cli patch for glob ^11.0.4
- Impact: Dev dependency only, not in production build
- Workaround: Using `npm ci --omit=dev` in CI/CD

### Frontend
- ✓ 0 vulnerabilities
- Updated with latest security patches

## Monitoring & Logs

### View Deployment Logs
- **Vercel**: Dashboard → Deployments → View Logs
- **GitHub Actions**: Repository → Actions tab → Click workflow run

### Check Application Status
- **Frontend**: `https://your-frontend.vercel.app`
- **Backend**: `https://your-backend.vercel.app/health` (if health check endpoint exists)
- **Database**: Check Supabase dashboard for connection status

## Rollback

If deployment fails:
1. Vercel auto-keeps 50 previous deployments
2. Go to Vercel dashboard → Deployments
3. Click "Promote to Production" on previous stable version
4. OR push a fix to GitHub and re-deploy

## Performance

### Current Optimizations
- Frontend: Next.js image optimization, code splitting, dynamic imports
- Backend: NestJS micro-services, caching strategies
- Database: Indexed queries, connection pooling (Supabase)

### Next Steps
- Set up Vercel Analytics for frontend performance monitoring
- Configure Vercel KV for Redis caching (optional)
- Set up error tracking (Sentry, etc.)

## Troubleshooting

### Build Fails on Vercel
1. Check GitHub Actions - does it pass locally?
2. Verify environment variables are set in Vercel
3. Check Vercel logs for specific error
4. Try running build command locally: `npm run build`

### API Calls Not Working
1. Verify `NEXT_PUBLIC_BACKEND_URL` environment variable is set
2. Check backend is deployed and running
3. Review CORS headers in vercel.json
4. Check browser console for specific error message

### Database Connection Issues
1. Verify `DATABASE_URL` environment variable is correct
2. Check Supabase connection limits (max connections)
3. Review Prisma Client generation logs
4. Test connection: `npx prisma db execute --stdin < query.sql`

## Quick Deploy Commands

```bash
# Deploy everything
vercel --prod

# Deploy specific workspace
cd frontend && vercel --prod

# View logs
vercel logs

# Check status
vercel status
```

## Resources
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Supabase Docs](https://supabase.com/docs)
