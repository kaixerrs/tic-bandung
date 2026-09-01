import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

const intlMiddleware = createMiddleware({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  localePrefix: 'as-needed'
});

export default async function middleware(request: NextRequest) {
  // 1. Run Supabase auth middleware
  const supabaseResponse = await updateSession(request);
  
  // 2. Run next-intl routing middleware
  const intlResponse = intlMiddleware(request);

  // 3. Merge Supabase cookies/headers into the intl response
  supabaseResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
        intlResponse.headers.append(key, value);
    } else {
        intlResponse.headers.set(key, value);
    }
  });

  // 4. Append Security Headers
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    intlResponse.headers.set(key, value);
  });

  return intlResponse;
}

export const config = {
  matcher: ['/', '/(id|en)/:path*', '/((?!_next|_vercel|.*\\..*|admin|api).*)']
};
