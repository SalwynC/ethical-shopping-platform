Prisma DB Push (GitHub Actions)

This repository includes a workflow to push the Prisma schema to your Supabase PostgreSQL database from GitHub Actions.

How to use

1. Go to your repository on GitHub → Settings → Secrets and variables → Actions → New repository secret.
2. Create a secret named `DATABASE_URL` with the value of your Supabase pooler connection string (use connection pooling / port 6543). Example:

   postgresql://postgres:PostgresEth%21Shop%23DB2200%402025@db.ppcytspeyrtgamykqayj.supabase.co:6543/postgres?pgbouncer=true

3. Trigger the workflow:
   - Go to the Actions tab → `Prisma DB Push` → `Run workflow` (or push to `main`).

4. After the workflow completes, you can run locally:

```powershell
cd backend
npm ci
npx prisma generate
npx prisma studio
```

Notes
- Using GitHub Actions avoids local network/DNS blocks; GitHub runners can reach Supabase.
- Do NOT commit your secrets to the repo.
