Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Serpyx Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server in continuous mode..." -ForegroundColor Green
Write-Host "This will keep the server running and auto-restart." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host ""

Set-Location -Path "client"
npm run dev:continuous
