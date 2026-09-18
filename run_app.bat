@echo off
title Clinical Decision Support System — Startup Launcher
echo ==========================================================
echo   Starting Clinical Decision Support System (5-Agent CDSS)
echo ==========================================================
echo.

echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "CDSS FastAPI Backend (Port 8000)" cmd /k "cd /d "%~dp0backend" && uvicorn app.main:app --reload --port 8000"

echo [2/2] Launching Next.js Frontend on http://localhost:3000 ...
start "CDSS Next.js Frontend (Port 3000)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ==========================================================
echo   Both services are starting in separate terminal windows!
echo   • Frontend UI:       http://localhost:3000
echo   • Backend API Docs:  http://localhost:8000/docs
echo ==========================================================
echo.
pause
