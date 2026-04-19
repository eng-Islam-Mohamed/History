'use client';

import Link from 'next/link';
import { Clock3 } from 'lucide-react';
import { DeepDivePath } from '@/types/experience';
import { localizePath } from '@/i18n/navigation';
import { useI18n } from '@/components/i18n/LocaleProvider';
import HistoricalVisualCard from '@/components/experience/HistoricalVisualCard';

interface PathCardProps {
  path: DeepDivePath;
}

export default function PathCard({ path }: PathCardProps) {
  const { locale } = useI18n();

  return (
    <div className="flex h-full flex-col gap-4">
      <HistoricalVisualCard
        title={path.title}
        summary={path.description}
        era={`${path.chapters.length} chapters`}
        category="path"
        coverTheme={path.coverTheme}
        meta={path.theme}
        href={localizePath(locale, `/paths/${path.slug}`)}
        className="min-h-[21rem] md:min-h-[22rem]"
      />
      <div className="mt-auto rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3 text-sm text-stone-400">
          <span>{path.difficulty}</span>
          <span className="inline-flex items-center gap-2">
            <Clock3 size={14} className="text-primary/70" />
            {path.estimatedMinutes} min
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {path.chapters.slice(0, 3).map((chapter) => (
            <Link
              key={chapter.id}
              href={`${localizePath(locale, '/search')}?q=${encodeURIComponent(chapter.query)}`}
              className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-stone-300 transition hover:border-primary/25"
            >
              {chapter.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
