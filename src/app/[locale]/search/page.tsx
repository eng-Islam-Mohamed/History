'use client';

import { Suspense, useEffect, useEffectEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Landmark,
  MapPin,
  Search,
  Sparkles,
  Swords,
  Users,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useI18n } from '@/components/i18n/LocaleProvider';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { searchHistoryTopic } from '@/lib/ai/historyService';
import { getTopicBySlug } from '@/lib/ai/historyService';
import { saveResearchForCurrentUser } from '@/lib/researches/browser';
import { cleanText } from '@/lib/utils';
import { localizePath } from '@/i18n/navigation';
import { getUiCopy } from '@/i18n/ui-copy';
import { HistoryTopic } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dictionary, locale } = useI18n();
  const { hasSupabase, isAuthenticated } = useAuth();
  const ui = getUiCopy(locale);
  const query = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HistoryTopic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'error' | 'signin'
  >('idle');

  async function performSearch(nextQuery: string) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSaveState('idle');

    try {
      const topic = await searchHistoryTopic(nextQuery, locale);
      setResult(topic);

      if (getTopicBySlug(topic.slug)) {
        setSaveState('saved');
      } else if (!hasSupabase || !isAuthenticated) {
        setSaveState('signin');
      } else {
        setSaveState('saving');
        const { topic: persistedTopic, error: saveError } =
          await saveResearchForCurrentUser(topic, locale);

        if (saveError) {
          setSaveState('error');
        } else {
          if (persistedTopic) {
            setResult(persistedTopic);
          }
          setSaveState('saved');
        }
      }
    } catch (err) {
      setError(dictionary.searchPage.error);
      console.warn('Search request failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleQueryChange = useEffectEvent((nextQuery: string) => {
    setSearchInput(nextQuery);

    if (nextQuery) {
      void performSearch(nextQuery);
      return;
    }

    setResult(null);
    setError(null);
    setIsLoading(false);
  });

  useEffect(() => {
    handleQueryChange(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const nextQuery = searchInput.trim();
    if (!nextQuery) return;

    router.push(
      `${localizePath(locale, '/search')}?q=${encodeURIComponent(nextQuery)}`
    );
  };

  const openPrompt = (prompt: string) => {
    setSearchInput(prompt);
    router.push(`${localizePath(locale, '/search')}?q=${encodeURIComponent(prompt)}`);
  };

  const isMockTopic = result ? Boolean(getTopicBySlug(result.slug)) : false;
  const canOpenFullDossier = Boolean(result && (isMockTopic || saveState === 'saved'));
  const loginHref = `${localizePath(locale, '/login')}?next=${encodeURIComponent(
    `${localizePath(locale, '/search')}?q=${encodeURIComponent(result?.query || query)}`
  )}`;

  function getStatusLabel() {
    if (saveState === 'saving') {
      return ui.search.savingToLibrary;
    }

    if (saveState === 'saved') {
      return ui.search.savedToLibrary;
    }

    if (saveState === 'error') {
      return ui.search.saveError;
    }

    if (saveState === 'signin') {
      return ui.search.signInToSave;
    }

    return dictionary.common.savedToLibrary;
  }

  return (
    <>
      <Navbar />

      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]"
          >
            <div className="vault-frame rounded-[2.2rem] p-6 md:p-8 lg:p-10">
              <p className="text-[11px] uppercase tracking-[0.36em] text-primary/85">
                {dictionary.searchPage.eyebrow}
              </p>
              <h1 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface md:text-6xl">
                {dictionary.searchPage.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-stone-400 md:text-base">
                {dictionary.searchPage.description}
              </p>

              <form onSubmit={handleSearch} className="mt-8">
                <div className="flex flex-col gap-3 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-3 md:flex-row md:items-center md:p-4">
                  <div className="flex items-center gap-3 px-2 text-primary/75">
                    <Search size={18} />
                    <span className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      {dictionary.common.query}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={dictionary.searchPage.searchPlaceholder}
                    className="w-full bg-transparent px-2 text-base text-on-surface placeholder:text-stone-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-[1rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60"
                  >
                    {isLoading ? dictionary.searchPage.loading : dictionary.common.search}
                  </button>
                </div>
              </form>

              <div className="mt-5 flex flex-wrap gap-3">
                {dictionary.searchPage.scopes.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-stone-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="soft-panel rounded-[2rem] p-6 md:p-7">
              <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/85">
                {dictionary.searchPage.suggestedPrompts}
              </p>
              <div className="mt-5 space-y-3">
                {dictionary.searchPage.promptExamples.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => openPrompt(prompt)}
                    className="flex w-full items-start justify-between gap-4 rounded-[1.3rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:border-primary/25 hover:bg-white/[0.05]"
                  >
                    <span className="text-sm leading-relaxed text-stone-300">{prompt}</span>
                    <ArrowRight size={16} className="mt-1 shrink-0 text-primary/75" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-10 space-y-6"
              >
                <div className="vault-frame rounded-[2rem] p-8 md:p-10">
                  <div className="skeleton h-10 w-2/3" />
                  <div className="skeleton mt-4 h-4 w-1/4" />
                  <div className="mt-8 space-y-4">
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-11/12" />
                    <div className="skeleton h-4 w-4/5" />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="skeleton h-44" />
                  <div className="skeleton h-44" />
                  <div className="skeleton h-44" />
                </div>
              </motion.div>
            )}

            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-10"
              >
                <div className="vault-frame rounded-[2rem] px-8 py-12 text-center">
                  <p className="text-base text-error">{error}</p>
                  <button
                    onClick={() => query && void performSearch(query)}
                    className="mt-6 rounded-full border border-primary/25 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-on-primary"
                  >
                    {dictionary.searchPage.tryAgain}
                  </button>
                </div>
              </motion.div>
            )}

            {result && !isLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45 }}
                className="mt-10"
              >
                <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-stone-500">
                    <span className="text-primary/85">
                      {cleanText(result.volumeNumber || dictionary.common.fullDossier)}
                    </span>
                    <span>•</span>
                    <span>{cleanText(result.category)}</span>
                  </div>

                  <h2 className="text-glow mt-5 max-w-5xl font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface md:text-6xl">
                    {cleanText(result.title)}
                  </h2>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-400">
                    <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                      <Clock size={14} className="text-primary/70" />
                      {cleanText(result.era)}
                    </span>
                    <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                      <MapPin size={14} className="text-primary/70" />
                      {cleanText(result.region)}
                    </span>
                    <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                      <Sparkles size={14} className="text-primary/70" />
                      {getStatusLabel()}
                    </span>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px]">
                  <div className="space-y-6">
                    <section className="vault-frame rounded-[2rem] p-6 md:p-8 lg:p-10">
                      <div className="space-y-6 text-base leading-relaxed text-stone-300 md:text-lg">
                        {cleanText(result.fullContent || result.summary)
                          .split('\n\n')
                          .filter(Boolean)
                          .map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                      </div>

                      {result.quote && (
                        <div className="mt-8 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-6">
                          <p className="font-[family-name:var(--font-headline)] text-2xl italic text-primary">
                            {cleanText(result.quote)}
                          </p>
                          {result.quoteAuthor && (
                            <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                              {cleanText(result.quoteAuthor)}
                            </p>
                          )}
                        </div>
                      )}
                    </section>

                    {result.timelineEvents.length > 0 && (
                      <section className="vault-frame rounded-[2rem] p-6 md:p-8 lg:p-10">
                        <div className="mb-8">
                          <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                            {dictionary.searchPage.timelineEyebrow}
                          </p>
                          <h3 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                            {dictionary.searchPage.timelineTitle}
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {result.timelineEvents.map((event, index) => (
                            <div
                              key={`${event.year}-${event.title}-${index}`}
                              className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-5"
                            >
                              <p className="text-[11px] uppercase tracking-[0.32em] text-primary/85">
                                {cleanText(event.year)}
                              </p>
                              <h4 className="mt-2 font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                                {cleanText(event.title)}
                              </h4>
                              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                                {cleanText(event.description)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {result.relatedTopics.length > 0 && (
                      <section className="vault-frame rounded-[2rem] p-6 md:p-8 lg:p-10">
                        <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                          {dictionary.searchPage.relatedEyebrow}
                        </p>
                        <h3 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                          {dictionary.searchPage.relatedTitle}
                        </h3>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          {result.relatedTopics.map((topic, index) => (
                            <button
                              key={`${topic.name}-${index}`}
                              onClick={() => openPrompt(topic.name)}
                              className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-5 text-left transition hover:border-primary/25"
                            >
                              <p className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                                {cleanText(topic.name)}
                              </p>
                              <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                                {cleanText(topic.type)}
                              </p>
                              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                                {cleanText(topic.shortDescription)}
                              </p>
                            </button>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  <aside className="space-y-6">
                    <div className="soft-panel rounded-[2rem] p-6 md:p-7">
                      <p className="mb-5 text-[11px] uppercase tracking-[0.34em] text-primary/80">
                        {dictionary.searchPage.quickFacts}
                      </p>
                      <div className="space-y-5">
                        <div className="flex items-start gap-3">
                          <Clock size={16} className="mt-1 shrink-0 text-primary/70" />
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                              {dictionary.searchPage.period}
                            </p>
                            <p className="mt-1 text-sm text-on-surface">
                              {cleanText(result.era)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="mt-1 shrink-0 text-primary/70" />
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                              {dictionary.searchPage.region}
                            </p>
                            <p className="mt-1 text-sm text-on-surface">
                              {cleanText(result.region)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Landmark size={16} className="mt-1 shrink-0 text-primary/70" />
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                              {dictionary.searchPage.category}
                            </p>
                            <p className="mt-1 text-sm capitalize text-on-surface">
                              {cleanText(result.category)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {result.keyFigures.length > 0 && (
                      <div className="soft-panel rounded-[2rem] p-6 md:p-7">
                        <p className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.34em] text-primary/80">
                          <Users size={14} />
                          {dictionary.searchPage.keyFigures}
                        </p>
                        <div className="space-y-5">
                          {result.keyFigures.map((figure, index) => (
                            <div
                              key={`${figure.name}-${index}`}
                              className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4"
                            >
                              <p className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                                {cleanText(figure.name)}
                              </p>
                              {figure.role && (
                                <p className="mt-2 text-[11px] uppercase tracking-[0.26em] text-secondary/80">
                                  {cleanText(figure.role)}
                                </p>
                              )}
                              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                                {cleanText(figure.shortDescription)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.relatedEvents.length > 0 && (
                      <div className="soft-panel rounded-[2rem] p-6 md:p-7">
                        <p className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.34em] text-primary/80">
                          <Swords size={14} />
                          {dictionary.searchPage.relatedEvents}
                        </p>
                        <div className="space-y-4">
                          {result.relatedEvents.map((event, index) => (
                            <button
                              key={`${event.name}-${index}`}
                              onClick={() => openPrompt(event.name)}
                              className="block w-full rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4 text-left transition hover:border-primary/25"
                            >
                              <p className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                                {cleanText(event.name)}
                              </p>
                              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                                {cleanText(event.shortDescription)}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {canOpenFullDossier ? (
                      <button
                        onClick={() =>
                          router.push(localizePath(locale, `/topic/${result.slug}`))
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-primary px-6 py-4 text-sm font-semibold text-on-primary transition hover:brightness-110"
                      >
                        {dictionary.searchPage.openFullDossier}
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push(loginHref)}
                        className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] border border-primary/25 px-6 py-4 text-sm font-semibold text-primary transition hover:bg-primary hover:text-on-primary"
                      >
                        {ui.search.signInToOpen}
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </aside>
                </div>
              </motion.div>
            )}

            {!query && !isLoading && !result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-10"
              >
                <div className="luminous-panel rounded-[2.2rem] px-7 py-10 text-center md:px-10 md:py-12">
                  <BookOpen size={44} className="mx-auto text-white" />
                  <h2 className="mt-6 font-[family-name:var(--font-headline)] text-4xl text-white md:text-5xl">
                    {dictionary.searchPage.emptyTitle}
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
                    {dictionary.searchPage.emptyDescription}
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {dictionary.searchPage.emptySuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => openPrompt(suggestion)}
                        className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/85 transition hover:bg-black/30"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function LocalizedSearchPage() {
  const { dictionary } = useI18n();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-stone-400">
            {dictionary.searchPage.loadingMessage}
          </p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
