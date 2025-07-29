#!/bin/bash

# 🚀 AI Calendar - Vercel Deployment Script
# This script prepares and deploys your AI Calendar to Vercel

echo "🗓️ AI Calendar - Vercel Deployment"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from your project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check for environment variables
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found."
    echo "📝 Please create .env.local with your OPENAI_API_KEY before deploying."
    echo "   Example: OPENAI_API_KEY=sk-your-api-key-here"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "📱 Your AI Calendar is now live!"
echo ""
echo "Next steps:"
echo "1. 🔑 Add OPENAI_API_KEY in Vercel dashboard if not done already"
echo "2. 🧪 Test your live app"
echo "3. 📱 Share your URL with friends!"
echo ""
echo "🔧 Vercel Dashboard: https://vercel.com/dashboard"
echo "📚 Need help? Check DEPLOYMENT.md"
