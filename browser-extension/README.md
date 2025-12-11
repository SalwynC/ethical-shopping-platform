# Ethical Shopping Browser Extension

## 🎯 What This Does

This browser extension extracts **REAL product data** directly from the page you're viewing (Amazon, Flipkart, etc.) and sends it to your backend for ethical analysis. No more scraping issues!

## 🖼️ Step 0: Generate Icons (First Time Only)

1. Open `create-icons.html` in your browser
2. Click each button to download `icon16.png`, `icon48.png`, `icon128.png`
3. Move the downloaded PNG files to the `icons/` folder

## 🚀 How to Install (Chrome/Edge)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder
5. The extension icon will appear in your toolbar!

## 🚀 How to Install (Firefox)

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file in the `browser-extension` folder (e.g., `manifest.json`)
4. The extension will be loaded temporarily

## 📖 How to Use

1. **Visit any product page** on Amazon.in, Flipkart.com, etc.
2. **Click the extension icon** in your toolbar
3. **Click "Analyze This Product"**
4. The extension will:
   - Extract the REAL price, rating, reviews, title from the page
   - Send it to your backend at `localhost:4000`
   - Show you ethical scores and recommendations!

## ✅ What Data It Extracts

### Amazon
- ✅ Product Title
- ✅ Current Price (₹7,899)
- ✅ Original Price/M.R.P. (₹19,999)
- ✅ Rating (3.5 stars)
- ✅ Review Count (141 reviews)
- ✅ Brand
- ✅ Availability
- ✅ Product Images

### Flipkart
- ✅ All the same fields

### Other Sites
- Basic extraction (title, price)

## 🔧 Backend Integration

The extension sends extracted data to:
```
POST http://localhost:4000/api/analyze
Body: {
  url: "https://www.amazon.in/...",
  productData: {
    title: "ZEBRONICS Pixigo A16...",
    price: 7899,
    originalPrice: 19999,
    rating: 3.5,
    reviewCount: 141,
    brand: "ZEBRONICS",
    ...
  }
}
```

Your backend will receive the **EXACT data** from the page!

## 🎉 Benefits

1. **100% Accurate** - Gets data the user actually sees
2. **No Bot Detection** - Runs in user's browser
3. **FREE** - No paid APIs needed
4. **Works Everywhere** - Amazon, Flipkart, any site
5. **Real-time** - Instant data extraction

## 🔐 Privacy

- Only runs on product pages
- Only sends data when you click "Analyze"
- Connects to your local backend (localhost:4000)
- No external servers or tracking

## 🛠 Development

The extension consists of:
- `manifest.json` - Extension configuration
- `content-script.js` - Runs on product pages, extracts data
- `popup.html` - Extension popup UI
- `popup.js` - Popup logic and backend communication

## 📝 Next Steps

1. Install the extension
2. Make sure your backend is running (`npm run start:dev`)
3. Visit a product page
4. Click "Analyze" and see REAL data!
