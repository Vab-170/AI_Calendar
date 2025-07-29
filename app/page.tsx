// app/page.tsx
'use client';

import CalendarView from '@/components/Calendar';
import AIInput from '@/components/AI_Input';

export default function Home() {
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">🗓️ AI Calendar</h1>
      <AIInput />
      <CalendarView />
    </main>
  );
}
