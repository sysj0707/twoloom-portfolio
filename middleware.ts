import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['ko', 'en'],

  // Used when no locale matches
  defaultLocale: 'ko',

  pathnames: {
    '/': '/',
    '/portfolio': '/portfolio',
    '/history': '/history',
    '/contact': '/contact'
  }
});

export default function middleware(request: NextRequest) {
  // Skip internationalization for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return;
  }
  
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for admin, api, static files
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)']
};