'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CoverTheme, TopicCategory } from '@/types';
import { getCoverStyle, cn } from '@/lib/utils';

interface HistoricalVisualCardProps {
  title: string;
  summary: string;
  era: string;
  category: TopicCategory | string;
  coverTheme: CoverTheme;
  href?: string;
  meta?: string;
  className?: string;
}

const coverPatterns: Record<CoverTheme, string> = {
  'ancient-sand':
    'radial-gradient(circle at 18% 16%, rgba(255,255,255,0.18) 0%, transparent 24%), repeating-linear-gradient(0deg, rgba(24,18,12,0.12) 0 2px, transparent 2px 10px)',
  'bronze-civilization':
    'radial-gradient(circle at 50% 0%, rgba(255,220,168,0.12) 0%, transparent 34%), linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
  'emerald-dynasty':
    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 36%), radial-gradient(circle at 86% 18%, rgba(126,207,160,0.25) 0%, transparent 24%)',
  'imperial-navy':
    'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 20%), radial-gradient(circle at 15% 18%, rgba(222,195,149,0.18) 0%, transparent 26%)',
  'midnight-scholar':
    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%), radial-gradient(circle at 18% 18%, rgba(139,184,232,0.16) 0%, transparent 28%)',
  'obsidian-industrial':
    'radial-gradient(circle at 50% 50%, rgba(184,115,51,0.16) 0%, transparent 40%), linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
  'oxblood-war':
    'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 32%), radial-gradient(circle at 82% 16%, rgba(248,182,178,0.18) 0%, transparent 24%)',
  'royal-purple':
    'radial-gradient(circle at 22% 18%, rgba(196,160,232,0.16) 0%, transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 24%)',
};

export default function HistoricalVisualCard({
  title,
  summary,
  era,
  category,
  coverTheme,
  href,
  meta,
  className,
}: HistoricalVisualCardProps) {
  const style = getCoverStyle(coverTheme);
  const categoryLabel = String(category).replace(/-/g, ' ');

  const content = (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_24%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.34))]" />
      <div className="relative z-10 flex h-full min-h-[16rem] flex-col justify-between gap-8">
        <div className="max-w-[26rem]">
          <p
            className="text-[10px] uppercase tracking-[0.32em]"
            style={{ color: `${style.accentColor}B8` }}
          >
            {categoryLabel} / {era}
          </p>
          <h3
            className="mt-4 font-[family-name:var(--font-headline)] text-3xl leading-tight"
            style={{ color: style.textColor }}
          >
            {title}
          </h3>
          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-white/72">
            {summary}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span
            className="max-w-[15rem] text-[11px] uppercase tracking-[0.26em]"
            style={{ color: `${style.accentColor}A0` }}
          >
            {meta || 'Collectible dossier'}
          </span>
          {href && (
            <ArrowRight size={16} className="text-primary transition group-hover:translate-x-1" />
          )}
        </div>
      </div>
    </>
  );

  const sharedProps = {
    className: cn(
      'group relative block overflow-hidden rounded-[1.8rem] border border-white/10 p-5 transition hover:-translate-y-0.5 hover:border-primary/25',
      className
    ),
    style: {
      backgroundColor: style.background,
      backgroundImage: coverPatterns[coverTheme],
    },
  };

  if (href) {
    return (
      <Link href={href} {...sharedProps}>
        {content}
      </Link>
    );
  }

  return <div {...sharedProps}>{content}</div>;
}
