'use client';

import { Suspense, useEffect, useEffectEvent, useRef, useState } from 'react';
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
import SearchAccessModal from '@/components/auth/SearchAccessModal';
import { useI18n } from '@/components/i18n/LocaleProvider';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import SearchArchiveLoader from '@/components/search/SearchArchiveLoader';
import { SearchAccessError, getTopicBySlug, searchHistoryTopic } from '@/lib/ai/historyService';
import { saveResearchForCurrentUser } from '@/lib/researches/browser';
import { cleanText } from '@/lib/utils';
import { localizePath } from '@/i18n/navigation';
import { getUiCopy } from '@/i18n/ui-copy';
import { HistoryTopic } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dictionary, locale } = useI18n();
  const { hasSupabase, isAuthenticated, user } = useAuth();
  const ui = getUiCopy(locale);
  const query = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HistoryTopic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchGateMode, setSearchGateMode] = useState<'guest' | 'unverified' | null>(null);
  const [searchGateNext, setSearchGateNext] = useState(localizePath(locale, '/search'));
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'error' | 'signin'
  >('idle');
  const notificationPermissionRequestedRef = useRef(false);

  async function maybeRequestNotificationPermission() {
    if (
      typeof window === 'undefined' ||
      typeof Notification === 'undefined' ||
      notificationPermissionRequestedRef.current
    ) {
      return;
    }

    if (Notification.permission !== 'default') {
      notificationPermissionRequestedRef.current = true;
      return;
    }

    notificationPermissionRequestedRef.current = true;

    try {
      await Notification.requestPermission();
    } catch (error) {
      console.warn('Notification permission request failed:', error);
    }
  }

  async function notifyResearchReady(topic: HistoryTopic, targetUrl: string) {
    if (
      typeof window === 'undefined' ||
      typeof document === 'undefined' ||
      typeof Notification === 'undefined' ||
      Notification.permission !== 'granted' ||
      !document.hidden
    ) {
      return;
    }

    const notificationTitle =
      locale === 'fr'
        ? 'Recherche terminée'
        : locale === 'ar'
          ? 'اكتمل البحث'
          : 'Research complete';
    const notificationBody =
      locale === 'fr'
        ? `Le dossier « ${cleanText(topic.title)} » est prêt à être consulté.`
        : locale === 'ar'
          ? `ملف « ${cleanText(topic.title)} » جاهز الآن للقراءة.`
          : `"${cleanText(topic.title)}" is ready to open.`;

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(notificationTitle, {
          body: notificationBody,
          icon: '/icon',
          badge: '/icon',
          tag: `research-ready-${topic.id}`,
          data: { url: targetUrl },
        });
        return;
      }

      const notification = new Notification(notificationTitle, {
        body: notificationBody,
        icon: '/icon',
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = targetUrl;
      };
    } catch (error) {
      console.warn('Research-ready notification failed:', error);
    }
  }

  const buildSearchPath = (value: string) =>
    value.trim()
      ? `${localizePath(locale, '/search')}?q=${encodeURIComponent(value.trim())}`
      : localizePath(locale, '/search');

  function getSearchGateState() {
    if (!hasSupabase) {
      return null;
    }

    if (!isAuthenticated || !user) {
      return 'guest' as const;
    }

    if (!user.emailVerified) {
      return 'unverified' as const;
    }

    return null;
  }

  async function performSearch(nextQuery: string) {
    void maybeRequestNotificationPermission();

    const gateState = getSearchGateState();
    if (gateState) {
      setSearchGateNext(buildSearchPath(nextQuery));
      setSearchGateMode(gateState);
      setResult(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setSaveState('idle');

    try {
      const topic = await searchHistoryTopic(nextQuery, locale);
      setResult(topic);

      if (getTopicBySlug(topic.slug)) {
        setSaveState('saved');
        const detailHref = `${localizePath(locale, `/topic/${topic.slug}`)}`;
        void notifyResearchReady(topic, detailHref);
      } else if (!hasSupabase || !isAuthenticated) {
        setSaveState('signin');
        void notifyResearchReady(topic, buildSearchPath(nextQuery));
      } else {
        setSaveState('saving');
        const { topic: persistedTopic, error: saveError } =
          await saveResearchForCurrentUser(topic, locale);

        if (saveError) {
          setSaveState('error');
          void notifyResearchReady(topic, buildSearchPath(nextQuery));
        } else {
          const resolvedTopic = persistedTopic ?? topic;
          if (persistedTopic) {
            setResult(persistedTopic);
          }
          setSaveState('saved');
          const detailHref = `${localizePath(locale, `/topic/${resolvedTopic.slug}`)}?saved=${encodeURIComponent(resolvedTopic.id)}`;
          void notifyResearchReady(resolvedTopic, detailHref);
        }
      }
    } catch (err) {
      if (err instanceof SearchAccessError) {
        setSearchGateMode(err.code === 'email_not_verified' ? 'unverified' : 'guest');
        setError(null);
        return;
      }

      setError(err instanceof Error && err.message ? err.message : dictionary.searchPage.error);
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
  }, [query, hasSupabase, isAuthenticated, user?.emailVerified]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register('/research-ready-sw.js')
      .catch((error) =>
        console.warn('Research notification service worker registration failed:', error)
      );
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const nextQuery = searchInput.trim();
    if (!nextQuery) return;

    const gateState = getSearchGateState();
    if (gateState) {
      setSearchGateNext(buildSearchPath(nextQuery));
      setSearchGateMode(gateState);
      return;
    }

    router.push(buildSearchPath(nextQuery));
  };

  const openPrompt = (prompt: string) => {
    setSearchInput(prompt);

    const gateState = getSearchGateState();
    if (gateState) {
      setSearchGateNext(buildSearchPath(prompt));
      setSearchGateMode(gateState);
      return;
    }

    router.push(buildSearchPath(prompt));
  };

  const isMockTopic = result ? Boolean(getTopicBySlug(result.slug)) : false;
  const canOpenFullDossier = Boolean(result && (isMockTopic || saveState === 'saved'));
  const resultDetailHref = result
    ? `${localizePath(locale, `/topic/${result.slug}`)}${isMockTopic ? '' : `?saved=${encodeURIComponent(result.id)}`}`
    : null;
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
                    className="inline-flex min-w-[156px] items-center justify-center rounded-[1rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <SearchArchiveLoader
                        label={dictionary.searchPage.loading}
                        variant="inline"
                      />
                    ) : (
                      dictionary.common.search
                    )}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-10"
              >
                <div className="vault-frame rounded-[2rem] px-8 py-12 md:px-10 md:py-14">
                  <SearchArchiveLoader
                    label={dictionary.searchPage.loading}
                    detail={query || searchInput}
                  />

                  <div className="mt-10 grid gap-4 md:grid-cols-3">
                    <div className="skeleton h-28 rounded-[1.4rem]" />
                    <div className="skeleton h-28 rounded-[1.4rem]" />
                    <div className="skeleton h-28 rounded-[1.4rem]" />
                  </div>
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
                        onClick={() => resultDetailHref && router.push(resultDetailHref)}
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

      <SearchAccessModal
        mode={searchGateMode}
        next={searchGateNext}
        onClose={() => setSearchGateMode(null)}
      />
    </>
  );
}

export default function LocalizedSearchPage() {
  const { dictionary } = useI18n();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <SearchArchiveLoader label={dictionary.searchPage.loadingMessage} />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
