import { defaultLocale, isLocale, Locale } from '@/i18n/config';

export function localizePath(locale: Locale, path = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}

export function stripLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (!firstSegment || !isLocale(firstSegment)) {
    return pathname || '/';
  }

  const rest = segments.slice(1).join('/');
  return rest ? `/${rest}` : '/';
}

export function extractLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return firstSegment && isLocale(firstSegment) ? firstSegment : defaultLocale;
}

export function replacePathLocale(pathname: string, locale: Locale): string {
  return localizePath(locale, stripLocaleFromPath(pathname));
}
