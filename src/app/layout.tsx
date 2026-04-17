import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';
import { defaultLocale, getDirection, isLocale } from '@/i18n/config';

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

const headlineFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'ChronoLivre | AI History Research Library',
  description:
    'Explore civilizations, wars, empires, and historical figures through a refined AI-powered history research experience.',
  keywords:
    'history, AI, historical research, civilizations, empires, wars, historical figures, timeline',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get('x-locale') ?? defaultLocale;
  const locale = isLocale(headerLocale) ? headerLocale : defaultLocale;
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${bodyFont.variable} ${headlineFont.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-surface text-on-surface">
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}
