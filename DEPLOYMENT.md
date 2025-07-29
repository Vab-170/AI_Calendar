# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Method 1: One-Click Deploy (Easiest)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import from GitHub
4. Select your `AI_Calendar` repository
5. Add environment variable: `OPENAI_API_KEY=your_api_key_here`
6. Click "Deploy" 

**Your app will be live at: `https://ai-calendar-yourusername.vercel.app`**

### Method 2: CLI Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy your project
vercel

# Follow prompts:
# - Project name: ai-calendar
# - Link to existing project? No
# - Directory: ./
# - Override settings? No

# Add environment variable
vercel env add OPENAI_API_KEY
# Enter your OpenAI API key when prompted

# Deploy to production
vercel --prod
```

## Environment Variables Required
- `OPENAI_API_KEY`: Your OpenAI API key

## What Vercel Will Handle
✅ **Frontend**: React components, pages, styling  
✅ **Backend**: API routes (`/api/openai`, `/api/events`)  
✅ **Build Process**: Next.js compilation and optimization  
✅ **Serverless Functions**: Auto-scaling API endpoints  
✅ **Global CDN**: Fast worldwide delivery  
✅ **HTTPS**: Automatic SSL certificates  

## Post-Deployment Checklist
- [ ] Test AI event creation
- [ ] Verify calendar display
- [ ] Check API endpoints work
- [ ] Test on mobile devices
- [ ] Share your live URL! 🎉

## Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Free SSL certificate automatically applied

## Monitoring & Analytics
- **Performance**: Built-in Vercel Analytics
- **Functions**: Serverless function logs
- **Errors**: Real-time error tracking
- **Usage**: Bandwidth and function execution stats
