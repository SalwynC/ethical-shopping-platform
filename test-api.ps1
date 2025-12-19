# Test API endpoints without killing the backend
# Run this in a new terminal session separate from the backend

Write-Host "=== Testing Ethical Shopping Platform API ===" -ForegroundColor Cyan

# Test 1: Health
Write-Host "`n✓ Testing GET /api/health" -ForegroundColor Yellow
try {
  $health = Invoke-RestMethod -Uri "http://localhost:4000/api/health" -Method Get -TimeoutSec 5
  Write-Host "Status: $($health.status)" -ForegroundColor Green
  Write-Host "Response: $(ConvertTo-Json $health)" -ForegroundColor White
} catch {
  Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

# Test 2: Rules
Write-Host "`n✓ Testing GET /api/rules" -ForegroundColor Yellow
try {
  $rules = Invoke-RestMethod -Uri "http://localhost:4000/api/rules" -Method Get -TimeoutSec 5
  Write-Host "Rules count: $($rules.ethicalRules.Count)" -ForegroundColor Green
  Write-Host "First rule: $($rules.ethicalRules[0].name)" -ForegroundColor White
} catch {
  Write-Host "❌ Rules endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Analyze with 15 second timeout
Write-Host "`n✓ Testing POST /api/analyze" -ForegroundColor Yellow
$body = @{
  url = "https://www.amazon.in/dp/B0C7SGVZZN"
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod `
    -Uri "http://localhost:4000/api/analyze" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -TimeoutSec 15

  Write-Host "Platform: $($response.platform)" -ForegroundColor Green
  Write-Host "Deal Score: $($response.dealScore)" -ForegroundColor Green
  Write-Host "Ethical Score: $($response.ethicalScore)" -ForegroundColor Green
  Write-Host "Decision: $($response.decision)" -ForegroundColor Green
  Write-Host "Full response length: $(ConvertTo-Json $response | Measure-Object -Character | Select-Object -ExpandProperty Characters) characters" -ForegroundColor White
} catch {
  Write-Host "❌ Analyze failed: $($_.Exception.Message)" -ForegroundColor Red
  if ($_.ErrorDetails) {
    Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
  }
}

Write-Host "`n=== All tests completed ===" -ForegroundColor Cyan
