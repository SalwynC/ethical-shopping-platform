// Simple test file to verify our API works
// You can run this in browser console or as a Node script

const testProductUrls = [
  'https://www.amazon.com/dp/B08N5WRWNW', // Example Amazon product
  'https://www.nike.com/t/air-max-270-mens-shoes', // Example Nike product
];

async function testAPI() {
  console.log('🔍 Testing EthiShop Real Data API...\n');
  
  for (const url of testProductUrls) {
    console.log(`Testing: ${url}`);
    
    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success:', {
          product: data.product.name,
          source: data.product.source,
          priceScore: data.priceScore,
          reviewTrust: data.reviewTrust,
          ethicsScore: data.ethicsScore,
          insights: data.insights
        });
      } else {
        const error = await response.json();
        console.log('❌ Error:', error.error);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
    
    console.log('---\n');
  }
}

// Uncomment to test:
// testAPI();