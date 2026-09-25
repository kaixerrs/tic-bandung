import { type NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // 1. Run Supabase auth middleware
  const response = await updateSession(request);
  
  // 2. Append Security Headers
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    // We use a more permissive CSP for admin because it has rich text editors (Froala/Tiptap) and inline styles
    'Content-Security-Policy': `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:;`,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  response.headers.delete("X-Powered-By");

  return response;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*|api).*)']
};
