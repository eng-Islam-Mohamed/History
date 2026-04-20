'use client';

import { useEffect, useState } from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getExperienceCopy } from '@/i18n/experience-copy';
import { HistoryTopic } from '@/types';
import { buildAskEraFallback } from '@/lib/experience/intelligence';
import { AskEraResponse } from '@/types/experience';

interface AskEraPanelProps {
  topic: HistoryTopic;
}

export default function AskEraPanel({ topic }: AskEraPanelProps) {
  const { locale } = useI18n();
  const copy = getExperienceCopy(locale);
  const [prompt, setPrompt] = useState<string>(copy.askEra.defaultPrompt);
  const [preset, setPreset] = useState(copy.askEra.presets[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AskEraResponse | null>(null);

  useEffect(() => {
    setPrompt(copy.askEra.defaultPrompt);
    setPreset(copy.askEra.presets[0]);
  }, [copy.askEra.defaultPrompt, copy.askEra.presets, locale]);

  async function handleGenerate() {
    setIsLoading(true);
    try {
      const result = await fetch('/api/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'ask-era',
          locale,
          topic,
          perspective: preset,
          prompt,
        }),
      });

      if (!result.ok) {
        throw new Error('Ask Era request failed');
      }

      const payload = await result.json();
      setResponse(payload.result ?? buildAskEraFallback(topic, preset, locale));
    } catch {
      setResponse(buildAskEraFallback(topic, preset, locale));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <MessageSquareQuote size={20} />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
            {copy.topic.askEra}
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
            {copy.topic.askEraTitle}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-400">{copy.askEra.caution}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_auto]">
        <select
          value={preset}
          onChange={(event) => setPreset(event.target.value)}
          className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface focus:border-primary/40 focus:outline-none"
        >
          {copy.askEra.presets.map((item) => (
            <option key={item} value={item} className="bg-surface text-on-surface">
              {item}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
        />

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="rounded-[1.2rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60"
        >
          {isLoading ? copy.askEra.generating : copy.askEra.generate}
        </button>
      </div>

      {response && (
        <div className="mt-6 rounded-[1.6rem] border border-white/8 bg-black/20 p-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80">
            {response.title}
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-300">{response.response}</p>
          <p className="mt-4 text-sm leading-relaxed text-stone-500">{response.caution}</p>
        </div>
      )}
    </section>
  );
}
