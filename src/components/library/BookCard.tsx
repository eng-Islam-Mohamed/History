'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Crown,
  Factory,
  Globe2,
  Landmark,
  ScrollText,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { localizePath } from '@/i18n/navigation';
import { SavedBook } from '@/types';
import { cleanText, formatDate, getCoverStyle } from '@/lib/utils';

interface BookCardProps {
  book: SavedBook;
  index?: number;
}

const coverIcons: Record<SavedBook['coverTheme'], LucideIcon> = {
  'ancient-sand': Landmark,
  'bronze-civilization': ScrollText,
  'emerald-dynasty': Globe2,
  'imperial-navy': Crown,
  'midnight-scholar': Sparkles,
  'obsidian-industrial': Factory,
  'oxblood-war': Shield,
  'royal-purple': Crown,
};

const coverPatterns: Record<SavedBook['coverTheme'], string> = {
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

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const { dictionary, locale } = useI18n();
  const style = getCoverStyle(book.coverTheme);
  const Icon = coverIcons[book.coverTheme] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.72,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={localizePath(locale, `/topic/${book.slug}`)} className="group block">
        <article className="soft-panel overflow-hidden rounded-[2rem]">
          <div className="book-container px-6 pt-6 md:px-7 md:pt-7">
            <div className="book-3d book-shadow relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
              <div
                className="absolute left-0 top-0 h-full w-5 origin-left transform-gpu md:w-6"
                style={{
                  backgroundColor: style.spineColor,
                  transform: 'rotateY(-90deg) translateZ(0)',
                }}
              />

              <div
                className="relative flex h-full w-full flex-col justify-between px-6 py-6 md:px-7 md:py-7"
                style={{
                  backgroundColor: style.background,
                  backgroundImage: coverPatterns[book.coverTheme],
                }}
              >
                <div className="absolute inset-[10px] rounded-[1.25rem] border border-white/8" />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span
                    className="text-[10px] uppercase tracking-[0.32em]"
                    style={{ color: `${style.accentColor}AA` }}
                  >
                    {dictionary.common.archiveEdition}
                  </span>
                  <Icon size={18} style={{ color: style.accentColor }} className="opacity-85" />
                </div>

                <div className="relative z-10 space-y-4">
                  <p
                    className="text-[10px] uppercase tracking-[0.26em]"
                    style={{ color: `${style.accentColor}99` }}
                  >
                    {cleanText(book.category)} • {cleanText(book.era)}
                  </p>
                  <h3
                    className="font-[family-name:var(--font-headline)] text-3xl leading-tight md:text-[2.2rem]"
                    style={{ color: style.textColor }}
                  >
                    {cleanText(book.title)}
                  </h3>
                </div>

                <div className="relative z-10 flex items-center gap-3">
                  <BookOpen size={14} style={{ color: `${style.accentColor}88` }} />
                  <div className="h-px flex-1" style={{ backgroundColor: `${style.accentColor}2C` }} />
                  <span
                    className="text-[10px] uppercase tracking-[0.28em]"
                    style={{ color: `${style.accentColor}88` }}
                  >
                    {dictionary.common.saved}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-7">
            <p className="text-sm leading-relaxed text-stone-300">
              {cleanText(book.curatorNote || book.summarySnippet)}
            </p>
            <div className="mt-5 flex items-center justify-between gap-4 text-sm text-stone-500">
              <span>{formatDate(book.createdAt)}</span>
              <span className="text-primary transition-transform group-hover:translate-x-0.5">
                {dictionary.common.openDossier}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
