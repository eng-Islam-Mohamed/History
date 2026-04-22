'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Compass,
  Filter,
  Globe2,
  Info,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getMapCopy } from '@/i18n/map-copy';
import {
  HistoricalMapCategory,
  HistoricalMapEraPreset,
  HistoricalMapHotspot,
} from '@/types/experience';
import ConfidenceBadge from '@/components/experience/ConfidenceBadge';
import { cn } from '@/lib/utils';

interface WorldMapExplorerProps {
  hotspots: HistoricalMapHotspot[];
  presets: HistoricalMapEraPreset[];
}

function formatHistoricalYear(
  year: number,
  eras: { bce: string; ce: string }
) {
  return year < 0 ? `${Math.abs(year)} ${eras.bce}` : `${year} ${eras.ce}`;
}

function normalize(value: string) {
  return value.toLocaleLowerCase().trim();
}

const categoryOrder: Array<'all' | HistoricalMapCategory> = [
  'all',
  'empire',
  'dynasty',
  'civilization',
  'kingdom',
  'country',
  'route',
  'conflict',
  'event',
  'war',
  'figure',
  'era',
];

const categoryTone: Record<HistoricalMapCategory, string> = {
  empire: 'atlas-chip--gold',
  dynasty: 'atlas-chip--emerald',
  civilization: 'atlas-chip--bronze',
  kingdom: 'atlas-chip--bronze',
  country: 'atlas-chip--slate',
  route: 'atlas-chip--azure',
  conflict: 'atlas-chip--crimson',
  event: 'atlas-chip--slate',
  war: 'atlas-chip--crimson',
  figure: 'atlas-chip--gold',
  era: 'atlas-chip--slate',
};

