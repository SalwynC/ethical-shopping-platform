/**
 * Content Script - Extracts REAL product data from any e-commerce page
 */

console.log('🔍 [Ethical Shopping] Content script loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractData') {
    console.log('📊 [Ethical Shopping] Extracting data...');
    const data = extractProductData();
    sendResponse({ success: true, data: data });
  }
  return true; // Keep message channel open for async response
});

// Main extraction function
function extractProductData() {
  const url = window.location.href;
  const hostname = window.location.hostname;
  
  let data = {
    url: url,
    title: null,
    price: null,
    originalPrice: null,
    currency: 'INR',
    rating: null,
    reviewCount: null,
    brand: null,
    availability: 'In Stock',
    images: [],
    description: null
  };
  
  // Detect platform and extract
  if (hostname.includes('amazon')) {
    console.log('🛒 Amazon detected');
    Object.assign(data, extractAmazonData());
  } else if (hostname.includes('flipkart')) {
    console.log('🛒 Flipkart detected');
    Object.assign(data, extractFlipkartData());
  } else {
    console.log('🛒 Generic site - attempting extraction');
    Object.assign(data, extractGenericData());
  }
  
  console.log('✅ Extracted:', data);
  return data;
}

// Amazon extraction
function extractAmazonData() {
  const data = {};
  
  // Title
  const titleEl = document.querySelector('#productTitle') || 
                  document.querySelector('h1[class*="product"]');
  data.title = titleEl?.textContent?.trim();
  
  // Price - multiple attempts
  let priceEl = document.querySelector('.a-price .a-offscreen') ||
                document.querySelector('.a-price-whole') ||
                document.querySelector('[data-a-color="price"]');
  
  if (priceEl) {
    const priceText = priceEl.textContent || priceEl.getAttribute('aria-label') || '';
    const priceMatch = priceText.match(/[\d,]+(?:\.\d{2})?/);
    if (priceMatch) {
      data.price = parseFloat(priceMatch[0].replace(/,/g, ''));
    }
  }
  
  // Original Price (M.R.P.)
  const mrpEl = document.querySelector('.a-text-price .a-offscreen') ||
                document.querySelector('span.a-price.a-text-price');
  if (mrpEl) {
    const mrpText = mrpEl.textContent;
    const mrpMatch = mrpText.match(/[\d,]+(?:\.\d{2})?/);
    if (mrpMatch) {
      data.originalPrice = parseFloat(mrpMatch[0].replace(/,/g, ''));
    }
  }
  
  // Rating
  const ratingEl = document.querySelector('span[data-hook="rating-out-of-text"]') ||
                   document.querySelector('i[data-hook="average-star-rating"]') ||
                   document.querySelector('[class*="a-star"]');
  if (ratingEl) {
    const ratingText = ratingEl.textContent || ratingEl.getAttribute('class') || '';
    const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
    if (ratingMatch) {
      data.rating = parseFloat(ratingMatch[1]);
    }
  }
  
  // Reviews
  const reviewEl = document.querySelector('#acrCustomerReviewText') ||
                   document.querySelector('span[data-hook="total-review-count"]');
  if (reviewEl) {
    const reviewText = reviewEl.textContent;
    const reviewMatch = reviewText.match(/[\d,]+/);
    if (reviewMatch) {
      data.reviewCount = parseInt(reviewMatch[0].replace(/,/g, ''));
    }
  }
  
  // Brand
  const brandEl = document.querySelector('a#bylineInfo') ||
                  document.querySelector('span.a-size-base.po-break-word') ||
                  document.querySelector('[class*="brand"]');
  data.brand = brandEl?.textContent?.trim().replace(/^(Brand:|Visit the|Store)?\s*/i, '');
  
  // Image
  const imageEl = document.querySelector('#landingImage') ||
                  document.querySelector('[data-old-hires]') ||
                  document.querySelector('img[class*="product"]');
  if (imageEl) {
    data.images = [imageEl.src || imageEl.getAttribute('data-old-hires')];
  }
  
  return data;
}

