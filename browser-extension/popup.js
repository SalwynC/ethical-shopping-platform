/**
 * Popup Script - Handles UI and backend communication
 */

const BACKEND_URL = 'http://localhost:4000';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('analyzeBtn').addEventListener('click', analyzeProduct);
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Load history when opening popup
  loadHistory();
});

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}Tab`);
  });

  // Load history when switching to history tab
  if (tabName === 'history') {
    loadHistory();
  }
}

async function loadHistory() {
  const historyList = document.getElementById('historyList');
  const historyLoading = document.getElementById('historyLoading');
  const emptyHistory = document.getElementById('emptyHistory');
  const historyStats = document.getElementById('historyStats');

  historyList.innerHTML = '';
  historyLoading.style.display = 'block';
  emptyHistory.style.display = 'none';
  historyStats.style.display = 'none';

  try {
    const response = await fetch(`${BACKEND_URL}/api/history?limit=20`);
    const result = await response.json();

    historyLoading.style.display = 'none';

    if (!result.success || result.data.length === 0) {
      emptyHistory.style.display = 'block';
      return;
    }

    // Load and display stats
    const statsResponse = await fetch(`${BACKEND_URL}/api/history/stats`);
    const statsResult = await statsResponse.json();
    
    if (statsResult.success) {
      historyStats.style.display = 'block';
      historyStats.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${statsResult.stats.totalAnalyses}</div>
            <div class="stat-label">Total Analyzed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${statsResult.stats.avgEthicalScore}</div>
            <div class="stat-label">Avg Ethical Score</div>
          </div>
        </div>
      `;
    }

    // Display history items
    result.data.forEach(item => {
      const date = new Date(item.analyzedAt).toLocaleDateString();
      const time = new Date(item.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const ethicalColor = item.ethicalScore >= 70 ? '#22c55e' : item.ethicalScore >= 40 ? '#eab308' : '#ef4444';
      const dealColor = item.dealScore >= 70 ? '#22c55e' : item.dealScore >= 40 ? '#eab308' : '#ef4444';

      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-header">
          <div class="history-title">${item.productTitle || 'Unknown Product'}</div>
          <div class="history-date">${date} ${time}</div>
        </div>
        <div class="history-scores">
          <div class="history-score" style="background: ${ethicalColor}20; border-left: 3px solid ${ethicalColor}">
            <span class="history-score-label">Ethical</span>
            <span class="history-score-value" style="color: ${ethicalColor}">${item.ethicalScore}</span>
          </div>
          <div class="history-score" style="background: ${dealColor}20; border-left: 3px solid ${dealColor}">
            <span class="history-score-label">Deal</span>
            <span class="history-score-value" style="color: ${dealColor}">${item.dealScore}</span>
          </div>
        </div>
        <div class="history-meta">
          ${item.brand ? `<span>🏷️ ${item.brand}</span>` : ''}
          ${item.productPrice ? `<span>💰 ${item.productPrice}</span>` : ''}
          ${item.reviewChecker ? `<span>${item.reviewChecker.badge}</span>` : ''}
        </div>
      `;

      historyItem.addEventListener('click', () => {
        chrome.tabs.create({ url: item.productUrl });
      });

      historyList.appendChild(historyItem);
    });

  } catch (error) {
    console.error('Failed to load history:', error);
    historyLoading.style.display = 'none';
    emptyHistory.style.display = 'block';
    emptyHistory.innerHTML = `
      <div class="empty-history-icon">⚠️</div>
      <p><strong>Failed to Load History</strong></p>
      <p style="font-size: 12px; margin-top: 8px;">${error.message}</p>
    `;
  }
}

async function analyzeProduct() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const errorBox = document.getElementById('error');
  const infoBox = document.getElementById('infoBox');

  results.style.display = 'none';
  errorBox.style.display = 'none';
  infoBox.style.display = 'none';
  analyzeBtn.disabled = true;
  loading.style.display = 'block';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url) {
      throw new Error('Cannot access this page');
    }

    console.log('📡 Extracting data...');
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' });
    
    if (!response || !response.success || !response.data) {
      throw new Error('Could not extract product data from this page');
    }

    const productData = response.data;
    console.log('✅ Extracted:', productData);

    console.log('📤 Sending to backend...');
    const backendResponse = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url: productData.url,
        productData: productData
      }),
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const analysisResult = await backendResponse.json();
    console.log('✅ Analysis complete:', analysisResult);

    displayResults(productData, analysisResult);

  } catch (error) {
    console.error('❌ Error:', error);
    errorBox.textContent = '❌ ' + error.message;
    errorBox.style.display = 'block';
    infoBox.style.display = 'block';
  } finally {
    loading.style.display = 'none';
    analyzeBtn.disabled = false;
  }
}

function displayResults(productData, analysis) {
  const results = document.getElementById('results');
  const infoBox = document.getElementById('infoBox');
  
  // Extract scores - CORRECT field names from backend
  let ethicalScore = analysis.ethicalScore || 0;
  let dealScore = analysis.dealScore || 0;
  let recommendation = '';
  let reviewChecker = null;
  
  // Get recommendation text
  if (analysis.recommendation && typeof analysis.recommendation === 'object') {
    recommendation = analysis.recommendation.action || 'Analysis complete';
  } else if (analysis.recommendation && typeof analysis.recommendation === 'string') {
    recommendation = analysis.recommendation;
  } else if (analysis.decision) {
    recommendation = analysis.decision;
  } else {
    recommendation = 'Analyzing...';
  }
  
  // Get review checker data
  if (analysis.reviewChecker) {
    reviewChecker = analysis.reviewChecker;
  }
  
  // Determine color classes
  const ethicalClass = ethicalScore >= 70 ? 'high' : ethicalScore >= 40 ? 'medium' : 'low';
  const dealClass = dealScore >= 70 ? 'high' : dealScore >= 40 ? 'medium' : 'low';
  
  // Calculate discount
  const discount = productData.originalPrice && productData.price 
    ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
    : 0;
  
  console.log('🎨 Building UI with:', {
    ethicalScore,
    dealScore,
    recommendation,
    reviewChecker: reviewChecker ? 'Present' : 'Not present'
  });
  
  let html = `
    <div class="product-info">
      <div class="product-title">${productData.title || 'Unknown Product'}</div>
      <div class="product-details">
        <div class="detail-item">
          <span class="detail-label">💰 Price</span>
          <span class="detail-value">₹${productData.price ? productData.price.toLocaleString('en-IN') : 'N/A'}</span>
        </div>`;
  
  if (productData.originalPrice && productData.originalPrice !== productData.price) {
    html += `
        <div class="detail-item">
          <span class="detail-label">📌 M.R.P</span>
          <span class="detail-value" style="text-decoration: line-through; color: #999;">₹${productData.originalPrice.toLocaleString('en-IN')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">🎁 Discount</span>
          <span class="detail-value" style="color: #10b981; font-weight: bold;">${discount}% OFF</span>
        </div>`;
  }
  
  if (productData.rating) {
    html += `
        <div class="detail-item">
          <span class="detail-label">⭐ Rating</span>
          <span class="detail-value">${productData.rating.toFixed(1)}★ ${productData.reviewCount ? `(${productData.reviewCount.toLocaleString()})` : ''}</span>
        </div>`;
  }
  
  if (productData.brand) {
    html += `
        <div class="detail-item">
          <span class="detail-label">🏷️ Brand</span>
          <span class="detail-value">${productData.brand}</span>
        </div>`;
  }
  
  html += `
      </div>
    </div>

    <div class="score-container">
      <div class="score-section">
        <div class="score-header">
          <div class="score-icon">🌱</div>
          <div class="score-title">Ethical Score</div>
        </div>
        <div class="score-bar">
          <div class="score-fill ${ethicalClass}" style="width: ${Math.max(5, ethicalScore)}%; min-width: 40px;">
            <span class="score-text">${Math.round(ethicalScore)}</span>
          </div>
        </div>
        <div class="score-label">${ethicalScore >= 70 ? '✅ Good' : ethicalScore >= 40 ? '⚠️ Moderate' : '❌ Low'}</div>
      </div>

      <div class="score-section">
        <div class="score-header">
          <div class="score-icon">💰</div>
          <div class="score-title">Deal Score</div>
        </div>
        <div class="score-bar">
          <div class="score-fill ${dealClass}" style="width: ${Math.max(5, dealScore)}%; min-width: 40px;">
            <span class="score-text">${Math.round(dealScore)}</span>
          </div>
        </div>
        <div class="score-label">${dealScore >= 70 ? '🎯 Great Deal' : dealScore >= 40 ? '👍 Fair' : '⏸️ Wait'}</div>
      </div>
    </div>`;
  
  // Review Checker Section
  if (reviewChecker) {
    const trustColor = 
      reviewChecker.trustLevel === 'High' ? '#10b981' : 
      reviewChecker.trustLevel === 'Medium' ? '#f59e0b' : '#ef4444';
    
    const trustBg = 
      reviewChecker.trustLevel === 'High' ? '#ecfdf5' : 
      reviewChecker.trustLevel === 'Medium' ? '#fffbeb' : '#fef2f2';
    
    html += `
    <div class="review-checker-section" style="background: ${trustBg}; border-left: 4px solid ${trustColor};">
      <div class="review-checker-header">
        <div class="review-checker-icon">🔍</div>
        <div class="review-checker-title">Review Checker</div>
        <div class="review-checker-badge">${reviewChecker.badge || '?'}</div>
      </div>
      
      <div class="review-checker-items">
        <div class="review-item">
          <span class="review-label">Trust Score:</span>
          <span class="review-value">${reviewChecker.score || 0}/100</span>
        </div>
        <div class="review-item">
          <span class="review-label">Trust Level:</span>
          <span class="review-value" style="color: ${trustColor}; font-weight: bold;">${reviewChecker.trustLevel || 'Unknown'}</span>
        </div>
        <div class="review-item">
          <span class="review-label">Sentiment:</span>
          <span class="review-value">${reviewChecker.sentiment || 'Neutral'}</span>
        </div>
        <div class="review-item">
          <span class="review-label">Quality Score:</span>
          <span class="review-value">${reviewChecker.quality || 0}/100</span>
        </div>`;
      
      if (reviewChecker.flags && reviewChecker.flags.length > 0) {
        html += `<div class="review-flags">`;
        reviewChecker.flags.slice(0, 3).forEach(flag => {
          html += `<div class="flag-item">📌 ${flag}</div>`;
        });
        html += `</div>`;
      }
      
      html += `</div>
      <div class="review-recommendation">${reviewChecker.recommendation || 'No recommendation'}</div>
    </div>`;
  }
  
  // Alternatives Section
  if (analysis.alternatives && analysis.alternatives.length > 0) {
    html += `
    <div class="alternatives-section">
      <div class="alternatives-header">
        <div class="alternatives-icon">💡</div>
        <div class="alternatives-title">Better Options Available</div>
      </div>`;
      
      analysis.alternatives.slice(0, 3).forEach((alt, idx) => {
        const savings = productData.price - alt.price;
        const savingsPct = Math.round((savings / productData.price) * 100);
        const scoreImprovement = Math.round(alt.ethicalScore - ethicalScore);
        const bestValue = idx === 0;
        
        let badgeText = '';
        let badgeColor = '';
        if (bestValue && savingsPct > 0 && scoreImprovement > 0) {
          badgeText = '🏆 BEST VALUE';
          badgeColor = '#10b981';
        } else if (savingsPct > 20) {
          badgeText = '💰 HUGE SAVINGS';
          badgeColor = '#f59e0b';
        } else if (scoreImprovement > 10) {
          badgeText = '⭐ PREMIUM';
          badgeColor = '#8b5cf6';
        }
        
        html += `
      <div class="alternative-card">
        <div class="alternative-header">
          <div class="alternative-title">${alt.title}</div>
          ${badgeText ? `<div class="alternative-badge" style="background: ${badgeColor}; color: white;">${badgeText}</div>` : ''}
        </div>
        
        <div class="alternative-info">
          <div class="alt-row">
            <span class="alt-label">Price:</span>
            <span class="alt-value">₹${Math.round(alt.price).toLocaleString()}</span>
            ${savings > 0 ? `<span class="alt-savings">Save ₹${Math.round(savings).toLocaleString()} (${savingsPct}%)</span>` : `<span class="alt-premium">+₹${Math.round(Math.abs(savings)).toLocaleString()}</span>`}
          </div>
          
          <div class="alt-row">
            <span class="alt-label">Ethical Score:</span>
            <span class="alt-value">${Math.round(alt.ethicalScore)}/100</span>
            ${scoreImprovement > 0 ? `<span class="alt-improvement">+${scoreImprovement} points 📈</span>` : scoreImprovement < 0 ? `<span class="alt-decrease">${scoreImprovement} points 📉</span>` : ''}
          </div>
          
          <div class="alt-row">
            <span class="alt-label">Why Better:</span>
            <span class="alt-rationale">${alt.rationale}</span>
          </div>
          
          <div class="alt-row">
            <span class="alt-label">Confidence:</span>
            <div class="confidence-bar">
              <div class="confidence-fill" style="width: ${alt.confidence}%"></div>
            </div>
            <span class="alt-confidence">${Math.round(alt.confidence)}%</span>
          </div>
        </div>
      </div>`;
      });
      
      html += `</div>`;
  }
  
  // Recommendation Section
  html += `
    <div class="recommendation">
      <div class="recommendation-icon">📋</div>
      <div class="recommendation-content">
        <div class="recommendation-title">Recommendation</div>
        <div class="recommendation-text">${recommendation}</div>
      </div>
    </div>
  `;
  
  results.innerHTML = html;
  results.style.display = 'block';
  infoBox.style.display = 'none'; // Hide info box when showing results
  
  console.log('✅ UI rendered successfully');
}