export default function WorldMapExplorer({
  hotspots,
  presets,
}: WorldMapExplorerProps) {
  const { locale } = useI18n();
  const copy = getMapCopy(locale);
  const [year, setYear] = useState(1450);
  const [activeId, setActiveId] = useState(hotspots[0]?.id ?? '');
  const [category, setCategory] = useState<'all' | HistoricalMapCategory>('all');
  const [queryFilter, setQueryFilter] = useState('');

  const normalizedFilter = useMemo(() => normalize(queryFilter), [queryFilter]);

  const availableCategories = useMemo(() => {
    const categories = new Set(hotspots.map((spot) => spot.category));
    return categoryOrder.filter(
      (entry) => entry === 'all' || categories.has(entry)
    );
  }, [hotspots]);

  const filteredAnchors = useMemo(() => {
    return hotspots.filter((spot) => {
      const matchesCategory = category === 'all' || spot.category === category;
      const searchCorpus = [
        spot.title,
        spot.query,
        spot.region,
        ...spot.presentDay,
        ...spot.significance,
        ...spot.relatedQueries,
      ]
        .join(' ')
        .toLocaleLowerCase();
      const matchesQuery =
        normalizedFilter.length === 0 || searchCorpus.includes(normalizedFilter);

      return matchesCategory && matchesQuery;
    });
  }, [category, hotspots, normalizedFilter]);

  const activeHotspots = useMemo(() => {
    return filteredAnchors
      .filter((spot) => year >= spot.startYear && year <= spot.endYear)
      .sort((left, right) => right.radius - left.radius || left.startYear - right.startYear);
  }, [filteredAnchors, year]);

  const activeSpotIds = useMemo(
    () => new Set(activeHotspots.map((spot) => spot.id)),
    [activeHotspots]
  );

  const activeHotspot =
    activeHotspots.find((spot) => spot.id === activeId) ?? activeHotspots[0] ?? null;

  const highlightedPresetId = useMemo(() => {
    return (
      presets.find((preset) => Math.abs(preset.year - year) <= 15)?.id ?? null
    );
  }, [presets, year]);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="vault-frame rounded-[2.2rem] p-6 md:p-8 lg:p-10">
        <div className="max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.36em] text-primary/85">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface md:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-stone-400 md:text-base">
            {copy.description}
          </p>
        </div>

        <div className="atlas-controls-panel mt-8 rounded-[1.8rem] p-5 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                {copy.activeYear}
              </p>
              <p className="mt-2 font-[family-name:var(--font-headline)] text-4xl text-primary md:text-5xl">
                {formatHistoricalYear(year, copy.eras)}
              </p>
            </div>
            <div className="max-w-md text-sm leading-relaxed text-stone-400">
              {copy.yearHint}
            </div>
          </div>

          <input
            type="range"
            min={-3000}
            max={1950}
            step={10}
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="mt-5 w-full"
            aria-label={copy.activeYear}
          />

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                  {copy.presetsLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setYear(preset.year)}
                      className={cn(
                        'atlas-pill',
                        highlightedPresetId === preset.id && 'atlas-pill--active'
                      )}
                    >
                      {copy.eraJump(copy.presetLabels[preset.id] ?? preset.label)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                  {copy.filtersLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((entry) => (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => setCategory(entry)}
                      className={cn(
                        'atlas-pill',
                        category === entry && 'atlas-pill--active'
                      )}
                    >
                      {entry === 'all' ? copy.categoryAll : copy.categories[entry]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="atlas-search-shell">
              <label className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                {copy.activeOverlays}
              </label>
              <div className="atlas-search-input mt-3">
                <Search size={16} className="text-stone-500" />
                <input
                  value={queryFilter}
                  onChange={(event) => setQueryFilter(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-stone-500"
                />
                {queryFilter ? (
                  <button
                    type="button"
                    onClick={() => setQueryFilter('')}
                    className="rounded-full border border-white/10 p-1 text-stone-400 transition hover:border-primary/30 hover:text-primary"
                    aria-label={copy.clearSearch}
                    title={copy.clearSearch}
                  >
                    <X size={12} />
                  </button>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-stone-400">
                {copy.matchingResults(activeHotspots.length)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="space-y-5">
            <div className="atlas-surface relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-4">
              <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap items-start justify-between gap-3">
                <div className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-stone-300 backdrop-blur-md">
                  {copy.interpretiveSurface}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-primary/90">
                    {copy.liveNodes(activeHotspots.length)}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-stone-400">
                    {copy.historicAnchors(filteredAnchors.length)}
                  </span>
                </div>
              </div>

              <div className="atlas-grid absolute inset-0 opacity-25" />
              <div className="atlas-route atlas-route--mediterranean" />
              <div className="atlas-route atlas-route--sahara" />
              <div className="atlas-route atlas-route--silk" />
              <div className="atlas-route atlas-route--indian" />
              <div className="atlas-continent atlas-continent--africa" />
              <div className="atlas-continent atlas-continent--europe" />
              <div className="atlas-continent atlas-continent--asia" />
              <div className="atlas-continent atlas-continent--americas" />
              <span className="atlas-label atlas-label--mediterranean">
                {copy.routes.mediterranean}
              </span>
              <span className="atlas-label atlas-label--sahara">
                {copy.routes.sahara}
              </span>
              <span className="atlas-label atlas-label--mesopotamia">
                {copy.routes.mesopotamia}
              </span>
              <span className="atlas-label atlas-label--atlantic">
                {copy.routes.atlantic}
              </span>
              <span className="atlas-label atlas-label--indian">{copy.routes.indian}</span>

              {filteredAnchors.map((spot) => {
                const isActive = activeSpotIds.has(spot.id);
                const markerSize = isActive
                  ? spot.radius
                  : Math.max(8, Math.round(spot.radius * 0.42));

                if (!isActive) {
                  return (
                    <span
                      key={spot.id}
                      className="atlas-hotspot atlas-hotspot--inactive absolute rounded-full"
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        width: `${markerSize}px`,
                        height: `${markerSize}px`,
                      }}
                      aria-hidden="true"
                    />
                  );
                }

                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveId(spot.id)}
                    className={cn(
                      'atlas-hotspot atlas-hotspot--active absolute rounded-full border border-primary/40 bg-primary/18 transition hover:scale-105',
                      spot.id === activeHotspot?.id && 'atlas-hotspot--selected'
                    )}
                    style={{
                      left: `${spot.x}%`,
                      top: `${spot.y}%`,
                      width: `${markerSize}px`,
                      height: `${markerSize}px`,
                    }}
                    aria-label={spot.title}
                  >
                    <span className="sr-only">{spot.title}</span>
                  </button>
                );
              })}

              <div className="absolute bottom-4 left-4 rounded-[1.4rem] border border-white/10 bg-black/35 px-4 py-3 text-sm text-stone-300 backdrop-blur-md">
                <span className="inline-flex items-center gap-2">
                  <Compass size={15} className="text-primary/80" />
                  {copy.matchingResults(activeHotspots.length)}
                </span>
              </div>
            </div>

            <div className="atlas-panel rounded-[1.8rem] p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                    {copy.activeOverlays}
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-headline)] text-3xl text-on-surface">
                    {activeHotspots.length > 0
                      ? copy.matchingResults(activeHotspots.length)
                      : copy.noOverlay}
                  </h2>
                </div>
                <div className="atlas-legend">
                  <span className="atlas-legend__item">
                    <span className="atlas-legend__swatch atlas-legend__swatch--active" />
                    {copy.legendTitle}
                  </span>
                </div>
              </div>

              {activeHotspots.length > 0 ? (
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {activeHotspots.map((spot) => (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setActiveId(spot.id)}
                      className={cn(
                        'atlas-overlay-card text-left',
                        spot.id === activeHotspot?.id && 'atlas-overlay-card--active'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={cn(
                            'atlas-chip',
                            categoryTone[spot.category]
                          )}
                        >
                          {copy.categories[spot.category]}
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                          {formatHistoricalYear(spot.startYear, copy.eras)}
                        </span>
                      </div>
                      <h3 className="mt-4 font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                        {spot.title}
                      </h3>
                      <p className="mt-2 text-sm text-stone-400">{spot.region}</p>
                      <p className="mt-4 text-sm leading-relaxed text-stone-300">
                        {spot.summary}
                      </p>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <aside className="atlas-panel rounded-[2rem] p-6">
            {activeHotspot ? (
              <>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-primary/80">
                  <Sparkles size={14} />
                  <span>{copy.detailsPanel}</span>
                </div>
                <p className="mt-4 text-sm uppercase tracking-[0.18em] text-stone-500">
                  {activeHotspot.region}
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-on-surface">
                  {activeHotspot.title}
                </h2>
                <div className="mt-4">
                  <ConfidenceBadge confidence={activeHotspot.confidence} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-stone-300">
                  {activeHotspot.summary}
                </p>
                <p className="mt-4 text-sm text-stone-500">
                  {copy.activeRange(
                    formatHistoricalYear(activeHotspot.startYear, copy.eras),
                    formatHistoricalYear(activeHotspot.endYear, copy.eras)
                  )}
                </p>

                <Link
                  href={`/${locale}/search?q=${encodeURIComponent(activeHotspot.query)}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-on-primary transition hover:brightness-105"
                >
                  <Globe2 size={16} />
                  {copy.researchCta}
                </Link>

                <div className="mt-6 space-y-6">
                  <section>
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-stone-500">
                      <Info size={14} />
                      {copy.quickFacts}
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {activeHotspot.facts.map((fact) => (
                        <div key={fact.label} className="atlas-detail-card">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                            {fact.label}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-on-surface">
                            {fact.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-stone-500">
                      <Filter size={14} />
                      {copy.significance}
                    </div>
                    <div className="mt-3 space-y-3">
                      {activeHotspot.significance.map((point) => (
                        <div key={point} className="atlas-detail-card atlas-detail-card--row">
                          <span className="atlas-detail-card__dot" />
                          <p className="text-sm leading-relaxed text-stone-300">{point}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                      {copy.presentDay}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeHotspot.presentDay.map((label) => (
                        <span key={label} className="atlas-pill atlas-pill--soft">
                          {label}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                      {copy.relatedQueries}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeHotspot.relatedQueries.map((query) => (
                        <Link
                          key={query}
                          href={`/${locale}/search?q=${encodeURIComponent(query)}`}
                          className="atlas-pill atlas-pill--link"
                        >
                          {query}
                        </Link>
                      ))}
                    </div>
                  </section>
                </div>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-stone-400">{copy.noOverlay}</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
