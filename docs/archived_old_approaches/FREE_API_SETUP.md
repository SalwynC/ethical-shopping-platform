# 🎓 FREE API Setup Guide for Students

## 🤖 Google Gemini AI API Key (100% FREE)

### Step 1: Get Your FREE API Key
1. **Go to:** https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy your API key** (starts with "AIzaSy...")

### Step 2: Add to Your Project
1. Open: `backend/.env`
2. Replace: `GOOGLE_AI_API_KEY=your_free_gemini_api_key_here`
3. With: `GOOGLE_AI_API_KEY=AIzaSy...your_actual_key`

### ⚡ FREE Tier Limits
- **15 requests per minute** (our app respects this)
- **1,500 requests per day** 
- **No credit card required**
- **Perfect for development & student projects**

---

## 🆓 Other Free APIs We're Using

### 1. Open Food Facts API
- **URL:** https://world.openfoodfacts.org/api
- **Limit:** Unlimited for reasonable use
- **Data:** Food products, sustainability, ingredients
- **No signup required**

### 2. UPC Item DB
- **URL:** https://www.upcitemdb.com
- **Limit:** 100 requests/day (free trial)
- **Data:** Product info by barcode
- **No signup for trial**

### 3. Fake Store API (Demo)
- **URL:** https://fakestoreapi.com
- **Limit:** Unlimited
- **Data:** Sample products for alternatives
- **No signup required**

---

## 🔧 Safety Features We Added

### Rate Limiting
- Automatic rate limit respect
- Smart caching (5 min cache)
- Fallback when limits exceeded

### Error Handling
- Graceful failures
- Intelligent fallbacks
- No crashes from API failures

### Cost Protection
- Only free APIs used
- No premium features
- Student-friendly setup

---

## 🚀 Quick Setup Commands

```bash
# 1. Make sure you're in backend directory
cd backend

# 2. Install dependencies (already done)
npm install

# 3. Update your .env file with real API key
notepad .env

# 4. Test the setup
npm run start:dev
```

---

## ✅ What You Get For FREE

### With Google AI API:
- Smart product analysis
- Ethical scoring
- Deal recommendations
- Sustainability assessment

### With Free APIs:
- Product data enhancement
- Barcode lookups
- Food product details
- Price comparisons

### Without Any API (Fallback):
- Basic web scraping
- Intelligent score calculation
- Product information extraction
- Working analysis system

---

## 🎯 Student Benefits

1. **No Credit Card Required**
2. **Learn Real API Integration**
3. **Professional Error Handling**
4. **Production-Ready Patterns**
5. **Portfolio-Worthy Project**

---

## 🔍 Testing Your Setup

After adding your Google AI API key:

1. **Start Backend:** `npm run start:dev`
2. **Test URL:** Paste any Amazon/Flipkart product URL
3. **Watch Logs:** You should see "✅ Google Gemini AI initialized"
4. **Analyze Product:** Full AI-powered analysis!

---

## ⚠️ Important Notes

- **Keep your API key private** (never commit to GitHub)
- **Respect rate limits** (our app does this automatically)  
- **Free tier is generous** for student projects
- **Fallbacks ensure** your app always works

Your ethical shopping platform is now powered by real, free APIs! 🎉