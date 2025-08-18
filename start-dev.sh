#!/bin/bash

echo "🐍 Serpyx Development Server Starting..."
echo

echo "📦 Installing dependencies..."

# Install server dependencies
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Server dependencies installation failed"
    exit 1
fi

# Install client dependencies
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Client dependencies installation failed"
    exit 1
fi

echo
echo "✅ Dependencies installed successfully!"
echo

echo "🚀 Starting development servers..."
echo

# Start server in background
echo "📡 Starting Server (Port 5000)..."
cd ../server
npm start &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Start client in background
echo "🌐 Starting Client (Port 3000)..."
cd ../client
npm run dev &
CLIENT_PID=$!

echo
echo "🎉 Development servers started!"
echo
echo "📱 Client: http://localhost:3000"
echo "📡 Server: http://localhost:5000"
echo
echo "💡 Press Ctrl+C to stop all servers..."

# Function to cleanup on exit
cleanup() {
    echo
    echo "🛑 Stopping servers..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
