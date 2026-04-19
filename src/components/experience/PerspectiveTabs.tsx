'use client';

import { useState } from 'react';
import { PerspectivePanel } from '@/types/experience';
import { cn } from '@/lib/utils';

interface PerspectiveTabsProps {
  panels: PerspectivePanel[];
}

export default function PerspectiveTabs({ panels }: PerspectiveTabsProps) {
  const [activeLens, setActiveLens] = useState(panels[0]?.lens);
  const activePanel = panels.find((panel) => panel.lens === activeLens) ?? panels[0];

  if (!activePanel) {
    return null;
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
          Perspective mode
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
          Multiple analytical lenses
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {panels.map((panel) => (
          <button
            key={panel.lens}
            type="button"
            onClick={() => setActiveLens(panel.lens)}
            className={cn(
              'rounded-full px-4 py-2 text-sm transition',
              activePanel.lens === panel.lens
                ? 'bg-primary text-on-primary'
                : 'border border-white/10 bg-white/[0.03] text-stone-300 hover:border-primary/25'
            )}
          >
            {panel.title}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
          <p className="text-base leading-relaxed text-stone-300">{activePanel.summary}</p>
        </div>

        <div className="space-y-3">
          {activePanel.bullets.map((bullet) => (
            <div
              key={bullet}
              className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4 text-sm leading-relaxed text-stone-300"
            >
              {bullet}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
