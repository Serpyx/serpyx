@echo off
echo ========================================
echo    Serpyx Development Server
echo ========================================
echo.
echo Starting server in continuous mode...
echo This will keep the server running and auto-restart.
echo Press Ctrl+C to stop the server.
echo.
echo Server will be available at: http://localhost:3000
echo.
cd client
npm run dev:continuous
pause
