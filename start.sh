#!/bin/bash
# Railway startup script - builds frontend then starts backend

set -e

echo "🔨 Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

echo "🚀 Starting backend server..."
cd backend
python server.py
