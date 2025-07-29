# 🗓️ AI Calendar

A minimalist, beautifully designed AI-powered calendar web app.  
Create, reschedule, and summarize your events using natural language — powered by OpenAI.

## ✨ Features

- 🧠 **Natural Language Input**  
  Add events like: `"Dinner with Sarah next Friday at 7pm"`  
  Let AI parse it into a calendar entry automatically.

- 📆 **Minimal & Functional UI**  
  Built with Tailwind and React. Inspired by tools like Notion, Cron, and Linear.

- 🔁 **Smart Rescheduling**  
  Move meetings or blocks using simple prompts:  
  _“Move all meetings to next Thursday”_

- 📋 **Daily & Weekly Summaries**  
  Let the AI generate readable overviews of your schedule.

## ⚙️ Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Calendar UI**: react-big-calendar
- **Backend**: Next.js API Routes
- **Database**: SQLite or Supabase (configurable)
- **AI Integration**: OpenAI GPT-4 (function calling)
- **Auth**: NextAuth or Clerk (plug-and-play)

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/ai-calendar.git
cd ai-calendar

# Install dependencies
pnpm install   # or npm install / yarn install

# Start the dev server
pnpm dev       # or npm run dev