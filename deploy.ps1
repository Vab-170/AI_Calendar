# 🚀 AI Calendar - Vercel Deployment Script (PowerShell)
# This script prepares and deploys your AI Calendar to Vercel

Write-Host "🗓️ AI Calendar - Vercel Deployment" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this from your project root." -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check for environment variables
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Warning: .env.local not found." -ForegroundColor Yellow
    Write-Host "📝 Please create .env.local with your OPENAI_API_KEY before deploying." -ForegroundColor Yellow
    Write-Host "   Example: OPENAI_API_KEY=sk-your-api-key-here" -ForegroundColor Gray
    Write-Host ""
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

# Run build to check for errors
Write-Host "🔨 Building project..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "📱 Your AI Calendar is now live!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. 🔑 Add OPENAI_API_KEY in Vercel dashboard if not done already" -ForegroundColor White
Write-Host "2. 🧪 Test your live app" -ForegroundColor White
Write-Host "3. 📱 Share your URL with friends!" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Blue
Write-Host "📚 Need help? Check DEPLOYMENT.md" -ForegroundColor Blue
