# 🚀 EthiShop Production Deployment Guide

## 🎯 System Overview

EthiShop is a comprehensive ethical shopping platform with unique competitive advantages that NO other platform provides:

### ✨ Unique Features (Competitive Advantages)
- 📈 **ML Price Prediction** - Machine learning forecasts for optimal purchase timing
- 🌱 **Real-time Carbon Footprint Calculator** - Environmental impact assessment
- 🔍 **Supply Chain Transparency Tracker** - Labor practices and risk analysis  
- 🏢 **Brand Reputation Intelligence** - Comprehensive ethics scoring
- 🧠 **Smart Financial Insights** - Hidden costs and value analysis
- ⚡ **Advanced Web Scraping** - Anti-bot evasion for reliable data extraction
- 🤖 **Google Gemini AI Integration** - Advanced product analysis

## 📋 Pre-Deployment Checklist

### 1. Environment Setup
```bash
# Backend Environment Variables (.env)
PORT=4000
NODE_ENV=production

# Google AI (Required for full features)
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# MongoDB (Recommended for production)
DATABASE_URL=mongodb://localhost:27017/ethishop
MONGODB_URI=mongodb://localhost:27017/ethishop

# Rate Limiting
AI_REQUESTS_PER_MINUTE=10
MAX_CONCURRENT_ANALYSIS=5

# Security
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

```bash
# Frontend Environment Variables (.env.local)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### 2. Dependencies Installation
```bash
# Backend
cd backend
npm install --production

# Frontend  
cd frontend
npm install --production
npm run build
```

### 3. Database Setup
```bash
# Option A: MongoDB (Recommended)
# Install MongoDB locally or use MongoDB Atlas
npx prisma generate
npx prisma db push

# Option B: In-memory (Development only)
# System will automatically fall back to in-memory storage
```

## 🌐 Deployment Options

### Option 1: VPS/Dedicated Server

#### Backend Deployment
```bash
# 1. Clone repository
git clone <your-repo>
cd ethical-shopping-platform/backend

# 2. Install dependencies
npm install --production

# 3. Setup PM2 for process management
npm install -g pm2

# 4. Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'ethishop-backend',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  }]
}
EOF

# 5. Build and start
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Frontend Deployment
```bash
# 1. Navigate to frontend
cd ../frontend

# 2. Build production version
npm run build

# 3. Start with PM2
pm2 start npm --name "ethishop-frontend" -- start
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/ethishop
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for comprehensive analysis
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### Option 2: Docker Deployment

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
```

#### Frontend Dockerfile  
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    restart: unless-stopped
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: ethishop

  backend:
    build: ./backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongodb:27017/ethishop
      - GOOGLE_AI_API_KEY=${GOOGLE_AI_API_KEY}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Option 3: Cloud Deployment (Vercel + Railway)

#### Frontend on Vercel
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel --prod

# 3. Configure environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL=https://your-backend-url
```

#### Backend on Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
cd backend
railway init
railway up --detach

# 3. Configure environment variables in Railway dashboard
```

## 🔧 Performance Optimization

### Backend Optimizations
```javascript
// Enable compression
app.use(compression());

// Redis caching (optional)
const redis = require('redis');
const client = redis.createClient();

// Rate limiting per user
const rateLimit = require('express-rate-limit');
app.use('/api/analyze', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
}));

// Request timeout
app.use(timeout('60s'));
```

### Frontend Optimizations
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['images.unsplash.com', 'm.media-amazon.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
}
```

## 📊 Monitoring & Analytics

### Health Monitoring
```bash
# Setup monitoring endpoints
GET /api/health - System health check
GET /api/metrics - Performance metrics  
GET /api/analytics/insights - Usage analytics
```

### Logging Setup
```javascript
// Use winston for production logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔒 Security Considerations

### API Security
- ✅ CORS properly configured
- ✅ Rate limiting implemented
- ✅ Input validation on all endpoints
- ✅ API key protection
- ✅ Request timeout protection

### Database Security
- ✅ MongoDB authentication enabled
- ✅ Fallback system for high availability
- ✅ Data encryption in transit
- ✅ Regular backups

## 🚀 Launch Checklist

- [ ] Environment variables configured
- [ ] Google Gemini AI API key added
- [ ] Database connection tested
- [ ] SSL certificates installed
- [ ] Domain pointing to servers
- [ ] Monitoring dashboard setup
- [ ] Error logging configured
- [ ] Performance testing completed
- [ ] Security audit passed
- [ ] Backup strategy implemented

## 📈 Scaling Strategy

### Horizontal Scaling
- Use PM2 cluster mode for backend
- CDN for frontend static assets
- Load balancer for multiple backend instances
- MongoDB replica set for database

### Caching Strategy
- Redis for API response caching
- Browser caching for static assets
- CDN caching for global distribution

## 🎯 Competitive Advantage Verification

After deployment, verify all unique features are working:

1. **ML Price Prediction** - Test with multiple products
2. **Carbon Footprint Calculator** - Verify environmental data
3. **Supply Chain Analysis** - Check transparency reports
4. **Brand Reputation System** - Validate scoring accuracy
5. **Smart Financial Insights** - Test hidden cost calculations

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- Monitor API rate limits
- Update AI model prompts
- Refresh brand reputation database
- Update carbon footprint calculations
- Security patch updates

### Performance Monitoring
- Response time monitoring
- Error rate tracking
- User analytics
- API usage metrics
- System resource monitoring

---

## 🎉 Ready for Production!

EthiShop is now ready to provide unique insights that NO competitor offers. The platform combines:
- Advanced AI analysis
- Unique competitive features
- Scalable architecture
- Production-ready security
- Comprehensive monitoring

**Launch when ready - EthiShop will revolutionize ethical shopping! 🚀**