// Flipkart extraction
function extractFlipkartData() {
  const data = {};
  
  // Title
  const titleEl = document.querySelector('span.B_NuCI') ||
                  document.querySelector('h1');
  data.title = titleEl?.textContent?.trim();
  
  // Price
  const priceEl = document.querySelector('div._30jeq3') ||
                  document.querySelector('[class*="_30jeq3"]');
  if (priceEl) {
    const priceText = priceEl.textContent;
    const priceMatch = priceText.match(/[\d,]+/);
    if (priceMatch) {
      data.price = parseFloat(priceMatch[0].replace(/,/g, ''));
    }
  }
  
  // Original Price
  const mrpEl = document.querySelector('div._3I9_wc') ||
                document.querySelector('[class*="_3I9_wc"]');
  if (mrpEl) {
    const mrpText = mrpEl.textContent;
    const mrpMatch = mrpText.match(/[\d,]+/);
    if (mrpMatch) {
      data.originalPrice = parseFloat(mrpMatch[0].replace(/,/g, ''));
    }
  }
  
  // Rating
  const ratingEl = document.querySelector('div._3LWZlK') ||
                   document.querySelector('[class*="rating"]');
  if (ratingEl) {
    const ratingText = ratingEl.textContent;
    const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
    if (ratingMatch) {
      data.rating = parseFloat(ratingMatch[1]);
    }
  }
  
  // Reviews
  const reviewEl = document.querySelector('span._2_R_DZ');
  if (reviewEl) {
    const reviewText = reviewEl.textContent;
    const reviewMatch = reviewText.match(/[\d,]+/);
    if (reviewMatch) {
      data.reviewCount = parseInt(reviewMatch[0].replace(/,/g, ''));
    }
  }
  
  return data;
}

// Generic extraction for other sites
function extractGenericData() {
  const data = {};
  
  // Title - try common patterns
  const titleEl = document.querySelector('h1') ||
                  document.querySelector('[class*="title"]') ||
                  document.querySelector('[class*="product-name"]');
  data.title = titleEl?.textContent?.trim();
  
  // Price - look for price patterns
  const priceSelectors = [
    '[class*="price"]',
    '[itemprop="price"]',
    '[data-price]'
  ];
  
  for (const selector of priceSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      const text = el.textContent || el.getAttribute('content') || el.getAttribute('data-price') || '';
      const match = text.match(/[\d,]+(?:\.\d{2})?/);
      if (match) {
        data.price = parseFloat(match[0].replace(/,/g, ''));
        break;
      }
    }
  }
  
  return data;
}

console.log('✅ [Ethical Shopping] Content script ready');

// Extract product data from the current page
function extractProductData() {
  const url = window.location.href;
  const hostname = window.location.hostname;
  
  console.log('📊 Extracting data from:', hostname);
  
  // Detect platform
  let platform = 'unknown';
  if (hostname.includes('amazon')) platform = 'amazon';
  else if (hostname.includes('flipkart')) platform = 'flipkart';
  else if (hostname.includes('myntra')) platform = 'myntra';
  
  // Extract data based on platform
  let data = null;
  
  if (platform === 'amazon') {
    data = extractAmazonData();
  } else if (platform === 'flipkart') {
    data = extractFlipkartData();
  } else {
    data = extractGenericData();
  }
  
  if (data) {
    data.url = url;
    data.platform = platform;
    console.log('✅ Data extracted:', data);
  } else {
    console.warn('⚠️ Could not extract product data');
  }
  
  return data;
}

