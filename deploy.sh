#!/bin/bash
set -e

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
# Apply new Prisma migrations before the API starts using the new fields.
npx prisma migrate deploy
# Force a fresh client — a stale generated client makes new models invisible to tsc.
rm -rf node_modules/.prisma/client
npx prisma generate
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
# 'reload' is better than 'restart' as it starts new processes before killing old ones.
# Use the ecosystem file (not 'pm2 reload all') so changed env values are picked up.
echo "♻️ Reloading applications with PM2..."
pm2 startOrReload ecosystem.config.js --update-env

# 5. Save PM2 state
pm2 save

echo "✅ Deployment Successful and Apps are running!"
