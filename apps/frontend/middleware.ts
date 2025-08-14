import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  // _next, favicon, dosya uzantıları ve /api hariç
  matcher: ['/((?!_next|favicon.ico|.*\\..*|api).*)'],
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const path = url.pathname
  const token = req.cookies.get('access_token')?.value

  const isAuthRoute = path === '/login' || path === '/register'

  // Giriş yoksa -> /login
  if (!token && !isAuthRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Girişliyse ve /login|/register'a gelmişse -> /
  if (token && isAuthRoute) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
