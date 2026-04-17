import { NextRequest, NextResponse } from 'next/server';
import {
  defaultLocale,
  getDirection,
  isLocale,
  Locale,
} from '@/i18n/config';
import { updateSession } from '@/lib/supabase/proxy';

function getPreferredLocale(request: NextRequest): Locale {
  const pathnameLocale = request.nextUrl.pathname.split('/').filter(Boolean)[0];

  if (pathnameLocale && isLocale(pathnameLocale)) {
    return pathnameLocale;
  }

  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';

  if (acceptLanguage.includes('ar')) {
    return 'ar';
  }

  if (acceptLanguage.includes('fr')) {
    return 'fr';
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameSegments = pathname.split('/').filter(Boolean);
  const pathnameLocale = pathnameSegments[0];
  const locale = getPreferredLocale(request);

   if (pathname.startsWith('/auth')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', locale);
    requestHeaders.set('x-dir', getDirection(locale));

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.cookies.set('locale', locale, { path: '/' });
    return updateSession(request, requestHeaders, response);
  }

  if (!pathnameLocale || !isLocale(pathnameLocale)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('locale', locale, { path: '/' });
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', pathnameLocale);
  requestHeaders.set('x-dir', getDirection(pathnameLocale));

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set('locale', pathnameLocale, { path: '/' });
  return updateSession(request, requestHeaders, response);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
