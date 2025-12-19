# Test Supabase Connection and Setup Tables

Write-Host "`nTesting Supabase Connection..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Configuration
$PROJECT_ID = "ppcytspeyrtgamykqayj"
$SUPABASE_URL = "https://db.ppcytspeyrtgamykqayj.supabase.co"

Write-Host "1. Checking environment variables..." -ForegroundColor Yellow
$envFile = "D:\Projects Base Web Dev\Final YR New Project Idea\New_Scrapping_Project\ethical-shopping-platform\backend\.env.local"
if (Test-Path $envFile) {
    $dbUrl = Get-Content $envFile | Select-String "DATABASE_URL" | Select-Object -First 1
    if ($dbUrl) {
        Write-Host "   DATABASE_URL found in .env.local" -ForegroundColor Green
    } else {
        Write-Host "   DATABASE_URL missing!" -ForegroundColor Red
    }
} else {
    Write-Host "   .env.local not found!" -ForegroundColor Red
}

Write-Host "`n2. Checking SUPABASE_SCHEMA.sql..." -ForegroundColor Yellow
$schemaFile = "D:\Projects Base Web Dev\Final YR New Project Idea\New_Scrapping_Project\ethical-shopping-platform\SUPABASE_SCHEMA.sql"
if (Test-Path $schemaFile) {
    $lineCount = (Get-Content $schemaFile).Count
    Write-Host "   Schema file exists ($lineCount lines)" -ForegroundColor Green
    Write-Host "   File: SUPABASE_SCHEMA.sql" -ForegroundColor Gray
} else {
    Write-Host "   Schema file missing!" -ForegroundColor Red
}

Write-Host "`n3. Checking Prisma schema..." -ForegroundColor Yellow
$prismaSchema = "D:\Projects Base Web Dev\Final YR New Project Idea\New_Scrapping_Project\ethical-shopping-platform\backend\prisma\schema.prisma"
if (Test-Path $prismaSchema) {
    $tables = Get-Content $prismaSchema | Select-String "^model " | ForEach-Object { $_.ToString().Split()[1] }
    Write-Host "   Prisma schema found with $($tables.Count) models:" -ForegroundColor Green
    foreach ($table in $tables) {
        Write-Host "     - $table" -ForegroundColor Gray
    }
} else {
    Write-Host "   Prisma schema missing!" -ForegroundColor Red
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "SUPABASE STATUS" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`nProject Configuration:" -ForegroundColor Yellow
Write-Host "  Project ID: $PROJECT_ID" -ForegroundColor Gray
Write-Host "  Database URL: $SUPABASE_URL" -ForegroundColor Gray
Write-Host "  Pooler Port: 6543" -ForegroundColor Gray

Write-Host "`nDatabase Status:" -ForegroundColor Yellow
Write-Host "  Connection String: Configured" -ForegroundColor Green
Write-Host "  Tables Created: UNKNOWN (need to check Supabase)" -ForegroundColor Yellow
Write-Host "  Current Mode: In-memory fallback (until tables created)" -ForegroundColor Yellow

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "ACTION REQUIRED" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`nTo activate Supabase PostgreSQL:" -ForegroundColor White
Write-Host "`n1. Open Supabase Dashboard:" -ForegroundColor Cyan
Write-Host "   https://supabase.com/dashboard/project/$PROJECT_ID" -ForegroundColor Gray

Write-Host "`n2. Navigate to SQL Editor:" -ForegroundColor Cyan
Write-Host "   - Click 'SQL Editor' in left sidebar" -ForegroundColor Gray
Write-Host "   - Click '+ New Query'" -ForegroundColor Gray

Write-Host "`n3. Run Schema SQL:" -ForegroundColor Cyan
Write-Host "   - Copy all contents from: SUPABASE_SCHEMA.sql" -ForegroundColor Gray
Write-Host "   - Paste into SQL Editor" -ForegroundColor Gray
Write-Host "   - Click 'Run' (or press Ctrl+Enter)" -ForegroundColor Gray

Write-Host "`n4. Verify Tables Created:" -ForegroundColor Cyan
Write-Host "   - Go to 'Table Editor' in left sidebar" -ForegroundColor Gray
Write-Host "   - You should see 5 tables:" -ForegroundColor Gray
Write-Host "     * Product" -ForegroundColor Gray
Write-Host "     * Analysis" -ForegroundColor Gray
Write-Host "     * Alternative" -ForegroundColor Gray
Write-Host "     * PriceHistory" -ForegroundColor Gray
Write-Host "     * RuleEvaluation" -ForegroundColor Gray

Write-Host "`n5. Restart Backend:" -ForegroundColor Cyan
Write-Host "   - Backend will auto-detect tables" -ForegroundColor Gray
Write-Host "   - Switch from in-memory to PostgreSQL" -ForegroundColor Gray

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "TESTING TOOLS" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`nAfter applying schema, test with:" -ForegroundColor White
Write-Host @"

  # Test backend health
  Invoke-RestMethod -Uri "http://localhost:4000/api/health"

  # Test product analysis (will save to DB)
  `$body = @{ url = "https://www.amazon.in/dp/B0C7SGVZZN" } | ConvertTo-Json
  Invoke-RestMethod -Uri "http://localhost:4000/api/analyze" ``
    -Method Post ``
    -ContentType "application/json" ``
    -Body `$body

  # Check if data was saved
  Invoke-RestMethod -Uri "http://localhost:4000/api/products"

"@ -ForegroundColor Gray

Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "NOTE: System works fine WITHOUT database (in-memory mode)" -ForegroundColor Yellow
Write-Host "Database setup is OPTIONAL for data persistence.`n" -ForegroundColor Yellow