// Amazon-specific extraction
function extractAmazonData() {
  try {
    // Title
    const title = document.querySelector('#productTitle')?.textContent?.trim() ||
                  document.querySelector('h1.product-title')?.textContent?.trim();
    
    // Price - try multiple selectors
    let price = null;
    let priceText = document.querySelector('.a-price-whole')?.textContent?.trim() ||
                    document.querySelector('[data-a-color="price"] .a-price-whole')?.textContent?.trim() ||
                    document.querySelector('.a-price .a-offscreen')?.textContent?.trim();
    
    if (priceText) {
      price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }
    
    // M.R.P. (Original Price)
    let originalPrice = null;
    const mrpText = document.querySelector('.a-text-price .a-offscreen')?.textContent?.trim() ||
                    document.querySelector('span.a-price.a-text-price')?.textContent?.trim();
    if (mrpText) {
      originalPrice = parseFloat(mrpText.replace(/[^0-9.]/g, ''));
    }
    
    // Rating
    let rating = null;
    const ratingText = document.querySelector('[role="img"][aria-label*="out of"]')?.getAttribute('aria-label') ||
                       document.querySelector('span.a-icon-alt')?.textContent?.trim();
    if (ratingText) {
      const match = ratingText.match(/([0-9.]+)\s*out of/i);
      if (match) rating = parseFloat(match[1]);
    }
    
    // Review Count
    let reviewCount = null;
    const reviewText = document.querySelector('#acrCustomerReviewText')?.textContent?.trim() ||
                       document.querySelector('span[data-hook="total-review-count"]')?.textContent?.trim();
    if (reviewText) {
      const match = reviewText.match(/([0-9,]+)/);
      if (match) reviewCount = parseInt(match[1].replace(/,/g, ''));
    }
    
    // Brand
    const brand = document.querySelector('a#bylineInfo')?.textContent?.trim()?.replace(/^Visit the |^Brand: /i, '') ||
                  document.querySelector('.po-brand .po-break-word')?.textContent?.trim();
    
    // Availability
    let availability = 'unknown';
    const availText = document.querySelector('#availability')?.textContent?.trim()?.toLowerCase() || '';
    if (availText.includes('in stock')) availability = 'in_stock';
    else if (availText.includes('out of stock')) availability = 'out_of_stock';
    
    // Images
    const images = [];
    document.querySelectorAll('#altImages img, #imageBlock img').forEach(img => {
      const src = img.src;
      if (src && src.startsWith('http') && !src.includes('pixel')) {
        images.push(src);
      }
    });
    
    return {
      title,
      price,
      originalPrice,
      currency: 'INR',
      rating,
      reviewCount,
      brand,
      availability,
      images: images.slice(0, 5), // First 5 images
      category: extractCategory()
    };
  } catch (error) {
    console.error('❌ Amazon extraction error:', error);
    return null;
  }
}

// Flipkart-specific extraction
function extractFlipkartData() {
  try {
    const title = document.querySelector('span.B_NuCI')?.textContent?.trim() ||
                  document.querySelector('.product-title')?.textContent?.trim();
    
    let price = null;
    const priceText = document.querySelector('._30jeq3._16Jk6d')?.textContent?.trim() ||
                      document.querySelector('._30jeq3')?.textContent?.trim();
    if (priceText) {
      price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }
    
    let rating = null;
    const ratingText = document.querySelector('._3LWZlK')?.textContent?.trim();
    if (ratingText) {
      rating = parseFloat(ratingText);
    }
    
    let reviewCount = null;
    const reviewText = document.querySelector('._2_R_DZ span')?.textContent?.trim();
    if (reviewText) {
      const match = reviewText.match(/([0-9,]+)/);
      if (match) reviewCount = parseInt(match[1].replace(/,/g, ''));
    }
    
    return {
      title,
      price,
      currency: 'INR',
      rating,
      reviewCount,
      brand: document.querySelector('._2b6wYy')?.textContent?.trim(),
      availability: 'in_stock',
      category: extractCategory()
    };
  } catch (error) {
    console.error('❌ Flipkart extraction error:', error);
    return null;
  }
}

// Generic extraction for other sites
function extractGenericData() {
  try {
    const title = document.querySelector('h1')?.textContent?.trim();
    
    // Try to find price
    let price = null;
    const priceEl = document.querySelector('[itemprop="price"], .price, [class*="price"]');
    if (priceEl) {
      const priceText = priceEl.textContent || priceEl.getAttribute('content') || '';
      price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }
    
    return {
      title,
      price,
      currency: 'INR',
      category: extractCategory()
    };
  } catch (error) {
    console.error('❌ Generic extraction error:', error);
    return null;
  }
}

// Extract category from breadcrumbs or URL
function extractCategory() {
  const breadcrumbs = document.querySelector('#wayfinding-breadcrumbs_feature_div, .breadcrumb, [class*="breadcrumb"]')?.textContent?.trim();
  if (breadcrumbs) {
    const parts = breadcrumbs.split(/[›>\/]/).map(p => p.trim()).filter(p => p);
    if (parts.length > 0) return parts[0];
  }
  
  // Fallback to URL
  const url = window.location.href.toLowerCase();
  if (url.includes('electronics')) return 'Electronics';
  if (url.includes('fashion') || url.includes('clothing')) return 'Fashion';
  if (url.includes('home')) return 'Home & Kitchen';
  
  return 'General';
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractData') {
    const data = extractProductData();
    sendResponse({ success: true, data });
  }
  return true; // Keep message channel open
});

// Auto-extract on page load and store
setTimeout(() => {
  const data = extractProductData();
  if (data) {
    chrome.storage.local.set({ lastExtractedData: data });
  }
}, 2000); // Wait 2s for page to fully load
