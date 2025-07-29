// app/api/openai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const tools = [
    {
      type: 'function' as const,
      function: {
        name: 'createEvent',
        description: 'Create a calendar event',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' },
          },
          required: ['title', 'start', 'end'],
        },
      },
    },
  ];

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    tools,
    tool_choice: 'auto',
  });

  const toolCall = chat.choices[0].message.tool_calls?.[0];
  if (!toolCall) return NextResponse.json({ error: 'No function call' }, { status: 400 });

  const eventData = JSON.parse(toolCall.function.arguments || '{}');

  // Save to DB (mocked for now)
  const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  return NextResponse.json(eventData);
}
