#!/usr/bin/env pwsh
# Vercel Deployment Script for Ethical Shopping Platform
# This script guides you through deploying to Vercel

Write-Host "`n🚀 Ethical Shopping Platform - Vercel Deployment`n" -ForegroundColor Cyan

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI found: $(vercel --version)" -ForegroundColor Green
}

Write-Host "`n📋 Deployment Options:`n" -ForegroundColor Cyan
Write-Host "  1. Deploy Frontend (Next.js)" -ForegroundColor White
Write-Host "  2. Deploy Backend (NestJS)" -ForegroundColor White
Write-Host "  3. Deploy Both (Recommended)" -ForegroundColor White
Write-Host "  4. Deploy via GitHub Integration (Manual Setup)" -ForegroundColor White
Write-Host "  5. Exit`n" -ForegroundColor White

$choice = Read-Host "Select an option (1-5)"

function Deploy-Frontend {
    Write-Host "`n🎨 Deploying Frontend...`n" -ForegroundColor Magenta
    
    # Test build first
    Write-Host "Testing frontend build..." -ForegroundColor Yellow
    Set-Location frontend
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend build successful!" -ForegroundColor Green
        
        Write-Host "`nDeploying to Vercel..." -ForegroundColor Yellow
        vercel --prod
        
        Set-Location ..
    } else {
        Write-Host "❌ Frontend build failed. Fix errors before deploying." -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

function Deploy-Backend {
    Write-Host "`n⚙️ Deploying Backend...`n" -ForegroundColor Magenta
    
    # Test build first
    Write-Host "Testing backend build..." -ForegroundColor Yellow
    Set-Location backend
    
    Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
    
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend build successful!" -ForegroundColor Green
        
        Write-Host "`nDeploying to Vercel..." -ForegroundColor Yellow
        vercel --prod
        
        Set-Location ..
    } else {
        Write-Host "❌ Backend build failed. Fix errors before deploying." -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

function Show-GitHubDeployment {
    Write-Host "`n🌐 GitHub Integration Deployment`n" -ForegroundColor Magenta
    
    Write-Host "To deploy via GitHub:" -ForegroundColor Yellow
    Write-Host "1. Go to https://vercel.com/new" -ForegroundColor White
    Write-Host "2. Click 'Import Git Repository'" -ForegroundColor White
    Write-Host "3. Select 'SalwynC/ethical-shopping-platform'" -ForegroundColor White
    Write-Host "4. Configure:" -ForegroundColor White
    Write-Host "   - Root Directory: frontend/" -ForegroundColor Gray
    Write-Host "   - Build Command: npm run build" -ForegroundColor Gray
    Write-Host "   - Output Directory: .next" -ForegroundColor Gray
    Write-Host "5. Add Environment Variables (see VERCEL_DEPLOYMENT_GUIDE.md)" -ForegroundColor White
    Write-Host "6. Click 'Deploy'`n" -ForegroundColor White
    
    Write-Host "For backend, create a separate project with:" -ForegroundColor Yellow
    Write-Host "   - Root Directory: backend/" -ForegroundColor Gray
    Write-Host "   - Build Command: npm run build" -ForegroundColor Gray
    Write-Host "   - Output Directory: dist`n" -ForegroundColor Gray
}

switch ($choice) {
    "1" {
        Deploy-Frontend
    }
    "2" {
        Deploy-Backend
    }
    "3" {
        Deploy-Backend
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n⏳ Waiting 5 seconds before deploying frontend...`n" -ForegroundColor Yellow
            Start-Sleep -Seconds 5
            Deploy-Frontend
        }
    }
    "4" {
        Show-GitHubDeployment
    }
    "5" {
        Write-Host "`nExiting...`n" -ForegroundColor Gray
        exit 0
    }
    default {
        Write-Host "`n❌ Invalid option. Exiting.`n" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✅ Deployment process completed!`n" -ForegroundColor Green
Write-Host "📖 For more details, see VERCEL_DEPLOYMENT_GUIDE.md`n" -ForegroundColor Cyan
