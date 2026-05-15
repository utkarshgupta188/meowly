import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host');

  // Check if hostname exists and starts with www.
  if (hostname && hostname.startsWith('www.')) {
    const newHostname = hostname.replace(/^www\./, '');
    const url = request.nextUrl.clone();
    
    // Construct the redirect URL
    const redirectUrl = new URL(url.pathname + url.search, `https://${newHostname}`);
    
    return NextResponse.redirect(redirectUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
