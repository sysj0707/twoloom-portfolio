import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['ko', 'en'],

  // Used when no locale matches
  defaultLocale: 'ko',

  // Don't apply locale routing to admin routes
  pathnames: {
    '/': '/',
    '/portfolio': '/portfolio',
    '/history': '/history',
    '/contact': '/contact'
  }
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ko|en)/:path*', '/((?!api|admin|_next|_vercel|.*\\..*).*)']
};