const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
type Opts = { method?: string; body?: unknown; headers?: Record<string, string> }

export const api = (path: string, opts: Opts = {}) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
  return fetch(`${BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: 'include',
  })
}
