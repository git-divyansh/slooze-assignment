import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login']

export function proxy(req) {
  const { pathname } = req.nextUrl

  // ✅ Never gate API routes (otherwise /api/* will redirect to /login)
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // ✅ Allow the login page (and anything under it if you add subroutes later)
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
  if (isPublic) return NextResponse.next()

  // ✅ Gate everything else
  const token = req.cookies.get('session')?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match everything except Next internals/static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
