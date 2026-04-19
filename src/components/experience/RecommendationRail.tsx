'use client';

import { useI18n } from '@/components/i18n/LocaleProvider';
import { getExperienceCopy } from '@/i18n/experience-copy';
import { localizePath } from '@/i18n/navigation';
import { RecommendationItem } from '@/types/experience';
import HistoricalVisualCard from '@/components/experience/HistoricalVisualCard';

interface RecommendationRailProps {
  items: RecommendationItem[];
}

export default function RecommendationRail({ items }: RecommendationRailProps) {
  const { locale } = useI18n();
  const copy = getExperienceCopy(locale);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
          {copy.topic.recommendations}
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
          Curated next steps
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <HistoricalVisualCard
            key={item.slug}
            title={item.title}
            summary={item.summary}
            era={item.era}
            category={item.category}
            coverTheme={item.coverTheme}
            meta={item.reason}
            href={`${localizePath(locale, '/search')}?q=${encodeURIComponent(item.query)}`}
          />
        ))}
      </div>
    </section>
  );
}
