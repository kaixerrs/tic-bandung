import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  localePrefix: 'as-needed' // Only adds /en prefix, keeps / as id
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(id|en)/:path*', '/((?!_next|_vercel|.*\\..*|admin|api).*)']
};
