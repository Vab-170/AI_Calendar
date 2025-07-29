// lib/api.ts
import { CalendarEvent } from './types';

export async function createEvent(eventData: CalendarEvent) {
  // Shared API logic for event creation
  // This can be used by both client and server components
  
  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to create event');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}