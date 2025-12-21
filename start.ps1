# Ethical Shopping Platform - Quick Start

Write-Host "🚀 Starting Ethical Shopping Platform..." -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param($port)
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Check if ports are available
Write-Host "📡 Checking ports..." -ForegroundColor Yellow
if (Test-Port 4000) {
    Write-Host "⚠️  Port 4000 is already in use. Stopping existing process..." -ForegroundColor Yellow
    Get-NetTCPConnection -LocalPort 4000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object {
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

if (Test-Port 3000) {
    Write-Host "⚠️  Port 3000 is already in use. Stopping existing process..." -ForegroundColor Yellow
    Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object {
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

Write-Host "✅ Ports are available" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "🔧 Starting Backend Server (Port 4000)..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run start:dev" -WindowStyle Normal

Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Start Frontend
Write-Host "🎨 Starting Frontend Server (Port 3000)..." -ForegroundColor Cyan
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:4000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:4000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Both servers are running in separate windows" -ForegroundColor Yellow
Write-Host "💡 Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏰ Waiting 5 seconds before opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open browser
Start-Process "http://localhost:3000"
Write-Host "🌐 Browser opened!" -ForegroundColor Green
