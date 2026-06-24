@echo off
echo Starting SynergyBeam ERP...
echo.
echo Step 1: Starting Backend on port 5000
start "SynergyBeam Backend" cmd /k "cd backend && venv\Scripts\activate && python app.py"
timeout /t 4 /nobreak > nul
echo Step 2: Starting Frontend on port 5173
start "SynergyBeam Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo ==========================================
echo Backend:  http://localhost:5000/api/health
echo Frontend: http://localhost:5173
echo Login:    admin@synergybeam.com / Admin@123
echo ==========================================
