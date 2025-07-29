// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';

let EVENTS: any[] = [];

export async function GET() {
  return NextResponse.json(EVENTS);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  EVENTS.push({ ...data, start: new Date(data.start), end: new Date(data.end) });
  return NextResponse.json({ status: 'ok' });
}
