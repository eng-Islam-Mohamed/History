'use client';

import ConfidenceBadge from '@/components/experience/ConfidenceBadge';
import { DebateBlockData } from '@/types/experience';

interface DebateBlockProps {
  debate: DebateBlockData;
}

export default function DebateBlock({ debate }: DebateBlockProps) {
  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
            Debate mode
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
            {debate.question}
          </h3>
        </div>
        <ConfidenceBadge confidence={debate.confidence} />
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Consensus</p>
        <p className="mt-3 text-base leading-relaxed text-stone-300">{debate.consensus}</p>
        <p className="mt-3 text-sm leading-relaxed text-stone-500">{debate.uncertainty}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {debate.sides.map((side) => (
          <article
            key={side.title}
            className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5"
          >
            <h4 className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
              {side.title}
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-stone-300">{side.argument}</p>
            <div className="mt-4 space-y-3">
              {side.evidence.map((entry) => (
                <div
                  key={entry}
                  className="rounded-[1.2rem] border border-white/8 bg-black/20 p-3 text-sm text-stone-400"
                >
                  {entry}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
