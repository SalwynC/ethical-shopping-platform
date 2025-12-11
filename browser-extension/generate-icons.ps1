# Quick PNG Icon Generator using PowerShell
Add-Type -AssemblyName System.Drawing

$iconFolder = "D:\Projects Base Web Dev\Final YR New Project Idea\New_Scrapping_Project\ethical-shopping-platform\browser-extension\icons"

# Create 16x16 icon
$bmp16 = New-Object System.Drawing.Bitmap(16, 16)
$graphics16 = [System.Drawing.Graphics]::FromImage($bmp16)
$graphics16.Clear([System.Drawing.Color]::FromArgb(16, 185, 129))
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics16.FillEllipse($brush, 4, 4, 8, 8)
$graphics16.Dispose()
$bmp16.Save("$iconFolder\icon16.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp16.Dispose()

# Create 48x48 icon
$bmp48 = New-Object System.Drawing.Bitmap(48, 48)
$graphics48 = [System.Drawing.Graphics]::FromImage($bmp48)
$graphics48.Clear([System.Drawing.Color]::FromArgb(16, 185, 129))
$graphics48.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics48.FillEllipse($brush, 12, 12, 24, 24)
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(16, 185, 129), 3)
$graphics48.DrawLine($pen, 18, 24, 22, 28)
$graphics48.DrawLine($pen, 22, 28, 30, 20)
$pen.Dispose()
$graphics48.Dispose()
$bmp48.Save("$iconFolder\icon48.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp48.Dispose()

# Create 128x128 icon
$bmp128 = New-Object System.Drawing.Bitmap(128, 128)
$graphics128 = [System.Drawing.Graphics]::FromImage($bmp128)
$graphics128.Clear([System.Drawing.Color]::FromArgb(16, 185, 129))
$graphics128.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics128.FillEllipse($brush, 32, 32, 64, 64)
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(16, 185, 129), 8)
$graphics128.DrawLine($pen, 48, 64, 60, 76)
$graphics128.DrawLine($pen, 60, 76, 80, 52)
$pen.Dispose()
$graphics128.Dispose()
$bmp128.Save("$iconFolder\icon128.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp128.Dispose()

Write-Host "✅ Icons created successfully!" -ForegroundColor Green
Write-Host "   - icon16.png" -ForegroundColor Green
Write-Host "   - icon48.png" -ForegroundColor Green
Write-Host "   - icon128.png" -ForegroundColor Green
