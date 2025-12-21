# Startup script for Ethical Shopping Platform

Write-Host "🚀 Starting Ethical Shopping Platform..." -ForegroundColor Green
Write-Host ""

# Check if backend node_modules exist
if (!(Test-Path ".\backend\node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Check if frontend node_modules exist
if (!(Test-Path ".\frontend\node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "✅ Dependencies ready" -ForegroundColor Green
Write-Host ""

# Start backend
Write-Host "🔧 Starting Backend (NestJS) on http://localhost:3001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$(Get-Location)\backend'; npm run start:dev"

# Wait for backend to initialize
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend
Write-Host "🎨 Starting Frontend (Next.js) on http://localhost:3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$(Get-Location)\frontend'; npm run dev"

Write-Host ""
Write-Host "✅ Both servers starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:3001" -ForegroundColor Magenta
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Magenta
Write-Host ""
Write-Host "💡 Database will auto-seed with real data on first run" -ForegroundColor Yellow
Write-Host "💡 Press Ctrl+C in each terminal to stop servers" -ForegroundColor Yellow
Write-Host ""
