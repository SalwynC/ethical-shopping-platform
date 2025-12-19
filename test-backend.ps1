#!/usr/bin/env pwsh
# Test Backend Endpoints

Write-Host "`n🧪 Testing Backend Server..." -ForegroundColor Cyan
Write-Host "=" * 60

Start-Sleep -Seconds 3

# Test 1: Health Check
Write-Host "`n1️⃣ Testing /api/health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Health check passed!" -ForegroundColor Green
    Write-Host "Response: $($healthResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get Products
Write-Host "`n2️⃣ Testing /api/products endpoint..." -ForegroundColor Yellow
try {
    $productsResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/products" -Method Get -ErrorAction Stop
    Write-Host "✅ Products endpoint working! Found $($productsResponse.Count) products" -ForegroundColor Green
    if ($productsResponse.Count -gt 0) {
        Write-Host "Sample product: $($productsResponse[0].title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Products endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Rules
Write-Host "`n3️⃣ Testing /api/rules endpoint..." -ForegroundColor Yellow
try {
    $rulesResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/rules" -Method Get -ErrorAction Stop
    Write-Host "✅ Rules endpoint working! Found $($rulesResponse.Count) rules" -ForegroundColor Green
} catch {
    Write-Host "❌ Rules endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Metrics
Write-Host "`n4️⃣ Testing /api/metrics endpoint..." -ForegroundColor Yellow
try {
    $metricsResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/metrics" -Method Get -ErrorAction Stop
    Write-Host "✅ Metrics endpoint working!" -ForegroundColor Green
    Write-Host "Response: $($metricsResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Metrics endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + ("=" * 60)
Write-Host "✅ Backend endpoint tests completed!" -ForegroundColor Cyan
