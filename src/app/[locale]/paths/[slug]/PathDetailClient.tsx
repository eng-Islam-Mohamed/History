'use client';

import { useMemo, useState } from 'react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getExperienceCopy } from '@/i18n/experience-copy';
import { localizePath } from '@/i18n/navigation';
import {
  recordUserActivityForCurrentUser,
  updateResumeStateForCurrentUser,
  upsertPathProgressForCurrentUser,
} from '@/lib/experience/browser';
import { DeepDivePath } from '@/types/experience';

interface PathDetailClientProps {
  path: DeepDivePath;
  initialCompletedSteps: number[];
}

export default function PathDetailClient({
  path,
  initialCompletedSteps,
}: PathDetailClientProps) {
  const { locale } = useI18n();
  const copy = getExperienceCopy(locale);
  const [completedSteps, setCompletedSteps] = useState<number[]>(initialCompletedSteps);

  const allCompleted = completedSteps.length >= path.chapters.length;
  const progressPercent = Math.round((completedSteps.length / path.chapters.length) * 100);

  async function toggleStep(index: number) {
    const nextSteps = completedSteps.includes(index)
      ? completedSteps.filter((step) => step !== index)
      : [...completedSteps, index].sort((a, b) => a - b);

    setCompletedSteps(nextSteps);
    await Promise.all([
      upsertPathProgressForCurrentUser({
        pathSlug: path.slug,
        currentStep: nextSteps[nextSteps.length - 1] ?? 0,
        completedSteps: nextSteps,
        isCompleted: nextSteps.length >= path.chapters.length,
      }),
      recordUserActivityForCurrentUser({
        eventType: 'path_progress',
        referenceType: 'path',
        referenceId: path.slug,
      }),
      updateResumeStateForCurrentUser({
        lastPathSlug: path.slug,
      }),
    ]);
  }

  const chaptersLeft = useMemo(
    () => path.chapters.length - completedSteps.length,
    [completedSteps.length, path.chapters.length]
  );

  return (
    <>
      <Navbar />
      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="mx-auto max-w-7xl">
          <div className="vault-frame rounded-[2.2rem] p-6 md:p-8 lg:p-10">
            <p className="text-[11px] uppercase tracking-[0.36em] text-primary/85">
              {copy.paths.eyebrow}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface md:text-6xl">
              {path.title}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-stone-400 md:text-base">
              {path.description}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                  {copy.paths.theme}
                </p>
                <p className="mt-3 text-lg text-on-surface">{path.theme}</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                  {copy.paths.depth}
                </p>
                <p className="mt-3 text-lg text-on-surface">
                  {copy.paths.difficultyLabels[path.difficulty]}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                  {copy.paths.progress}
                </p>
                <p className="mt-3 text-lg text-on-surface">
                  {progressPercent}% • {copy.paths.chaptersLeft(chaptersLeft)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {path.chapters.map((chapter, index) => {
              const isCompleted = completedSteps.includes(index);
              return (
                <article
                  key={chapter.id}
                  className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_180px_auto] lg:items-center">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80">
                        {chapter.era}
                      </p>
                      <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface">
                        {chapter.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-stone-400">
                        {chapter.description}
                      </p>
                    </div>
                    <a
                      href={`${localizePath(locale, '/search')}?q=${encodeURIComponent(chapter.query)}`}
                      className="rounded-[1.2rem] border border-primary/25 px-4 py-3 text-center text-sm font-medium text-primary transition hover:bg-primary hover:text-on-primary"
                    >
                      {copy.paths.openChapter}
                    </a>
                    <button
                      type="button"
                      onClick={() => void toggleStep(index)}
                      className={`rounded-[1.2rem] px-4 py-3 text-sm font-semibold transition ${
                        isCompleted
                          ? 'border border-white/10 bg-white/[0.03] text-stone-200'
                          : 'bg-primary text-on-primary hover:brightness-110'
                      }`}
                    >
                      {isCompleted ? copy.paths.completed : copy.paths.markComplete}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {allCompleted && (
            <div className="mt-8 rounded-[2rem] border border-primary/25 bg-primary/10 px-8 py-12 text-center">
              <h2 className="font-[family-name:var(--font-headline)] text-4xl text-on-surface">
                {copy.paths.completedTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-300 md:text-base">
                {copy.paths.completedDescription}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
