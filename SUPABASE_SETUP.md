# Supabase Database Setup Guide

## Current Status
⚠️ **Supabase credentials are invalid/expired.** The app will use in-memory fallback until configured.

## Setup Instructions

### 1. Create Supabase Project (FREE)
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose organization, project name, database password, and region
4. Wait for project to be created (~2 minutes)

### 2. Get Database Connection String
1. Go to **Project Settings** → **Database**
2. Scroll to **Connection String** section
3. Select **URI** tab
4. **IMPORTANT**: Choose **Transaction** mode (not Session mode)
5. Copy the connection string - it should look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
   - Note the port: **6543** (Transaction mode pooler)
   - NOT 5432 (Session pooler - incompatible with Prisma)

### 3. Configure Environment Variables

**For Local Development:**
Edit `backend/.env.local`:
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**For Production (Vercel):**
Add environment variable in Vercel dashboard:
- Variable name: `DATABASE_URL`
- Value: `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`

### 4. Apply Database Migrations
```bash
cd backend
npx prisma db push
npx prisma generate
```

### 5. Verify Connection
Test the database connection:
```bash
npm run seed
```

## Important Notes

### Prisma with Supabase Pooler
- **MUST use Transaction mode** (port 6543)
- Add `?pgbouncer=true` to connection string
- Session mode (port 5432) causes "prepared statement already exists" errors

### Free Tier Limits
- Database: 500 MB
- API requests: Unlimited
- Auth users: Unlimited
- Storage: 1 GB
- Perfect for development and small projects

### Connection Pooling
Supabase uses PgBouncer for connection pooling:
- **Transaction mode** (port 6543): Compatible with Prisma ✅
- **Session mode** (port 5432): NOT compatible with Prisma ❌

## Troubleshooting

### "Tenant or user not found"
- Old/invalid credentials - create new Supabase project
- Wrong project reference in connection string

### "Prepared statement already exists"
- Using Session mode pooler (port 5432)
- Solution: Switch to Transaction mode (port 6543)

### Connection timeout
- Check firewall/network settings
- Verify Supabase project is active (not paused)
- Try different region (closer to your location)

## Alternative: Use In-Memory Database
If Supabase is not needed immediately:
1. Leave `DATABASE_URL=""` empty in .env files
2. App will automatically use in-memory storage (via PrismaService fallback)
3. Data persists only during runtime (resets on restart)
