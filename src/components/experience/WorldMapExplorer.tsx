'use client';

import { useMemo, useState } from 'react';
import { Compass } from 'lucide-react';
import { HistoricalMapHotspot } from '@/types/experience';
import ConfidenceBadge from '@/components/experience/ConfidenceBadge';
import { cn } from '@/lib/utils';

interface WorldMapExplorerProps {
  hotspots: HistoricalMapHotspot[];
}

function formatHistoricalYear(year: number) {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
}

export default function WorldMapExplorer({ hotspots }: WorldMapExplorerProps) {
  const [year, setYear] = useState(1450);
  const [activeId, setActiveId] = useState(hotspots[0]?.id ?? '');

  const activeHotspots = useMemo(
    () => hotspots.filter((spot) => year >= spot.startYear && year <= spot.endYear),
    [hotspots, year]
  );
  const activeHotspot =
    activeHotspots.find((spot) => spot.id === activeId) ?? activeHotspots[0] ?? null;
  const activeSpotIds = useMemo(
    () => new Set(activeHotspots.map((spot) => spot.id)),
    [activeHotspots]
  );

  return (
    <section className="mx-auto max-w-7xl">
      <div className="vault-frame rounded-[2.2rem] p-6 md:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.36em] text-primary/85">
            Living World Map
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface md:text-6xl">
            A stylized atlas of influence and movement.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-stone-400 md:text-base">
            This staged map layer is intentionally restrained: it highlights historically
            relevant zones and routes without pretending to full border precision when the
            source layer is still interpretive.
          </p>
        </div>

        <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
              Active year
            </span>
            <span className="font-[family-name:var(--font-headline)] text-4xl text-primary">
              {formatHistoricalYear(year)}
            </span>
          </div>
          <input
            type="range"
            min={-3000}
            max={1950}
            step={10}
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="mt-5 w-full"
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="atlas-surface relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-4">
            <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap items-start justify-between gap-3">
              <div className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-stone-300 backdrop-blur-md">
                Interpretive atlas surface
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-primary/90">
                  {activeHotspots.length} live nodes
                </span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-stone-400">
                  {hotspots.length} historic anchors
                </span>
              </div>
            </div>

            <div className="atlas-grid absolute inset-0 opacity-25" />
            <div className="atlas-route atlas-route--mediterranean" />
            <div className="atlas-route atlas-route--sahara" />
            <div className="atlas-route atlas-route--silk" />
            <div className="atlas-continent atlas-continent--africa" />
            <div className="atlas-continent atlas-continent--europe" />
            <div className="atlas-continent atlas-continent--asia" />
            <div className="atlas-continent atlas-continent--americas" />
            <span className="atlas-label atlas-label--mediterranean">Mediterranean</span>
            <span className="atlas-label atlas-label--sahara">Sahara corridors</span>
            <span className="atlas-label atlas-label--mesopotamia">Mesopotamia</span>
            <span className="atlas-label atlas-label--atlantic">Atlantic</span>

            {hotspots.map((spot) => {
              const isActive = activeSpotIds.has(spot.id);
              const markerSize = isActive ? spot.radius : Math.max(8, Math.round(spot.radius * 0.42));

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
                {activeHotspots.length} active overlays
              </span>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            {activeHotspot ? (
              <>
                <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80">
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
                  Active from {formatHistoricalYear(activeHotspot.startYear)} to{' '}
                  {formatHistoricalYear(activeHotspot.endYear)}
                </p>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-stone-400">
                No curated overlay is active for this year. Move the slider to a different
                period.
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
