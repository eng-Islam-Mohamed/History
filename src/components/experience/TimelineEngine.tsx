'use client';

import { useMemo, useState } from 'react';
import { Locale } from '@/i18n/config';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getExperienceCopy } from '@/i18n/experience-copy';
import { TimelineEngineEvent } from '@/types/experience';
import { cn } from '@/lib/utils';
import ConfidenceBadge from '@/components/experience/ConfidenceBadge';

interface TimelineEngineProps {
  events: TimelineEngineEvent[];
  title?: string;
  description?: string;
}

type ZoomLevel = 'century' | 'decade' | 'year';

const zoomLevels: ZoomLevel[] = ['century', 'decade', 'year'];

function labelForZoom(event: TimelineEngineEvent, zoom: ZoomLevel, locale: Locale) {
  if (zoom === 'year') {
    return event.yearLabel;
  }

  if (zoom === 'decade') {
    const base = Math.floor(event.startYear / 10) * 10;
    if (locale === 'fr') {
      return `années ${base}`;
    }

    if (locale === 'ar') {
      return `عقد ${base}`;
    }

    return `${base}s`;
  }

  const century = Math.floor(Math.abs(event.startYear) / 100) + 1;
  if (locale === 'fr') {
    return event.startYear < 0 ? `${century}e siècle av. J.-C.` : `${century}e siècle`;
  }

  if (locale === 'ar') {
    return event.startYear < 0 ? `القرن ${century} ق.م` : `القرن ${century}`;
  }

  return event.startYear < 0 ? `${century}th century BC` : `${century}th century`;
}

export default function TimelineEngine({
  events,
  title = 'Historical signal line',
  description = 'Explore the chronology without losing density or thematic context.',
}: TimelineEngineProps) {
  const { locale } = useI18n();
  const copy = getExperienceCopy(locale);
  const [zoom, setZoom] = useState<ZoomLevel>('decade');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeEventId, setActiveEventId] = useState<string>(events[0]?.id ?? '');

  const categories = useMemo(
    () => ['all', ...new Set(events.map((event) => event.category))],
    [events]
  );

  const visibleEvents = useMemo(
    () =>
      events
        .filter((event) =>
          activeCategory === 'all' ? true : event.category === activeCategory
        )
        .sort((a, b) => a.startYear - b.startYear),
    [activeCategory, events]
  );

  const activeEvent =
    visibleEvents.find((event) => event.id === activeEventId) ?? visibleEvents[0] ?? null;

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
            {copy.timeline.engineEyebrow}
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
            {title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-400">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {zoomLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setZoom(level)}
              className={cn(
                'rounded-full px-4 py-2 text-sm transition',
                zoom === level
                  ? 'bg-primary text-on-primary'
                  : 'border border-white/10 bg-white/[0.03] text-stone-300 hover:border-primary/25'
              )}
            >
              {level === 'century'
                ? copy.timeline.zoomCentury
                : level === 'decade'
                  ? copy.timeline.zoomDecade
                  : copy.timeline.zoomYear}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              'rounded-full px-4 py-2 text-sm capitalize transition',
              activeCategory === category
                ? 'bg-primary/14 text-primary'
                : 'border border-white/10 bg-white/[0.03] text-stone-400 hover:border-primary/25'
            )}
          >
            {copy.timeline.categories[category] ?? category}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-x-auto pb-3">
          <div className="flex min-w-max gap-4">
            {visibleEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setActiveEventId(event.id)}
                className={cn(
                  'timeline-chip min-h-[180px] w-[250px] rounded-[1.6rem] border p-5 text-left transition',
                  activeEvent?.id === event.id
                    ? 'border-primary/35 bg-primary/10'
                    : 'border-white/8 bg-black/20 hover:border-primary/25'
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80">
                  {labelForZoom(event, zoom, locale)}
                </p>
                <h4 className="mt-3 font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                  {event.title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">
                  {event.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {activeEvent && (
          <aside className="rounded-[1.6rem] border border-white/8 bg-black/20 p-5">
            <div className="flex flex-col gap-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80">
                {activeEvent.yearLabel}
              </p>
              <h4 className="font-[family-name:var(--font-headline)] text-3xl text-on-surface">
                {activeEvent.title}
              </h4>
              <ConfidenceBadge confidence={activeEvent.confidence} compact />
              <p className="text-sm leading-relaxed text-stone-300">
                {activeEvent.description}
              </p>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
