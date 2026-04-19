export const locales = ['en', 'fr', 'ar'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeMeta: Record<
  Locale,
  { label: string; nativeLabel: string; dir: 'ltr' | 'rtl' }
> = {
  en: { label: 'English', nativeLabel: 'English', dir: 'ltr' },
  fr: { label: 'French', nativeLabel: 'Français', dir: 'ltr' },
  ar: { label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return localeMeta[locale].dir;
}

export function getLocaleLabel(locale: Locale): string {
  return localeMeta[locale].nativeLabel;
}
