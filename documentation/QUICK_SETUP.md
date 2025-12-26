# 🚀 Quick Start - MongoDB & OpenAI Setup

## ⚡ Super Fast Setup (10 minutes)

### 1️⃣ Add OpenAI API Key (2 minutes)

```bash
# 1. Get FREE API key with $5 credits:
# Visit: https://platform.openai.com/api-keys

# 2. Open: backend/.env

# 3. Replace this line:
OPENAI_API_KEY=your_openai_api_key_here

# With your actual key:
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

### 2️⃣ Setup MongoDB Atlas FREE (5 minutes)

```bash
# 1. Create account:
# Visit: https://cloud.mongodb.com/

# 2. Create FREE M0 cluster (512MB)

# 3. Create database user:
#    Username: ethicalshop
#    Password: [create strong password]

# 4. Allow network access:
#    Click: "Allow Access from Anywhere"

# 5. Get connection string:
#    Click: Database > Connect > Connect your application
#    Copy the string (looks like: mongodb+srv://...)

# 6. Update backend/.env:
DATABASE_URL="mongodb+srv://ethicalshop:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ethical-shopping-platform?retryWrites=true&w=majority"

# Replace YOUR_PASSWORD with your actual password
```

### 3️⃣ Restart Backend (1 minute)

```powershell
# In VS Code terminal:
cd backend
# Press Ctrl+C to stop current backend
npm run start:dev

# Look for these success messages:
# ✅ OpenAI initialized successfully
# ✅ MongoDB connected successfully
```

### 4️⃣ Test Everything (2 minutes)

```bash
# 1. Load browser extension (if not loaded)
# 2. Go to any Amazon product page
# 3. Click extension icon
# 4. Click "Analyze This Product"
# 5. Wait for results
# 6. Click "History" tab
# 7. See your analyzed product! 🎉
```

---

## 🎯 What You Get

- ✅ All product analyses saved permanently
- ✅ History of everything you've analyzed
- ✅ Statistics and insights
- ✅ Better AI analysis with OpenAI
- ✅ Automatic fallback if APIs fail
- ✅ Works across browser restarts

---

## 📝 Important Links

- **OpenAI API Keys:** https://platform.openai.com/api-keys
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Full Guide:** `MONGODB_AND_OPENAI_SETUP.md`
- **Implementation Details:** `IMPLEMENTATION_COMPLETE.md`

---

## ⚠️ Current Status

**Backend:** ✅ Running on http://localhost:4000

**What's Working:**
- ✅ Product analysis
- ✅ Gemini AI (FREE)
- ✅ Review checking
- ✅ Smart alternatives
- ✅ All scoring systems

**What Needs Setup:**
- ❌ OpenAI API key (for better AI)
- ❌ MongoDB connection (for history)

---

## 🆘 Quick Troubleshooting

**"MongoDB connection refused"**
- Check connection string in .env
- Verify Atlas network access allows your IP
- Make sure password is correct

**"OpenAI API error"**
- Verify API key starts with `sk-`
- Check you have trial credits left
- System will fallback to Gemini automatically

**"History tab empty"**
- MongoDB must be connected first
- Analyze a product after connecting MongoDB
- Check backend logs for errors

---

## 🎉 Next Steps After Setup

1. Analyze multiple products
2. Check History tab to see them
3. View statistics in History tab
4. Share with friends!

---

**Questions?** Check the detailed guides in:
- `MONGODB_AND_OPENAI_SETUP.md` - Step-by-step instructions
- `IMPLEMENTATION_COMPLETE.md` - Technical details
