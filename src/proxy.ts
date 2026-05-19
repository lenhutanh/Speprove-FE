import route from '@/routes'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { storageKeys } from './constants'
import { routing } from './i18n/routing'

const publicPaths = [route.login, route.register, route.verifyOtp]
const privatePaths = [route.account, route.resetPassword, route.payment]

const intlMiddleware = createMiddleware(routing)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Run next-intl middleware first to handle locale
  const response = intlMiddleware(request)

  // If next-intl wants to redirect (e.g. adding/removing locale prefix), do it
  if (response.status === 307 || response.status === 308) {
    return response
  }

  // 2. Custom Auth Logic
  const hasSession = request.cookies.has(storageKeys.ACCESS_TOKEN)

  // Remove locale prefix from pathname for easier matching using routing.locales
  const localePattern = `^\\/(?:${routing.locales.join('|')})(?=\\/|$)`
  const pathnameWithoutLocale =
    pathname.replace(new RegExp(localePattern), '') || '/'

  const isProtectedRoute = privatePaths.some((path) =>
    pathnameWithoutLocale.startsWith(path),
  )
  const isAuthRoute = publicPaths.some((path) =>
    pathnameWithoutLocale.startsWith(path),
  )

  const locale =
    request.cookies.get('NEXT_LOCALE')?.value || routing.defaultLocale

  if (isProtectedRoute && !hasSession) {
    // If it's the default locale and prefix is 'as-needed', don't add prefix
    const prefix =
      routing.localePrefix === 'as-needed' && locale === routing.defaultLocale
        ? ''
        : `/${locale}`
    const url = new URL(`${prefix}${route.login}`, request.url)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && hasSession) {
    const prefix =
      routing.localePrefix === 'as-needed' && locale === routing.defaultLocale
        ? ''
        : `/${locale}`
    const url = new URL(`${prefix}${route.home}`, request.url)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|otf|webmanifest)).*)',
    '/user/:path*',
    '/',
    '/user',
  ],
}

export default proxy
