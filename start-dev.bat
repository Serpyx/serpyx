@echo off
echo 🐍 Serpyx Development Server Starting...
echo.

echo 📦 Installing dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Server dependencies installation failed
    pause
    exit /b 1
)

cd ../client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Client dependencies installation failed
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.

echo 🚀 Starting development servers...
echo.

echo 📡 Starting Server (Port 5000)...
start "Serpyx Server" cmd /k "cd server && npm start"

echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak > nul

echo 🌐 Starting Client (Port 3000)...
start "Serpyx Client" cmd /k "cd client && npm run dev"

echo.
echo 🎉 Development servers started!
echo.
echo 📱 Client: http://localhost:3000
echo 📡 Server: http://localhost:5000
echo.
echo 💡 Press any key to open the application...
pause > nul

start http://localhost:3000

echo.
echo 🐍 Serpyx is ready to play!
echo.
pause
