@echo off
echo ===================================================
echo     STARTING SAUDI LEGAL AI - ENTERPRISE EDITION
echo ===================================================

echo [1/3] Starting Backend Server (Port 8000)...
start "SaudiAI Backend" cmd /k "cd backend && ..\.venv_backend\Scripts\activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo [2/3] Starting Frontend App (Port 3000)...
start "SaudiAI Frontend" cmd /k "cd frontend && npm run dev"

echo [3/3] Launching Control Center...
timeout /t 5 >nul
start http://localhost:3000

echo.
echo ===================================================
echo     SYSTEM IS LIVE!
echo     Frontend: http://localhost:3000
echo     Backend:  http://localhost:8000
echo ===================================================
echo.
echo Press any key to stop...
pause
