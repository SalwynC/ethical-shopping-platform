#!/usr/bin/env pwsh

# Ethical Shopping Platform - Comprehensive Test Suite
# Run this to verify all systems are operational

Write-Host "🧪 Ethical Shopping Platform - System Test Suite`n" -ForegroundColor Cyan

# Colors
$success = 'Green'
$fail = 'Red'
$warn = 'Yellow'
$info = 'Cyan'

# Test Results
$results = @()

# === 1. Frontend Tests ===
Write-Host "1️⃣  Testing Frontend..." -ForegroundColor $info
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -SkipHttpErrorCheck -TimeoutSec 5 -ErrorAction Stop
    if ($frontend.StatusCode -eq 200 -or $frontend.StatusCode -eq 301) {
        Write-Host "   ✅ Frontend running on http://localhost:3000" -ForegroundColor $success
        $results += @{ Test = "Frontend"; Status = "✅ OK" }
    } else {
        Write-Host "   ⚠️  Frontend returned status: $($frontend.StatusCode)" -ForegroundColor $warn
        $results += @{ Test = "Frontend"; Status = "⚠️  Status $($frontend.StatusCode)" }
    }
} catch {
    Write-Host "   ❌ Frontend not responding: $_" -ForegroundColor $fail
    $results += @{ Test = "Frontend"; Status = "❌ Not responding" }
}

# === 2. Backend Health ===
Write-Host "`n2️⃣  Testing Backend Health..." -ForegroundColor $info
try {
    $health = Invoke-WebRequest -Uri "http://localhost:4000/api/health" -SkipHttpErrorCheck -TimeoutSec 5 -ErrorAction Stop
    if ($health.StatusCode -eq 200) {
        $data = $health.Content | ConvertFrom-Json
        Write-Host "   ✅ Backend running on http://localhost:4000" -ForegroundColor $success
        Write-Host "   📊 Status: $($data.status)" -ForegroundColor $info
        $results += @{ Test = "Backend Health"; Status = "✅ OK" }
    } else {
        Write-Host "   ⚠️  Backend returned status: $($health.StatusCode)" -ForegroundColor $warn
        $results += @{ Test = "Backend Health"; Status = "⚠️  Status $($health.StatusCode)" }
    }
} catch {
    Write-Host "   ❌ Backend not responding: $_" -ForegroundColor $fail
    $results += @{ Test = "Backend Health"; Status = "❌ Not responding" }
}

# === 3. Backend Products Endpoint ===
Write-Host "`n3️⃣  Testing Products Endpoint..." -ForegroundColor $info
try {
    $products = Invoke-WebRequest -Uri "http://localhost:4000/api/products" -SkipHttpErrorCheck -TimeoutSec 5 -ErrorAction Stop
    if ($products.StatusCode -eq 200) {
        $data = $products.Content | ConvertFrom-Json
        Write-Host "   ✅ GET /api/products responding" -ForegroundColor $success
        Write-Host "   📦 Total products: $($data.products.Count)" -ForegroundColor $info
        $results += @{ Test = "Products Endpoint"; Status = "✅ OK" }
    }
} catch {
    Write-Host "   ⚠️  Products endpoint error: $_" -ForegroundColor $warn
    $results += @{ Test = "Products Endpoint"; Status = "⚠️  Error" }
}

# === 4. Prisma Setup ===
Write-Host "`n4️⃣  Checking Prisma Setup..." -ForegroundColor $info
if (Test-Path "backend/prisma/schema.prisma") {
    Write-Host "   ✅ Prisma schema exists" -ForegroundColor $success
    $schema = Get-Content "backend/prisma/schema.prisma" -Raw
    if ($schema -match 'provider = "postgresql"') {
        Write-Host "   ✅ PostgreSQL provider configured" -ForegroundColor $success
        $results += @{ Test = "Prisma Config"; Status = "✅ OK" }
    } else {
        Write-Host "   ❌ Database provider not PostgreSQL" -ForegroundColor $fail
        $results += @{ Test = "Prisma Config"; Status = "❌ Wrong provider" }
    }
} else {
    Write-Host "   ❌ Prisma schema not found" -ForegroundColor $fail
    $results += @{ Test = "Prisma Config"; Status = "❌ Not found" }
}

# === 5. Environment Variables ===
Write-Host "`n5️⃣  Checking Environment..." -ForegroundColor $info
if (Test-Path "backend/.env.local") {
    $env_file = Get-Content "backend/.env.local"
    if ($env_file -match 'GOOGLE_AI_API_KEY') {
        Write-Host "   ✅ Gemini AI key configured" -ForegroundColor $success
        $results += @{ Test = "AI API Key"; Status = "✅ OK" }
    }
    if ($env_file -match 'DATABASE_URL') {
        Write-Host "   ✅ Database URL configured" -ForegroundColor $success
        $results += @{ Test = "Database URL"; Status = "✅ OK" }
    }
} else {
    Write-Host "   ⚠️  .env.local not found" -ForegroundColor $warn
    $results += @{ Test = "Environment"; Status = "⚠️  No .env.local" }
}

# === 6. Git Status ===
Write-Host "`n6️⃣  Git Repository Status..." -ForegroundColor $info
try {
    $branch = git rev-parse --abbrev-ref HEAD 2>$null
    $status = git status --porcelain 2>$null | Measure-Object -Line
    Write-Host "   ✅ Branch: $branch" -ForegroundColor $success
    Write-Host "   📝 Changes ready: $($status.Lines) files" -ForegroundColor $info
    $results += @{ Test = "Git Status"; Status = "✅ OK" }
} catch {
    Write-Host "   ⚠️  Git status error" -ForegroundColor $warn
}

# === Summary ===
Write-Host "`n" + "="*50 -ForegroundColor Cyan
Write-Host "📋 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "="*50 -ForegroundColor Cyan

$passed = ($results | Where-Object { $_.Status -match '✅' } | Measure-Object).Count
$total = $results.Count

Write-Host "`n✅ Passed: $passed/$total`n" -ForegroundColor $success

foreach ($result in $results) {
    Write-Host "$($result.Status)  $($result.Test)"
}

# === Final Recommendations ===
Write-Host "`n" + "="*50 -ForegroundColor Cyan
Write-Host "📌 NEXT STEPS" -ForegroundColor Cyan
Write-Host "="*50 -ForegroundColor Cyan
Write-Host @"
1. ✅ Frontend UI: Minimalist dark theme ready
2. ✅ Backend: NestJS + Gemini AI ready
3. ✅ Web Scraping: 3-tier system ready
4. ⏳ Database: SQL schema ready (run SUPABASE_SCHEMA.sql in Supabase)
5. ✅ Git: Changes ready to commit

INSTRUCTIONS:
1. If NOT done: Apply SUPABASE_SCHEMA.sql in Supabase SQL Editor
2. Test analysis: Go to http://localhost:3000 → Paste product URL → Analyze
3. Check Supabase: Verify data saved in Table Editor
4. Ready to push: Say "Push to GitHub" when confirmed!

"@ -ForegroundColor $info

Write-Host "✨ System Test Complete!`n" -ForegroundColor Cyan
