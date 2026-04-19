'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/config';
import { localizePath } from '@/i18n/navigation';

interface SearchCtaButtonProps {
  label: string;
  locale: Locale;
}

export default function SearchCtaButton({
  label,
  locale,
}: SearchCtaButtonProps) {
  const isRtl = locale === 'ar';

  return (
    <Link
      href={localizePath(locale, '/search')}
      aria-label={label}
      className="search-cta hidden shrink-0 md:grid"
    >
      {Array.from({ length: 15 }).map((_, index) => (
        <span
          // 15 hover zones to move the glow around the button face.
          key={index}
          className="search-cta__area"
          aria-hidden="true"
        />
      ))}

      <span className="search-cta__body">
        <span className="search-cta__base" aria-hidden="true" />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 52 42"
          height="24"
          width="48"
          className="search-cta__filament"
          aria-hidden="true"
        >
          <path
            strokeWidth="3"
            stroke="var(--search-cta-filament)"
            d="M1 11.5153C10.1667 12.6819 30.7 14.8153 39.5 14.0153C48.3 13.2153 50.1667 10.3486 50 9.01525C49.8333 6.84859 48.6 2.41525 45 2.01525C41.4 1.61525 39.8333 9.18192 39.5 13.0153V29.5153C39.5 32.5153 42 40.0153 45 40.0153C48 40.0153 50 37.5153 50 35.5153C50 33.5153 47.7 29.0153 38.5 27.0153C29.3 25.0153 9.66667 27.8486 1 29.5153"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 42"
          height="24"
          width="48"
          className="search-cta__filament search-cta__filament--glow"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="searchCtaStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--search-cta-filament)" />
              <stop offset="100%" stopColor="var(--search-cta-filament)" />
            </linearGradient>
          </defs>
          <path d="M1 11.5153C10.1667 12.6819 30.7 14.8153 39.5 14.0153C48.3 13.2153 50.1667 10.3486 50 9.01525C49.8333 6.84859 48.6 2.41525 45 2.01525C41.4 1.61525 39.8333 9.18192 39.5 13.0153V29.5153C39.5 32.5153 42 40.0153 45 40.0153C48 40.0153 50 37.5153 50 35.5153C50 33.5153 47.7 29.0153 38.5 27.0153C29.3 25.0153 9.66667 27.8486 1 29.5153" />
        </svg>

        <span className="search-cta__glow" aria-hidden="true" />

        <span className="search-cta__marquee" aria-hidden="true">
          <span className="search-cta__marquee-track">
            {Array.from({ length: 5 }).map((_, index) => (
              <svg
                key={`a-${index}`}
                viewBox="0 0 16 16"
                className="search-cta__lightning"
                fill="var(--search-cta-glow)"
                height="14"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
              </svg>
            ))}
          </span>
          <span className="search-cta__marquee-track">
            {Array.from({ length: 5 }).map((_, index) => (
              <svg
                key={`b-${index}`}
                viewBox="0 0 16 16"
                className="search-cta__lightning"
                fill="var(--search-cta-glow)"
                height="14"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
              </svg>
            ))}
          </span>
        </span>

        <span className={`search-cta__text${isRtl ? ' search-cta__text--static' : ''}`}>
          {isRtl
            ? label
            : label.split('').map((character, index) => {
                const characterStyle = {
                  '--i': index,
                } as CSSProperties;

                return (
                  <span
                    key={`${character}-${index}`}
                    style={characterStyle}
                  >
                    {character === ' ' ? '\u00A0' : character}
                  </span>
                );
              })}
        </span>
      </span>
    </Link>
  );
}
