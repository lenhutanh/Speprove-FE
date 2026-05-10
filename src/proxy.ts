import route from '@/routes'
import { NextRequest, NextResponse } from 'next/server'
import { storageKeys } from './constants'

const publicPaths = ['/login', '/register', '/verify-otp']
const privatePaths = ['/user', '/change-password', '/payment']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasSession = request.cookies.has(storageKeys.ACCESS_TOKEN)

  const isProtectedRoute = privatePaths.some((path) =>
    pathname.startsWith(path),
  )
  const isAuthRoute = publicPaths.some((path) => pathname.startsWith(path))

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL(route.login, request.url))
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL(route.home, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/user/:path*',
    '/',
    '/user',
  ],
}
