// Simple test script to verify backend endpoint
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/live-stats',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Backend Response:');
    console.log(JSON.stringify(JSON.parse(data), null, 2));
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Make sure backend is running on http://localhost:4000');
  process.exit(1);
});

req.end();
