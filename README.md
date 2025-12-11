# EthiShop - Smarter Ethical Shopping Platform

## 🎯 Project Description (Dynamic + Working Version)

EthiShop is a dynamic web application that helps users shop more responsibly in real time. Instead of showing static demo data, the page responds instantly when a user pastes a product link. The interface is built with interactive cards, animated score counters and smooth section transitions, so the experience feels like a modern live product, not a flat landing page.

When a user submits a link, the app processes it and updates the page with a live scorecard that shows price fairness, review trust, and ethical rating. All sections on the homepage are connected to this data: the example cards, charts and badges change according to the selected product. Hover effects, subtle motions and scroll animations make each part of the UI feel responsive and alive, while still keeping the layout simple and easy to understand.

### Repository Layout

```
ethical-shopping-platform/
├── frontend/              # Next.js 14 PWA (React, TypeScript, Tailwind, Chakra UI)
├── backend/               # NestJS API gateway & core services
├── services/              # Independent microservices (Python + Node.js)
│   ├── scraper/           # Product data extraction
│   ├── ai-service/        # RAG explainer, GPT-5 integrations
│   ├── price-predictor/   # Prophet/LSTM price forecasts
│   ├── rule-engine/       # Explainable ethics scoring
│   ├── alternatives-service/ # ElasticSearch semantic retrieval
│   ├── privacy-service/   # Consent, DSAR workflow
│   └── metrics-service/   # Prometheus/OpenTelemetry bridge
├── database/              # SQL schema, migrations, seed scripts
├── infra/                 # Docker, Kubernetes, CI/CD, monitoring configs
├── docs/                  # PRDs, DPIA, architecture notes
└── package.json           # Workspace-level tooling hooks
```

### Next Steps

- `frontend/`: configure Next.js 14 with SSR/ISR, React Query, and PWA features.
- `backend/`: finalize NestJS module boundaries (API gateway, consent, health).
- `services/`: flesh out FastAPI apps, queue consumers, and shared proto/schema contracts.
- `database/`: add Prisma/TypeORM migrations for PostgreSQL tables (`products`, `analyses`, `rules`, `consents`, `price_history`) and Mongo/Elastic seeders.
- `infra/`: compose Docker images, Kubernetes manifests, GitHub Actions workflows, and Prometheus/Grafana dashboards.

Refer back to the master PRD in `docs/` for acceptance criteria, compliance checkpoints, and the phased roadmap.

