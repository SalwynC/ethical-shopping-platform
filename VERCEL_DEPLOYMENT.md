# Vercel Deployment Guide

## Quick Deployment Status

### Frontend Deployment
✅ **Ready to deploy** - Next.js app configured for Vercel
- Framework: Next.js 14
- Build command: `npm run build`
- Output directory: `.next`
- PWA enabled with service worker

### Backend Deployment  
✅ **Ready to deploy** - NestJS with serverless handler
- Framework: NestJS
- Entry point: `backend/api/index.ts` (serverless wrapper)
- Build command: `npm run build`
- Output directory: `dist`

## Prerequisites

1. **GitHub Account** - Repository must be pushed to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Supabase Database** (optional) - See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## Deployment Methods

### Method 1: Automatic GitHub Integration (Recommended)

#### Step 1: Import Project to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Connect your GitHub account
3. Import `ethical-shopping-platform` repository
4. Vercel will auto-detect Next.js configuration

#### Step 2: Configure Environment Variables
In Vercel dashboard, add these environment variables:

**For Backend:**
- `DATABASE_URL` - Your Supabase connection string (see SUPABASE_SETUP.md)
  ```
  postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
- `GOOGLE_AI_API_KEY` - Get from [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- `NODE_ENV=production`
- `PORT=4000` (optional, Vercel handles this)

**For Frontend:**
- `NEXT_PUBLIC_BACKEND_URL` - Your backend Vercel URL
  ```
  https://your-backend-project.vercel.app
  ```
- `NODE_ENV=production`

#### Step 3: Deploy
1. Click **Deploy**
2. Wait for build to complete (~2-3 minutes)
3. Visit your deployment URL

### Method 2: GitHub Actions CI/CD

This project includes automated deployment workflows.

#### Setup GitHub Secrets
Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

1. `VERCEL_TOKEN`
   - Get from: Vercel Dashboard → Settings → Tokens
   - Create new token with appropriate permissions

2. `VERCEL_ORG_ID`
   - Get from: Vercel Dashboard → Settings → General
   - Copy your "Organization ID" or "Team ID"

3. `VERCEL_PROJECT_ID` 
   - Get from: Vercel Project Settings → General
   - Copy "Project ID"

#### How It Works
- Push to `main` branch triggers deployment
- Workflow builds frontend and deploys to Vercel
- Success/failure status shows in GitHub Actions tab
- Deployment skips gracefully if secrets not configured

## Environment Variables Summary

### Backend Required
| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | Supabase dashboard (Transaction mode pooler) |
| `GOOGLE_AI_API_KEY` | Gemini AI API key | [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) |

### Backend Optional
| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI fallback | Falls back to Gemini only |
| `SCRAPER_API_KEY` | ScraperAPI for better scraping | Not required |
| `AI_REQUESTS_PER_MINUTE` | Rate limiting | 10 |
| `PORT` | Server port | 4000 |

### Frontend Required
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `https://your-backend.vercel.app` |

## Vercel Configuration Files

### Root `vercel.json`
```json
{
  "framework": "nextjs",
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.vercel.app/api/:path*"
    }
  ]
}
```

### Backend `vercel.json`
```json
{
  "framework": "nestjs",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

## Post-Deployment

### 1. Update Frontend Backend URL
After deploying backend:
1. Copy backend Vercel URL
2. Update frontend environment variable:
   - Vercel Dashboard → Frontend Project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_BACKEND_URL` to backend URL
3. Redeploy frontend

### 2. Update Root vercel.json
Update the API rewrite destination in root `vercel.json`:
```json
"rewrites": [
  {
    "source": "/api/:path*",
    "destination": "https://YOUR-ACTUAL-BACKEND.vercel.app/api/:path*"
  }
]
```

### 3. Test API Endpoints
Visit: `https://your-frontend.vercel.app/api/health`

Should return: `{"status":"ok","timestamp":"..."}`

## Troubleshooting

### Build Fails - "Cannot find module"
- Check `package.json` has all dependencies
- Run `npm install` locally to update `package-lock.json`
- Commit and push changes

### API Calls Fail - CORS Error
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Check backend CORS configuration in `backend/src/main.ts`
- Backend should allow requests from frontend domain

### Database Connection Error
- Verify `DATABASE_URL` is set in backend environment variables
- Use Transaction mode pooler (port 6543, not 5432)
- Add `?pgbouncer=true` to connection string
- Check Supabase project is active

### "Tenant or user not found"
- Supabase credentials are invalid/expired
- Create new Supabase project
- Update `DATABASE_URL` in Vercel environment variables
- See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## Free Tier Limits

### Vercel (Hobby Plan)
- **Bandwidth**: 100 GB/month
- **Build time**: 6,000 minutes/month
- **Deployments**: Unlimited
- **Custom domains**: Yes
- **Serverless functions**: 100 GB-hours

### Supabase (Free Plan)
- **Database**: 500 MB
- **API requests**: Unlimited
- **Storage**: 1 GB
- **Bandwidth**: 2 GB

### Google AI (Gemini)
- **Free tier**: 60 requests/minute
- **Monthly quota**: Varies by model

## Alternative: Manual Deployment

### Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Deploy backend
cd backend
vercel --prod
```

## Monitoring

### Check Deployment Status
- **Vercel Dashboard**: View build logs, deployment history
- **GitHub Actions**: See CI/CD workflow runs
- **Vercel Analytics**: Track performance and errors

### View Logs
- Vercel Dashboard → Project → Deployments → Click deployment → View Logs
- Real-time logs available for debugging

## Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **Database Backups**: Use Supabase daily backups
3. **Domain Setup**: Add custom domain in Vercel settings
4. **Performance**: Enable Vercel Analytics and Speed Insights
5. **Security**: Use environment variables for all sensitive data

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Copy backend URL
3. ✅ Configure frontend `NEXT_PUBLIC_BACKEND_URL`
4. ✅ Deploy frontend to Vercel
5. ✅ Update root `vercel.json` with backend URL
6. ✅ Test API endpoints
7. ✅ Configure custom domain (optional)
8. ✅ Enable analytics and monitoring
