# MongoDB and OpenAI Integration - Setup Guide

## ✅ What's Already Done

Your backend is now running with:
- ✅ OpenAI integration code (waiting for API key)
- ✅ MongoDB integration code (waiting for database connection)
- ✅ History tracking system (ready to store analysis data)
- ✅ New API endpoints:
  - `GET /api/history` - View analysis history
  - `GET /api/history/stats` - View analytics statistics
- ✅ Browser extension updated with History tab
- ✅ Backend running on http://localhost:4000

## 🔧 Step 1: Add Your OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign in (or create account if needed)
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. Open `backend/.env` file
6. Replace this line:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   With:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
7. Save the file

**Note:** OpenAI API has free trial credits ($5) when you sign up. After that, it costs money based on usage.

## 🗄️ Step 2: Setup MongoDB (Choose ONE Option)

### Option A: MongoDB Atlas (FREE Cloud Database) ⭐ RECOMMENDED

**Advantages:**
- ✅ Completely FREE (512MB storage)
- ✅ No installation needed
- ✅ Works from anywhere
- ✅ Automatic backups
- ✅ Fast setup (5 minutes)

**Steps:**

1. **Create Account:**
   - Go to: https://cloud.mongodb.com/
   - Click "Try Free" and sign up

2. **Create a Free Cluster:**
   - Choose "M0 Sandbox" (FREE tier)
   - Select region closest to you
   - Click "Create Cluster"

3. **Setup Database Access:**
   - In left sidebar, click "Database Access"
   - Click "Add New Database User"
   - Username: `ethicalshop`
   - Password: Create a strong password (SAVE THIS!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access:**
   - In left sidebar, click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your IP)
   - Click "Confirm"

5. **Get Connection String:**
   - In left sidebar, click "Database"
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://...`)

6. **Update Your .env File:**
   - Open `backend/.env`
   - Find the `DATABASE_URL` line
   - Replace it with:
     ```
     DATABASE_URL="mongodb+srv://ethicalshop:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ethical-shopping-platform?retryWrites=true&w=majority"
     ```
   - Replace `YOUR_PASSWORD` with the password you created
   - Replace the cluster URL with your actual cluster URL
   - Save the file

7. **Restart Backend:**
   - Stop the backend (Ctrl+C in terminal)
   - Run: `npm run start:dev`
   - You should see: `✅ MongoDB connected successfully!`

### Option B: Local MongoDB (FREE but requires installation)

**Advantages:**
- ✅ Completely offline
- ✅ Full control
- ✅ Fast performance

**Disadvantages:**
- ❌ Requires installation (~500MB)
- ❌ Only works on this computer

**Steps:**

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Version: Latest stable version

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation:**
   - Open Command Prompt
   - Run: `mongod --version`
   - Should see version number

4. **Your .env is Already Configured!**
   - Your `backend/.env` already has:
     ```
     DATABASE_URL="mongodb://localhost:27017/ethical-shopping-platform"
     ```
   - This will work automatically once MongoDB is installed

5. **Start MongoDB Service:**
   - MongoDB should start automatically as a Windows service
   - Or run: `net start MongoDB`

6. **Restart Backend:**
   - Your backend should now connect successfully
   - You should see: `✅ MongoDB connected successfully!`

## 🧪 Step 3: Test Everything

1. **Check Backend Status:**
   - Backend should be running on http://localhost:4000
   - Look for these logs:
     - ✅ OpenAI initialized successfully
     - ✅ MongoDB connected successfully
     - ✅ Mapped {/api/history, GET} route

2. **Test the Extension:**
   - Load the browser extension (if not already loaded)
   - Go to any Amazon/Flipkart product page
   - Click the extension icon
   - Click "Analyze This Product"
   - Analysis will now be saved to database!

3. **Check History Tab:**
   - After analyzing a product
   - Click the "History" tab in the extension
   - You should see your analyzed products!

4. **Verify Database Storage:**
   - **For MongoDB Atlas:**
     - Go to your Atlas dashboard
     - Click "Browse Collections"
     - You should see "ethical-shopping-platform" database
     - Inside: "analysishistories" collection with your data

   - **For Local MongoDB:**
     - Open MongoDB Compass
     - Connect to: `mongodb://localhost:27017`
     - Find "ethical-shopping-platform" database
     - View your analysis records

## 📊 New Features Available

### 1. History Tab in Extension
- View all products you've analyzed
- See scores, dates, brands
- Click any item to revisit the product page

### 2. Analytics API
- `GET /api/history?limit=20` - Get recent analyses
- `GET /api/history?brand=Nike` - Filter by brand
- `GET /api/history/stats` - Get statistics:
  - Total analyses count
  - Average ethical score
  - Average deal score
  - Top brands analyzed

### 3. AI Model Selection
- **OpenAI (GPT-3.5/GPT-4)**: More advanced, costs money after trial
- **Google Gemini**: FREE, 15 requests per minute
- **Fallback**: Smart analysis without AI (always available)
- System tries OpenAI first, then Gemini, then fallback

## 🎯 Quick Setup Summary

**Fastest Route (5 minutes):**
1. Add OpenAI API key to `.env` file
2. Create MongoDB Atlas account
3. Get connection string from Atlas
4. Update `DATABASE_URL` in `.env`
5. Restart backend
6. Test the extension!

## ⚠️ Current Status

Your system is already running, but:
- ❌ MongoDB not connected (data not being saved)
- ❌ OpenAI API key not added (using Gemini only)

After setup:
- ✅ All analyses will be saved to database
- ✅ History will persist across sessions
- ✅ OpenAI will provide enhanced analysis
- ✅ You can view analytics and stats

## 🆘 Troubleshooting

### "MongoDB connection refused"
- Check if MongoDB service is running (Windows Services)
- Verify connection string in .env
- For Atlas: Check network access allows your IP
- For Local: Make sure MongoDB is installed and started

### "OpenAI API error"
- Verify API key is correct (starts with `sk-`)
- Check API usage limits (trial credits may be exhausted)
- System will fallback to Gemini automatically

### "History not showing in extension"
- Check backend is running (http://localhost:4000)
- Check browser console for errors (F12)
- Verify MongoDB is connected (check backend logs)
- Try analyzing a product first

## 📝 Environment File Reference

Your complete `.env` should look like:

```env
PORT=4000
NODE_ENV=development

# Google Gemini AI API (FREE - currently working)
GOOGLE_AI_API_KEY=AIzaSyC6wJhXILe3tpXl9UXN1VgfXmZHUgNKk_U

# OpenAI API (Add your key here)
OPENAI_API_KEY=sk-your-actual-key-here

# Free APIs
OPEN_FOOD_FACTS_API=https://world.openfoodfacts.org/api/v0/product
BARCODE_LOOKUP_API=https://api.upcitemdb.com/prod/trial/lookup

# Rate limiting
AI_REQUESTS_PER_MINUTE=10
SCRAPER_DELAY_MS=2000
MAX_CONCURRENT_REQUESTS=3

# MongoDB Database (Update this!)
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/ethical-shopping-platform"
# OR for local:
# DATABASE_URL="mongodb://localhost:27017/ethical-shopping-platform"
```

## 🚀 Next Steps

1. **Now**: Add OpenAI key and setup MongoDB
2. **Then**: Test the complete flow
3. **Next**: Analyze multiple products to build history
4. **Later**: View analytics and insights from your history

Need help? Check the backend logs for detailed error messages!
