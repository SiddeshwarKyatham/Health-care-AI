# PowerShell Startup Launcher for CDSS Application
$rootDir = $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting Clinical Decision Support System (5-Agent CDSS)" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\backend'; uvicorn app.main:app --reload --port 8000"

Write-Host "[2/2] Launching Next.js Frontend on http://localhost:3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\frontend'; npm run dev"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Both services have been launched in separate terminals!" -ForegroundColor Green
Write-Host "  • Frontend UI:       http://localhost:3000" -ForegroundColor BrightWhite
Write-Host "  • Backend API Docs:  http://localhost:8000/docs" -ForegroundColor BrightWhite
Write-Host "==========================================================" -ForegroundColor Cyan
