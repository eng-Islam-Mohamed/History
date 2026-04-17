'use client';

import Link from 'next/link';
import { BookOpen, Compass, LibraryBig } from 'lucide-react';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { localizePath } from '@/i18n/navigation';

export default function Footer() {
  const year = new Date().getFullYear();
  const { dictionary, locale } = useI18n();

  const footerLinks = [
    { href: '/', label: dictionary.nav.home },
    { href: '/search', label: dictionary.nav.search },
    { href: '/library', label: dictionary.nav.library },
  ];

  return (
    <footer className="mt-24 border-t border-white/8 px-4 pb-8 pt-10 md:px-6 md:pt-14">
      <div className="mx-auto max-w-7xl vault-frame rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div className="max-w-xl">
            <p className="font-[family-name:var(--font-headline)] text-3xl text-primary">
              {dictionary.common.brand}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-stone-400 md:text-base">
              {dictionary.footer.description}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
              {dictionary.footer.navigate}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={localizePath(locale, link.href)}
                  className="text-sm text-stone-300 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
              {dictionary.footer.experience}
            </p>
            <div className="mt-4 space-y-3 text-sm text-stone-300">
              <div className="flex items-center gap-3">
                <Compass size={16} className="text-primary/70" />
                {dictionary.footer.experienceItems[0]}
              </div>
              <div className="flex items-center gap-3">
                <BookOpen size={16} className="text-primary/70" />
                {dictionary.footer.experienceItems[1]}
              </div>
              <div className="flex items-center gap-3">
                <LibraryBig size={16} className="text-primary/70" />
                {dictionary.footer.experienceItems[2]}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/8 pt-6 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>{dictionary.footer.copyright.replace('{year}', String(year))}</p>
          <p>{dictionary.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
