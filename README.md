# 🛍️ Ethical Shopping Platform - EthiShop

> **Making ethical shopping accessible, transparent, and intelligent for every consumer.**

![GitHub](https://img.shields.io/badge/GitHub-SalwynC-blue?logo=github)
![Node.js](https://img.shields.io/badge/Node.js-v24.12.0-green?logo=node.js)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11.0-red?logo=nestjs)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Running the Project](#-running-the-project)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Ethical Shopping Platform** (EthiShop) is a comprehensive web application that empowers consumers to make informed, ethical purchasing decisions in real-time. By analyzing product data, pricing trends, sustainability metrics, and review authenticity, the platform provides transparent ethical scores and actionable insights.

### Problem Statement
Consumers today struggle with:
- ❌ Hidden product supply chain practices
- ❌ Unclear sustainability metrics
- ❌ Manipulated or fake reviews
- ❌ Unfair pricing models
- ❌ Lack of ethical alternatives

### Our Solution
✅ Real-time ethical analysis of any product URL
✅ AI-powered sustainability scoring
✅ Review authenticity verification
✅ Intelligent price comparison across platforms
✅ Ethical alternative product recommendations
✅ Privacy-first data handling

---

## ✨ Features

### 🏠 Homepage
- **Live Product Analysis**: Paste any product URL and get instant analysis
- **Interactive Dashboard**: Real-time animated score displays
- **Dynamic Examples**: Product cards update based on analysis results
- **Smooth Animations**: Framer Motion transitions for enhanced UX
- **Dark Mode Support**: Complete dark/light theme switching
- **PWA Ready**: Offline capability and installable on mobile

### 📊 Analysis Results
- **Ethical Score**: Comprehensive ethics rating (0-100)
- **Price Fairness**: Market comparison and deal detection
- **Sustainability Impact**: Environmental & social metrics
- **Review Trust Analysis**: Authenticity verification & sentiment analysis
- **Trust Score**: Overall data reliability assessment
- **Alternative Products**: Ethically superior suggestions

### 📈 Reports & Tracking
- **Analysis History**: Track all previous product analyses
- **Comparison Reports**: Compare products side-by-side
- **Trend Tracking**: Monitor price and rating changes over time
- **Export Reports**: Generate PDF/CSV reports for sharing

### 🔐 Privacy & Compliance
- **Consent Management**: GDPR-compliant consent workflow
- **Data Minimization**: Only collect necessary data
- **Transparent Processing**: Clear data usage policies
- **User Privacy**: End-to-end encrypted communications

---

## 🛠️ Tech Stack

### Frontend
```
- Next.js 14.2 (React 18)
- TypeScript 5
- Tailwind CSS 3
- Framer Motion (Animations)
- React Query (Data fetching)
- Zustand (State management)
- PWA Support (Offline capability)
```

### Backend
```
- NestJS 11
- Node.js v24.12.0
- TypeScript 5
- Prisma ORM
- MongoDB / In-Memory Storage
```

### AI & Services
```
- OpenAI GPT API (Analysis & insights)
- Google Gemini API (Fallback AI)
- Web Scraping (Cheerio)
- Price Prediction (ML models)
- Review Analysis (NLP)
```

### DevOps & Tools
```
- Docker (Containerization)
- Git/GitHub (Version control)
- ESLint & Prettier (Code quality)
- Jest (Testing)
- npm Workspaces (Monorepo)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v24.12.0 or higher
- npm 10.x or higher
- Git
- Modern web browser

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/SalwynC/ethical-shopping-platform.git
cd ethical-shopping-platform
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
```bash
# Create .env file in root
cp .env.example .env

# Add your API keys:
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
MONGODB_URI=your_mongodb_uri (optional)
```

4. **Start the Project**
```bash
# Option 1: Start both servers together
npm run dev

# Option 2: Start individually
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:4000
```

---

## 📁 Project Structure

```
ethical-shopping-platform/
│
├── frontend/                          # Next.js 14 PWA Application
│   ├── src/
│   │   ├── app/                      # App Router (pages, layouts)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── analysis/             # Analysis pages
│   │   │   ├── reports/              # Reports view
│   │   │   ├── api/                  # API routes
│   │   │   └── providers.tsx         # Global providers
│   │   ├── components/               # React components
│   │   │   ├── analysis/             # Analysis components
│   │   │   ├── dynamic/              # Interactive components
│   │   │   ├── layout/               # Layout components
│   │   │   └── forms/                # Form components
│   │   ├── lib/                      # Utility functions
│   │   │   ├── api.ts                # API client
│   │   │   ├── real-analytics.ts     # Analytics tracking
│   │   │   └── animations.ts         # Animation utilities
│   │   ├── types/                    # TypeScript types
│   │   ├── styles/                   # Global styles
│   │   └── contexts/                 # React contexts
│   ├── public/                       # Static assets
│   ├── .next/                        # Build output
│   └── package.json
│
├── backend/                          # NestJS API Gateway
│   ├── src/
│   │   ├── main.ts                   # Entry point
│   │   ├── app.module.ts             # Root module
│   │   ├── app.controller.ts         # Main controller
│   │   ├── services/                 # Business logic
│   │   │   ├── ai.service.ts
│   │   │   ├── scraper.service.ts
│   │   │   ├── free-api.service.ts
│   │   │   └── app.service.ts
│   │   ├── database/
│   │   │   └── prisma.service.ts     # Database service
│   │   └── schemas/                  # Data schemas
│   ├── test/                         # E2E tests
│   ├── dist/                         # Compiled output
│   └── package.json
│
├── services/                         # Microservices
│   ├── scraper/                      # Web scraping service
│   ├── ai-service/                   # AI processing
│   ├── price-predictor/              # Price forecasting
│   ├── rule-engine/                  # Ethics rule evaluation
│   └── alternatives-service/         # Alternative products
│
├── database/                         # Database schemas & migrations
│   └── migrations/                   # DB migrations
│
├── docs/                             # Documentation
│   ├── README.md                     # Setup guide
│   ├── IMPLEMENTATION_STATUS.md      # Status report
│   ├── PRD_SUMMARY.md                # Product requirements
│   └── QUICK_START.md                # Quick start guide
│
├── package.json                      # Root package config
├── tsconfig.json                     # TypeScript config
├── eslint.config.mjs                 # ESLint config
├── tailwind.config.ts                # Tailwind config
└── next.config.ts                    # Next.js config
```

---

## 🔌 API Endpoints

### Health & Status
```
GET /api/health                  # Server health check
GET /api/metrics                 # System metrics
GET /api/analytics/insights      # Analytics insights
```

### Product Analysis
```
POST /api/analyze                # Analyze product URL
POST /api/comprehensive-analysis # Detailed multi-step analysis
GET  /api/history                # Get analysis history
GET  /api/history/stats          # Get statistics
```

### Recommendations
```
GET  /api/alternatives           # Get alternative products
GET  /api/rules                   # Get ethics rules
POST /api/predict                # Predict prices
```

### Privacy & Consent
```
POST /api/consent                # Manage user consent
GET  /api/privacy                # Privacy policy
```

---

## 🏃 Running the Project

### Development Mode
```bash
# Start both frontend and backend in watch mode
npm run dev

# Or start individually:
npm run dev:frontend             # Frontend on :3000
npm run dev:backend              # Backend on :4000
```

### Production Build
```bash
# Build both apps
npm run build

# Build specific workspace
npm run build --workspace=frontend
npm run build --workspace=backend
```

### Running Tests
```bash
# Run backend tests
cd backend && npm test

# Run E2E tests
cd backend && npm run test:e2e

# Run linting
npm run lint
```

---

## 👨‍💻 Development

### Code Style
- **Formatting**: Prettier (configured)
- **Linting**: ESLint with TypeScript support
- **Type Safety**: Strict TypeScript mode

### Making Changes

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** and test locally

3. **Commit with descriptive messages**
```bash
git commit -m "feat: add new analysis feature"
```

4. **Push and create a Pull Request**
```bash
git push origin feature/your-feature-name
```

---

## 🚀 Deployment

### Current Status
✅ **Production Ready** - Both servers tested and running
- Backend: Healthy (v2.0.0)
- Frontend: Built successfully (11 pages)
- All TypeScript errors fixed
- Accessibility compliance achieved

### Deployment Steps

1. **Build for Production**
```bash
npm run build
```

2. **Start Production Servers**
```bash
npm run start:prod
```

3. **Docker Deployment** (if applicable)
```bash
docker-compose up --build
```

### Monitoring
- Backend Health: `http://localhost:4000/api/health`
- Frontend Status: `http://localhost:3000`
- System Metrics: `http://localhost:4000/api/metrics`

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| **Backend Services** | 7 fully operational |
| **Frontend Pages** | 11 compiled successfully |
| **TypeScript Errors** | 0 critical errors |
| **Accessibility Score** | WCAG 2.1 AA compliant |
| **Build Size** | ~7.94 MiB |
| **Production Ready** | ✅ Yes |

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**SalwynC**
- GitHub: [@SalwynC](https://github.com/SalwynC)
- Email: 11d24salwynchrist@gmail.com

---

## 🔗 Quick Links

- 🌐 **GitHub Repository**: https://github.com/SalwynC/ethical-shopping-platform
- 📖 **Documentation**: [View Docs](./docs)
- 🚀 **Live Demo**: http://localhost:3000
- 🔙 **Backend API**: http://localhost:4000

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NestJS community for robust backend architecture
- All contributors and users who have provided feedback

---

**Last Updated**: December 19, 2025
**Status**: ✅ Production Ready | All Systems Operational
