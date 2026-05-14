#!/bin/bash

# Zero-Downtime Deployment Script for Imperial Academy
# Usage: ./deploy.sh

echo "🚀 Starting Zero-Downtime Deployment..."

# 1. Pull latest code from GitHub
echo "📥 Pulling latest changes..."
git pull origin main

# 2. Update Backend
echo "📦 Updating Backend dependencies..."
cd backend
npm install
npm run build
cd ..

# 3. Update Frontend
echo "🏗️ Building Frontend (Next.js)..."
cd frontend
npm install
# Build first - this ensures the new version is ready before we reload
npm run build
cd ..

# 4. Zero-Downtime Reload with PM2
# 'reload' is better than 'restart' as it starts new processes before killing old ones
echo "♻️ Reloading applications with PM2..."
pm2 reload all --update-env

# 5. Save PM2 state
pm2 save

echo "✅ Deployment Successful and Apps are running!"
