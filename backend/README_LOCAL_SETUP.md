Local Backend Run (with or without Supabase)

Purpose:
- Run the backend locally using in-memory fallback if the Supabase connection isn't available.
- Use GitHub Actions to apply Prisma schema to Supabase when your local network blocks DB access.

Steps — Quick (fast):

1) Ensure dependencies installed

```powershell
cd backend
npm ci
```

2) If you have Supabase connection and want DB enabled locally
- Add a `.env.local` in `backend/` (already present in repo template)
- Set `DATABASE_URL` to the pooler connection (port 6543) from Supabase
  Example (URL-encoded password):

DATABASE_URL=postgresql://postgres:PostgresEth%21Shop%23DB2200%402025@db.ppcytspeyrtgamykqayj.supabase.co:6543/postgres?pgbouncer=true

3) Generate Prisma client

```powershell
npx prisma generate
```

4A) Try migrate locally (may fail if your network blocks DB)

```powershell
npx prisma migrate dev --name init_postgres
```

If the migration fails due to network, use the GitHub Actions workflow `Prisma DB Push` (see repo `.github/PRISMA_README.md`) and add `DATABASE_URL` as a repo secret.

4B) Run backend in fallback mode (no DB required)

```powershell
npm run start:dev
```

- The backend will detect missing/placeholder `DATABASE_URL` and use the in-memory fallback store for products, analyses and rules. The `GET /products` endpoint will return fallback records.

5) Test endpoints

- Health: http://localhost:4000/api/health
- Analyze (POST): http://localhost:4000/api/analyze (use frontend UI at http://localhost:3000)
- List products: http://localhost:4000/api/products

Notes:
- Use GitHub Actions to push schema if local network can't reach Supabase.
- Do NOT commit `.env.local` or secrets to GitHub.
