#!/bin/bash

echo "🔧 Fixing Frontend..."

# Kill any running processes
pkill -f "vite" || true

# Clear cache
rm -rf node_modules/.vite
rm -rf frontend/.vite

# Reinstall if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Fixed! Now run: npm run frontend:dev"
