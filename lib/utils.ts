// lib/utils.ts
export function formatDateForAPI(date: Date): string {
  return date.toISOString();
}