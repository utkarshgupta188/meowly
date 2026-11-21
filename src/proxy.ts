import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isBlocked } from '@/lib/blocklist';

function isBlockedWatchPath(pathname: string): boolean {
  const match = pathname.match(/^\/watch\/(movie|tv)\/([^/]+)\/?$/i);
  if (!match) return false;

  try {
    return isBlocked(match[1].toLowerCase(), decodeURIComponent(match[2]));
  } catch {
    return false;
  }
}

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

  // Blocked titles must not be reachable. Rewriting to a route that does not
  // exist renders the 404 page and, unlike a page-level notFound() call, keeps
  // the real 404 HTTP status so search engines drop the URL.
  if (isBlockedWatchPath(request.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
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
