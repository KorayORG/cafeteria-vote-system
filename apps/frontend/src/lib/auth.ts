// Frontend -> Backend kimlik kontrol yardımcıları

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function fetchMe() {
  const res = await fetch(`${BASE}/auth/me`, {
    credentials: 'include',
    cache: 'no-store',
  })
  if (!res.ok) return { ok: false }
  const data = await res.json().catch(() => ({}))
  return { ok: true, user: data.user }
}

export async function hasUsers() {
  const res = await fetch(`${BASE}/auth/has-users`, {
    cache: 'no-store',
  })
  if (!res.ok) return true // emin olamıyorsak login moduna düşelim
  const data = await res.json().catch(() => ({ hasUsers: true }))
  return !!data.hasUsers
}
