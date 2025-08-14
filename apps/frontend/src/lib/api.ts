export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type Opts = RequestInit & { body?: any };

/** JSON body + cookie ile istek atar. */
export async function api(path: string, opts: Opts = {}) {
  const headers: HeadersInit = {
    ...(opts.headers || {}),
  };
  if (opts.body && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...opts,
    headers,
    body:
      opts.body && !(opts.body instanceof FormData)
        ? JSON.stringify(opts.body)
        : (opts.body as any),
  });
  return res;
}

/** GET + JSON parse. Hataları yutmaz. */
export async function getJSON<T = any>(path: string) {
  const res = await api(path);
  const data = await res.json();
  if (!res.ok) throw new Error((data && data.message) || 'İstek başarısız');
  return data as T;
}

/** ISO hafta kodu: 2025-W33 gibi */
export function isoWeekOf(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  const week = String(weekNo).padStart(2, '0');
  return `${date.getUTCFullYear()}-W${week}`;
}
