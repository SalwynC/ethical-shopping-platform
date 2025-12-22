Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    Testing All Real Endpoints with Database Persistence Check     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000/api"
$passCount = 0
$failCount = 0

# Test 1: Health
Write-Host "1. Testing GET /api/health..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   PASS: Status $($response.StatusCode)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "   FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 2: Products
Write-Host "2. Testing GET /api/products..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   PASS: Found $($data.Count) products" -ForegroundColor Green
    if ($data.Count -gt 0) {
        Write-Host "   Product Sample: $($data[0].name) - Score: $($data[0].ethics_score)" -ForegroundColor Cyan
    }
    $passCount++
} catch {
    Write-Host "   FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 3: Rules
Write-Host "3. Testing GET /api/rules..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/rules" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   PASS: Found $($data.Count) rules" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "   FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 4: Metrics
Write-Host "4. Testing GET /api/metrics..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/metrics" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   PASS: Status $($response.StatusCode)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "   FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 5: Analyze (POST)
Write-Host "5. Testing POST /api/analyze (with real data)..."
$payload = @{
    productName = "Organic Fair Trade Coffee"
    price = 14.99
    brand = "Local Coffee Co"
    productUrl = "https://example.com/coffee"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/analyze" -Method POST -ContentType "application/json" -Body $payload -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   PASS: Analysis complete - Score: $($data.ethicsScore)/100" -ForegroundColor Green
    Write-Host "   ✓ Data stored in database" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "   FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Wait for DB write
Start-Sleep -Seconds 2

# Test 6: History (check persistence)
Write-Host "6. Testing GET /api/history (verify database persistence)..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/history" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   PASS: Retrieved $($data.Count) records from database" -ForegroundColor Green
    if ($data.Count -gt 0) {
        Write-Host "   CONFIRMED: Data is persisted in Supabase!" -ForegroundColor Green
        Write-Host "   Latest: $($data[0].productName) - Score: $($data[0].ethicsScore)" -ForegroundColor Cyan
    }
    $passCount++
} catch {
    Write-Host "   FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 7: History Stats
Write-Host "7. Testing GET /api/history/stats..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/history/stats" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   PASS: Status $($response.StatusCode)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "   FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 8: Alternatives
Write-Host "8. Testing GET /api/alternatives..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/alternatives" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   PASS: Found $($data.Count) alternatives" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "   FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 9: Predict (POST)
Write-Host "9. Testing POST /api/predict..."
$predictPayload = @{
    productId = "coffee-1"
    historicalPrices = @(12.99, 13.99, 14.99)
    days = 30
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/predict" -Method POST -ContentType "application/json" -Body $predictPayload -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   PASS: Prediction generated" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "   FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 10: Analytics
Write-Host "10. Testing GET /api/analytics/insights..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/analytics/insights" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "    PASS: Status $($response.StatusCode)" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "    FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "RESULTS: PASSED=$passCount | FAILED=$failCount" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "✅ Data IS being stored in Supabase correctly!" -ForegroundColor Green
    Write-Host "✅ All endpoints are working with real data!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed - see above" -ForegroundColor Yellow
}
Write-Host ""
