import { notFound } from 'next/navigation';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import { getDirection, isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getCurrentAuthState } from '@/lib/researches/server';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const { profile, user } = await getCurrentAuthState();

  return (
    <AuthProvider initialProfile={profile} initialUser={user}>
      <LocaleProvider
        dictionary={getDictionary(locale)}
        dir={getDirection(locale)}
        locale={locale}
      >
        {children}
      </LocaleProvider>
    </AuthProvider>
  );
}
