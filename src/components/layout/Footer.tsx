'use client';

import Link from 'next/link';
import { BookOpen, Compass, LibraryBig } from 'lucide-react';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getExperienceCopy } from '@/i18n/experience-copy';
import { localizePath } from '@/i18n/navigation';

export default function Footer() {
  const year = new Date().getFullYear();
  const { dictionary, locale } = useI18n();
  const copy = getExperienceCopy(locale);
  const featureIcons = [Compass, BookOpen, LibraryBig];

  const footerLinks = [
    { href: '/', label: dictionary.nav.home },
    { href: '/search', label: dictionary.nav.search },
    { href: '/library', label: dictionary.nav.library },
    { href: '/compare', label: copy.pages.compare },
    { href: '/timeline', label: copy.pages.timeline },
    { href: '/map', label: copy.pages.map },
    { href: '/paths', label: copy.pages.paths },
    { href: '/collections', label: copy.pages.collections },
  ];

  return (
    <footer className="mt-24 border-t border-white/8 px-4 pb-8 pt-10 md:px-6 md:pt-14">
      <div className="mx-auto max-w-7xl vault-frame rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr_280px]">
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
            <div className="mt-4 grid grid-cols-2 gap-3">
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
            <div className="mt-4 grid gap-3">
              {copy.footer.featureCards.map((item, index) => {
                const Icon = featureIcons[index];

                return (
                  <div
                    key={item}
                    className={`footer-feature-card footer-feature-card--${index + 1}`}
                  >
                    <span className="footer-feature-card__orbit" />
                    <span className="footer-feature-card__line" />
                    <div className="footer-feature-card__icon">
                      <Icon size={16} />
                    </div>
                    <p className="footer-feature-card__label">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:justify-self-end">
            <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
              {copy.footer.socials}
            </p>
            <div className="mt-4 flex justify-center lg:justify-end">
              <div className="social-card">
                <div className="social-card__background" />
                <div className="social-card__halo" />
                <div className="social-card__logo">{copy.footer.socials}</div>
                <div className="social-card__arch" />
                <div className="social-card__column">
                  <a
                    href="https://www.instagram.com/isla4a4m____/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="social-card__button social-card__button--instagram"
                  >
                    <span className="social-card__button-glow" />
                    <span className="social-card__icon">
                      <svg
                        viewBox="0 0 30 30"
                        xmlns="http://www.w3.org/2000/svg"
                        className="social-card__svg"
                      >
                        <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
                      </svg>
                    </span>
                  </a>

                  <a
                    href="https://github.com/eng-Islam-Mohamed"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="social-card__button social-card__button--github"
                  >
                    <span className="social-card__button-glow" />
                    <span className="social-card__icon">
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="social-card__svg"
                      >
                        <path d="M12 .5C5.649.5.5 5.8.5 12.35c0 5.243 3.292 9.691 7.86 11.26.575.11.785-.255.785-.567 0-.28-.01-1.022-.016-2.007-3.198.712-3.872-1.588-3.872-1.588-.523-1.37-1.278-1.734-1.278-1.734-1.045-.733.08-.718.08-.718 1.156.084 1.764 1.223 1.764 1.223 1.028 1.81 2.698 1.288 3.354.985.103-.765.402-1.288.73-1.584-2.553-.298-5.238-1.31-5.238-5.832 0-1.288.447-2.342 1.18-3.168-.119-.3-.512-1.506.112-3.139 0 0 .963-.316 3.154 1.21a10.688 10.688 0 0 1 5.744 0c2.19-1.526 3.152-1.21 3.152-1.21.626 1.633.233 2.839.115 3.14.735.825 1.179 1.88 1.179 3.167 0 4.533-2.689 5.53-5.251 5.822.413.366.78 1.09.78 2.197 0 1.586-.015 2.865-.015 3.255 0 .315.207.683.79.566 4.564-1.571 7.854-6.018 7.854-11.26C23.5 5.8 18.351.5 12 .5Z" />
                      </svg>
                    </span>
                  </a>

                  <a
                    href="https://www.facebook.com/islam.mohamed.966245?locale=fr_FR"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="social-card__button social-card__button--facebook"
                  >
                    <span className="social-card__button-glow" />
                    <span className="social-card__icon">
                      <svg
                        viewBox="0 0 320 512"
                        xmlns="http://www.w3.org/2000/svg"
                        className="social-card__svg"
                      >
                        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H297V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                      </svg>
                    </span>
                  </a>
                </div>
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
