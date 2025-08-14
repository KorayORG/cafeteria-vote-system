// Simple telemetry for impressions and picks in vote flow
// Stores events in localStorage for later upload (if needed)

export type TelemetryEvent =
  | { type: 'impression'; date: string; shift: string; side: 'left'|'right'; week: string; timestamp: number }
  | { type: 'pick'; date: string; shift: string; side: 'left'|'right'; choice: 'traditional'|'alternative'; week: string; timestamp: number }

const KEY = 'telemetry-events';

export function logTelemetry(event: TelemetryEvent) {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    arr.push(event);
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch {}
}

export function getTelemetryEvents(): TelemetryEvent[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearTelemetryEvents() {
  localStorage.removeItem(KEY);
}
