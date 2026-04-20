'use client';

import { useMemo, useState } from 'react';
import { ArrowLeftRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useI18n } from '@/components/i18n/LocaleProvider';
import CollectionPicker from '@/components/experience/CollectionPicker';
import ConfidenceBadge from '@/components/experience/ConfidenceBadge';
import HistoricalVisualCard from '@/components/experience/HistoricalVisualCard';
import { mockTopics } from '@/data/mockTopics';
import { getExperienceCopy } from '@/i18n/experience-copy';
import { localizePath } from '@/i18n/navigation';
import {
  addEntityToCollectionForCurrentUser,
  recordUserActivityForCurrentUser,
  saveComparisonForCurrentUser,
  updateResumeStateForCurrentUser,
} from '@/lib/experience/browser';
import {
  buildComparisonExperience,
} from '@/lib/experience/intelligence';
import { saveResearchForCurrentUser } from '@/lib/researches/browser';
import { searchHistoryTopic } from '@/lib/ai/historyService';
import { HistoryTopic } from '@/types';
import { CollectionSummary, SavedComparisonRecord } from '@/types/experience';

interface CompareWorkspaceProps {
  initialCollections: CollectionSummary[];
  initialSavedComparison?: SavedComparisonRecord | null;
}

export default function CompareWorkspace({
  initialCollections,
  initialSavedComparison = null,
}: CompareWorkspaceProps) {
  const { locale } = useI18n();
  const { isAuthenticated } = useAuth();
  const copy = getExperienceCopy(locale);
  const suggestions = useMemo(() => mockTopics.map((topic) => topic.query), []);
  const [leftQuery, setLeftQuery] = useState(
    initialSavedComparison?.leftTitle ?? mockTopics[0]?.query ?? ''
  );
  const [rightQuery, setRightQuery] = useState(
    initialSavedComparison?.rightTitle ?? mockTopics[1]?.query ?? ''
  );
  const [leftTopic, setLeftTopic] = useState<HistoryTopic | null>(
    initialSavedComparison?.leftTopic ?? null
  );
  const [rightTopic, setRightTopic] = useState<HistoryTopic | null>(
    initialSavedComparison?.rightTopic ?? null
  );
  const [comparison, setComparison] = useState(
    initialSavedComparison?.comparison ?? null
  );
  const [savedComparison, setSavedComparison] =
    useState<SavedComparisonRecord | null>(initialSavedComparison);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function runComparison() {
    if (!leftQuery.trim() || !rightQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const [left, right] = await Promise.all([
        searchHistoryTopic(leftQuery.trim(), locale),
        searchHistoryTopic(rightQuery.trim(), locale),
      ]);

      setLeftTopic(left);
      setRightTopic(right);
      setComparison(buildComparisonExperience(left, right, locale));
      setSavedComparison(null);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSwapSides() {
    setLeftQuery(rightQuery);
    setRightQuery(leftQuery);
    setLeftTopic(rightTopic);
    setRightTopic(leftTopic);

    if (leftTopic && rightTopic) {
      setComparison(buildComparisonExperience(rightTopic, leftTopic, locale));
      setSavedComparison(null);
    }
  }

  async function ensureSavedComparison() {
    if (!comparison || !leftTopic || !rightTopic) {
      return null;
    }

    if (savedComparison) {
      return savedComparison;
    }

    const result = await saveComparisonForCurrentUser({
      left: leftTopic,
      right: rightTopic,
      comparison,
      locale,
    });

    if (result.error || !result.record) {
      setFeedback(copy.compare.saveError);
      return null;
    }

    setSavedComparison(result.record);
    await Promise.all([
      recordUserActivityForCurrentUser({
        eventType: 'comparison_saved',
        referenceType: 'comparison',
        referenceId: result.record.id,
      }),
      updateResumeStateForCurrentUser({
        lastComparisonId: result.record.id,
      }),
    ]);
    setFeedback(copy.compare.saved);
    return result.record;
  }

  async function handleSaveComparison() {
    await ensureSavedComparison();
  }

  async function handleAddComparisonToCollection(collectionId: string) {
    const record = await ensureSavedComparison();
    if (!record) {
      return;
    }

    const result = await addEntityToCollectionForCurrentUser({
      collectionId,
      entityType: 'comparison',
      entityId: record.id,
      title: record.title,
      slug: record.slug,
      coverTheme: 'royal-purple',
      summary: record.summary,
      metadata: {
        leftTitle: record.leftTitle,
        rightTitle: record.rightTitle,
      },
    });

    if (!result.error) {
      setFeedback(copy.compare.comparisonAdded);
    }
  }

  async function handleAddTopicToCollection(
    collectionId: string,
    side: 'left' | 'right'
  ) {
    const topic = side === 'left' ? leftTopic : rightTopic;

    if (!topic) {
      return;
    }

    const saveResult = await saveResearchForCurrentUser(topic, locale);
    if (saveResult.error || !saveResult.topic) {
      setFeedback(copy.compare.addTopicError);
      return;
    }

    const addResult = await addEntityToCollectionForCurrentUser({
      collectionId,
      entityType: 'research',
      entityId: saveResult.topic.id,
      title: saveResult.topic.title,
      slug: saveResult.topic.slug,
      coverTheme: saveResult.topic.coverTheme,
      summary: saveResult.topic.summary,
      metadata: {
        region: saveResult.topic.region,
        era: saveResult.topic.era,
      },
    });

    if (!addResult.error) {
      setFeedback(copy.compare.addTopicSuccess(saveResult.topic.title));
    }
  }

  const hasComparison = Boolean(comparison && leftTopic && rightTopic);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="vault-frame rounded-[2.2rem] p-6 md:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.36em] text-primary/85">
            {copy.compare.eyebrow}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface md:text-6xl">
            {copy.compare.title}
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-stone-400 md:text-base">
            {copy.compare.description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              {copy.compare.leftQuery}
            </p>
            <input
              list="compare-topics"
              value={leftQuery}
              onChange={(event) => setLeftQuery(event.target.value)}
              placeholder={copy.compare.prompt}
              className="mt-3 w-full bg-transparent text-lg text-on-surface placeholder:text-stone-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleSwapSides}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-primary transition hover:border-primary/30"
            aria-label={copy.compare.swap}
          >
            <ArrowLeftRight size={18} />
          </button>

          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              {copy.compare.rightQuery}
            </p>
            <input
              list="compare-topics"
              value={rightQuery}
              onChange={(event) => setRightQuery(event.target.value)}
              placeholder={copy.compare.prompt}
              className="mt-3 w-full bg-transparent text-lg text-on-surface placeholder:text-stone-500 focus:outline-none"
            />
          </div>
        </div>

        <datalist id="compare-topics">
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void runComparison()}
            disabled={isLoading}
            className="rounded-[1.2rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60"
          >
            {isLoading ? copy.compare.loading : copy.compare.compare}
          </button>
          <button
            type="button"
            onClick={() => {
              setLeftTopic(null);
              setRightTopic(null);
              setComparison(null);
              setSavedComparison(null);
              setFeedback(null);
            }}
            className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-stone-200 transition hover:border-primary/25"
          >
            {copy.compare.another}
          </button>
          {hasComparison && isAuthenticated && (
            <button
              type="button"
              onClick={() => void handleSaveComparison()}
              className="inline-flex items-center gap-2 rounded-[1.2rem] border border-primary/25 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-on-primary"
            >
              <Sparkles size={15} />
              {copy.compare.save}
            </button>
          )}
        </div>

        {feedback && (
          <div className="mt-6 rounded-[1.3rem] border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-stone-100">
            {feedback}
          </div>
        )}
      </div>

      {!hasComparison && (
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-12 text-center">
          <h2 className="font-[family-name:var(--font-headline)] text-4xl text-on-surface">
            {copy.compare.emptyTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-400 md:text-base">
            {copy.compare.emptyDescription}
          </p>
        </div>
      )}

      {hasComparison && leftTopic && rightTopic && comparison && (
        <>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <HistoricalVisualCard
              title={leftTopic.title}
              summary={leftTopic.summary}
              era={leftTopic.era}
              category={leftTopic.category}
              coverTheme={leftTopic.coverTheme}
              href={localizePath(locale, `/topic/${leftTopic.slug}`)}
            />
            <HistoricalVisualCard
              title={rightTopic.title}
              summary={rightTopic.summary}
              era={rightTopic.era}
              category={rightTopic.category}
              coverTheme={rightTopic.coverTheme}
              href={localizePath(locale, `/topic/${rightTopic.slug}`)}
            />
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                  {copy.compare.structured}
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-on-surface">
                  {comparison.title}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-stone-400">
                  {comparison.subtitle}
                </p>
              </div>
              <ConfidenceBadge confidence={comparison.confidence} />
            </div>

            {isAuthenticated && (
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <CollectionPicker
                  collections={initialCollections}
                  onAdd={handleAddComparisonToCollection}
                  buttonLabel={copy.compare.addToCollection}
                />
                <CollectionPicker
                  collections={initialCollections}
                  onAdd={(collectionId) => handleAddTopicToCollection(collectionId, 'left')}
                  buttonLabel={`${copy.compare.addTopicToCollection}: ${leftTopic.title}`}
                />
                <CollectionPicker
                  collections={initialCollections}
                  onAdd={(collectionId) => handleAddTopicToCollection(collectionId, 'right')}
                  buttonLabel={`${copy.compare.addTopicToCollection}: ${rightTopic.title}`}
                />
              </div>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/8 bg-black/20 p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-secondary/80">
                  {copy.compare.similarities}
                </p>
                <div className="mt-4 space-y-3">
                  {comparison.similarities.map((item) => (
                    <div key={item} className="rounded-[1.2rem] bg-white/[0.03] p-3 text-sm text-stone-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.6rem] border border-white/8 bg-black/20 p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-secondary/80">
                  {copy.compare.differences}
                </p>
                <div className="mt-4 space-y-3">
                  {comparison.differences.map((item) => (
                    <div key={item} className="rounded-[1.2rem] bg-white/[0.03] p-3 text-sm text-stone-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {comparison.sections.map((section) => (
                <article
                  key={section.id}
                  className="rounded-[1.6rem] border border-white/8 bg-black/20 p-5"
                >
                  <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)]">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80">
                        {section.label}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-stone-500">
                        {section.summary}
                      </p>
                    </div>
                    <div className="rounded-[1.3rem] bg-white/[0.03] p-4 text-sm leading-relaxed text-stone-300">
                      {section.left}
                    </div>
                    <div className="rounded-[1.3rem] bg-white/[0.03] p-4 text-sm leading-relaxed text-stone-300">
                      {section.right}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
