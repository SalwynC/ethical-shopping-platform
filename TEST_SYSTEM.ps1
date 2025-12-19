# Simple System Test - Ethical Shopping Platform
# This script starts both backend and frontend, then opens the browser

$ErrorActionPreference = "Continue"

Write-Host "`nStarting Ethical Shopping Platform System Test...`n" -ForegroundColor Cyan

# Configuration
$BACKEND_DIR = "D:\Projects Base Web Dev\Final YR New Project Idea\New_Scrapping_Project\ethical-shopping-platform\backend"
$FRONTEND_DIR = "D:\Projects Base Web Dev\Final YR New Project Idea\New_Scrapping_Project\ethical-shopping-platform\frontend"

# Clean up old Node processes
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend
Write-Host "`nStarting Backend (Port 4000)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run start:dev
} -ArgumentList $BACKEND_DIR

Write-Host "Waiting for backend to start (15 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# Test Backend
Write-Host "`nTesting Backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:4000/api/health" -Method Get -TimeoutSec 5
    Write-Host "Backend is healthy!" -ForegroundColor Green
} catch {
    Write-Host "Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Start Frontend
Write-Host "`nStarting Frontend (Port 3000)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList $FRONTEND_DIR

Write-Host "Waiting for frontend to compile (20 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 20

# Open Browser
Write-Host "`nOpening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "System is running!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:4000" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "`nBackend Job ID:  $($backendJob.Id)" -ForegroundColor Gray
Write-Host "Frontend Job ID: $($frontendJob.Id)" -ForegroundColor Gray
Write-Host "`nTo stop servers: Get-Job | Stop-Job`n" -ForegroundColor Yellow

# Monitor
Write-Host "Monitoring servers (Press Ctrl+C to exit)..." -ForegroundColor Gray
try {
    while ($true) {
        Start-Sleep -Seconds 10
        
        $bStatus = Get-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
        $fStatus = Get-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue
        
        if ($bStatus.State -eq "Failed" -or $fStatus.State -eq "Failed") {
            Write-Host "A service failed. Check the logs." -ForegroundColor Red
            break
        }
    }
} catch {
    Write-Host "`nExiting monitor..." -ForegroundColor Yellow
}

Write-Host "`nServers are still running. Use 'Get-Job | Stop-Job' to stop them.`n" -ForegroundColor Green
