@echo off
echo ===================================================
echo     STARTING SAUDI LEGAL AI - ENTERPRISE EDITION
echo ===================================================

echo [1/2] Starting Backend Server (Port 8000)...
start "SaudiAI Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo [2/2] Starting Frontend App (Port 3000)...
start "SaudiAI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo     SYSTEM IS RUNNING!
echo     Frontend: http://localhost:3000
echo     Backend:  http://localhost:8000
echo ===================================================
echo.
echo Please allow a few seconds for servers to boot up...
pause
