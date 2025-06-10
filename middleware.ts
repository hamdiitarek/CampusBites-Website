import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // If already on a language route, continue
  if (pathname.startsWith('/en') || pathname.startsWith('/ar')) {
    return NextResponse.next();
  }

  // For root path, check Accept-Language header or default to English
  if (pathname === '/') {
    const acceptLanguage = request.headers.get('Accept-Language') || '';
    const preferredLanguage = acceptLanguage.includes('ar') ? 'ar' : 'en';
    
    // Check for saved language preference in cookies
    const savedLanguage = request.cookies.get('campusbites-language')?.value as 'en' | 'ar';
    const targetLanguage = savedLanguage || preferredLanguage;
    
    const response = NextResponse.redirect(new URL(`/${targetLanguage}`, request.url));
    
    // Set cookie if not already set
    if (!savedLanguage) {
      response.cookies.set('campusbites-language', targetLanguage, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax'
      });
    }
    
    return response;
  }

  // For other paths, redirect to English version
  return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
