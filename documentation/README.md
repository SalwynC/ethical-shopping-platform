# 🛍️ Ethical Shopping Platform

> Make ethical shopping choices, one click at a time.

![Status](https://img.shields.io/badge/Status-Active-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-v24.12.0-green) ![Next.js](https://img.shields.io/badge/Next.js-14.2-black) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎯 What is This?

An app that helps you shop more ethically. Paste a product URL → Get an ethical score, price analysis, and better alternatives. Simple as that.

---

## ✨ Features

- 🔍 **Instant Analysis** - Paste any URL, get results instantly
- ⭐ **Ethical Scoring** - See the ethics rating of any product (0-100)
- 💰 **Price Fairness** - Check if you're getting a good deal
- 📊 **Review Trust** - Know if reviews are real or fake
- 🌱 **Sustainability Impact** - Understand environmental footprint
- 🎁 **Better Alternatives** - Find ethical product swaps
- 🌙 **Dark Mode** - Eye-friendly shopping at night

---

## 🛠️ Tech Stack

```
Frontend:  Next.js 14 • React 18 • TypeScript • Tailwind CSS
Backend:   NestJS 11 • Node.js • TypeScript
AI:        OpenAI GPT • Google Gemini
Services:  Web Scraping • Price Prediction • Review Analysis
```

---

## 🚀 Quick Start

### Install & Run
```bash
git clone https://github.com/SalwynC/ethical-shopping-platform.git
cd ethical-shopping-platform

npm install
npm run dev
```

**That's it!** 
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### Add API Keys
Create `.env` in root:
```
OPENAI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

---

## 📁 Project Structure

```
ethical-shopping-platform/
├── frontend/          # Next.js app with UI
├── backend/           # NestJS API
├── services/          # Microservices (scraper, AI, etc)
├── database/          # Database schemas
└── docs/              # Documentation
```

---

## 🔌 Main API Routes

```
POST   /api/analyze                  # Analyze a product
POST   /api/comprehensive-analysis   # Deep analysis
GET    /api/alternatives             # Get alternatives
GET    /api/health                   # Server health
```

---

## 💻 Development

### Start Servers
```bash
npm run dev              # Both together (from root)
npm run dev:frontend    # Just frontend
npm run dev:backend     # Just backend

# Or use the startup scripts in /scripts directory
./scripts/start-all.ps1  # PowerShell: Start both services
./scripts/start-dev.ps1  # PowerShell: Start with dev config
```

### Build & Deploy
```bash
npm run build           # Build everything
npm run start:prod      # Run production
```

### Running Tests
```bash
npm run test            # Run all tests
# Test scripts located in /tests directory
```

### Tests
```bash
npm test               # Run all tests
npm run test:e2e       # E2E tests
npm run lint           # Check code quality
```

---

## 📊 Status

✅ **Everything Working**
- Backend ✓ Healthy
- Frontend ✓ Running
- APIs ✓ Operational
- TypeScript ✓ No errors

---

## 🤝 Want to Contribute?

1. Fork the repo
2. Create your branch: `git checkout -b feature/cool-thing`
3. Make changes & test
4. Commit: `git commit -m "add: cool feature"`
5. Push & create PR

---

## 📝 License

MIT - Use freely!

---

## 👋 Questions?

- 📧 Email: 11d24salwynchrist@gmail.com
- 🐙 GitHub: [@SalwynC](https://github.com/SalwynC)
- 🌐 Repo: [ethical-shopping-platform](https://github.com/SalwynC/ethical-shopping-platform)

---

**Last Updated**: Dec 19, 2025 ✨
