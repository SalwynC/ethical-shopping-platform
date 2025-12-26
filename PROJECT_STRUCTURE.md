# 📁 Project Structure

**Ethical Shopping Platform** - Clean and organized folder structure

---

## 🗂️ Directory Layout

```
ethical-shopping-platform/
├── 📂 backend/                    # NestJS backend application
│   ├── prisma/                    # Database schema & migrations
│   │   ├── schema.prisma
│   │   └── SUPABASE_SCHEMA.sql
│   ├── src/                       # Backend source code
│   │   ├── services/              # Business logic services
│   │   ├── database/              # Database services
│   │   └── ...
│   ├── dist/                      # Compiled output (gitignored)
│   └── package.json
│
├── 📂 frontend/                   # Next.js frontend application
│   ├── src/                       # Frontend source code
│   │   ├── app/                   # Next.js App Router pages
│   │   ├── components/            # React components
│   │   ├── lib/                   # Utility functions
│   │   └── ...
│   ├── public/                    # Static assets
│   ├── .next/                     # Next.js build output (gitignored)
│   ├── next.config.ts             # Next.js configuration
│   ├── tailwind.config.ts         # Tailwind CSS configuration
│   ├── postcss.config.mjs         # PostCSS configuration
│   └── package.json
│
├── 📂 services/                   # Microservices
│   ├── ai-service/                # Python AI service
│   ├── alternatives-service/      # Product alternatives service
│   ├── metrics-service/           # Analytics service
│   ├── price-predictor/           # Price prediction service
│   ├── privacy-service/           # Privacy compliance service
│   ├── rule-engine/               # Business rules engine
│   └── scraper/                   # Web scraping service
│
├── 📂 documentation/               # Project documentation
│   ├── INDEX.md                   # Documentation index
│   ├── VERCEL_DEPLOYMENT_GUIDE.md # Deployment guide
│   ├── PROJECT_STATUS.md          # Current project status
│   ├── IMPLEMENTATION_STATUS.md   # Feature implementation status
│   ├── TROUBLESHOOTING.md         # Common issues & solutions
│   └── ... (40+ documentation files)
│
├── 📂 scripts/                    # Utility scripts
│   ├── deploy-vercel.ps1          # Vercel deployment script
│   ├── start-all.ps1              # Start all services
│   └── start-dev.ps1              # Start development mode
│
├── 📂 .github/                    # GitHub configuration
│   └── workflows/                 # CI/CD workflows
│       └── ci.yml                 # Build & test workflow
│
├── 📄 README.md                   # Project overview
├── 📄 package.json                # Root workspace config
├── 📄 vercel.json                 # Vercel deployment config
├── 📄 eslint.config.mjs           # ESLint configuration
├── 📄 tsconfig.json               # TypeScript configuration
└── 📄 .gitignore                  # Git ignore rules
```

---

## 📦 Key Folders Explained

### `/backend` - Backend Application
- **Technology:** NestJS 11, TypeScript
- **Purpose:** API server, business logic, database operations
- **Port:** 4000 (development)
- **Key Files:**
  - `src/main.ts` - Application entry point
  - `src/app.module.ts` - Root module
  - `prisma/schema.prisma` - Database schema

### `/frontend` - Frontend Application
- **Technology:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Purpose:** User interface, client-side logic
- **Port:** 3000 (development)
- **Key Files:**
  - `src/app/page.tsx` - Homepage
  - `src/app/layout.tsx` - Root layout
  - `next.config.ts` - Next.js configuration

### `/services` - Microservices
- **Purpose:** Specialized services for specific features
- **Technologies:** Python (AI services), Node.js (rule engine, scraper)
- **Services:**
  - AI Service (Gemini, ChatGPT integration)
  - Price Predictor (ML-based predictions)
  - Scraper (Product data extraction)
  - Alternatives Engine (Alternative product suggestions)
  - Privacy Service (GDPR compliance)

### `/documentation` - Documentation
- **Purpose:** Project documentation, guides, reports
- **Contents:**
  - Setup & configuration guides
  - Deployment instructions
  - Testing & verification reports
  - Troubleshooting guides
  - Project status & completion reports

### `/scripts` - Utility Scripts
- **Purpose:** Automation scripts for common tasks
- **Scripts:**
  - `deploy-vercel.ps1` - Interactive Vercel deployment
  - `start-all.ps1` - Start all services at once
  - `start-dev.ps1` - Start development servers

---

## 🚫 Ignored Files/Folders (.gitignore)

The following are **not tracked** in git:

```
# Dependencies
/node_modules
frontend/node_modules
backend/node_modules

# Build outputs
backend/dist/
frontend/.next/

# Environment files (sensitive)
.env*
backend/.env*
frontend/.env*

# IDE files
.DS_Store
*.log
```

---

## 📝 Configuration Files (Root Level)

| File | Purpose |
|------|---------|
| `package.json` | Workspace configuration (npm workspaces) |
| `package-lock.json` | Dependency lock file |
| `vercel.json` | Vercel deployment settings |
| `eslint.config.mjs` | ESLint linting rules |
| `tsconfig.json` | TypeScript compiler options |
| `tsconfig.build.json` | Build-specific TypeScript config |
| `.prettierrc` | Code formatting rules |
| `.gitignore` | Git ignore patterns |
| `README.md` | Project overview |

---

## 🔄 Workspace Structure

This project uses **npm workspaces** to manage multiple packages:

```json
{
  "workspaces": [
    "frontend",
    "backend",
    "services/*"
  ]
}
```

**Benefits:**
- Shared dependencies
- Unified build commands
- Single lockfile
- Easier dependency management

---

## 📊 Key Statistics

```
Total Folders:        7 main directories
Documentation Files:  40+ guides & reports
Services:            7 microservices
Configuration Files: 10+ configs
Scripts:             3 automation scripts
```

---

## 🎯 Quick Navigation

| What You Need | Where to Find It |
|---------------|------------------|
| **Start the project** | Run `npm run dev` from root |
| **Documentation index** | `documentation/INDEX.md` |
| **Deployment guide** | `documentation/VERCEL_DEPLOYMENT_GUIDE.md` |
| **Project status** | `documentation/PROJECT_STATUS.md` |
| **Troubleshooting** | `documentation/TROUBLESHOOTING.md` |
| **Deploy to Vercel** | Run `scripts/deploy-vercel.ps1` |
| **Frontend code** | `frontend/src/` |
| **Backend code** | `backend/src/` |
| **Database schema** | `backend/prisma/schema.prisma` |

---

## ✨ Recent Changes

**December 27, 2025** - Major reorganization:
- ✅ Moved all documentation to `documentation/` folder
- ✅ Moved frontend configs to `frontend/` folder
- ✅ Moved database schema to `backend/prisma/`
- ✅ Organized scripts in `scripts/` folder
- ✅ Removed empty folders (`infra/`, `config/`)
- ✅ Created documentation index for easy navigation
- ✅ Cleaned up duplicate files

---

**Last Updated:** December 27, 2025  
**Status:** ✅ Clean & Organized  
**Maintainer:** Project Team
