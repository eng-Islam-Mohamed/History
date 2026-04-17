'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  MapPin,
  ScrollText,
  Users,
} from 'lucide-react';
import { useI18n } from '@/components/i18n/LocaleProvider';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { cleanText } from '@/lib/utils';
import { localizePath } from '@/i18n/navigation';
import { HistoryTopic } from '@/types';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

interface TopicDetailViewProps {
  slug: string;
  topic: HistoryTopic | null;
}

export default function TopicDetailView({ slug, topic }: TopicDetailViewProps) {
  const router = useRouter();
  const { dictionary, locale } = useI18n();

  if (!topic) {
    return (
      <>
        <Navbar />
        <main className="px-4 pb-16 pt-32 md:px-6">
          <div className="mx-auto max-w-3xl vault-frame rounded-[2rem] px-8 py-12 text-center">
            <BookOpen size={44} className="mx-auto text-primary/35" />
            <h1 className="mt-6 font-[family-name:var(--font-headline)] text-4xl text-on-surface">
              {dictionary.topicPage.notFoundTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-400 md:text-base">
              {dictionary.topicPage.notFoundDescription}
            </p>
            <button
              onClick={() =>
                router.push(
                  `${localizePath(locale, '/search')}?q=${encodeURIComponent(
                    slug.replace(/-/g, ' ')
                  )}`
                )
              }
              className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
            >
              {dictionary.topicPage.searchThisTopic}
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.3rem] border border-white/10">
          <div className="absolute inset-0">
            {topic.heroImageUrl ? (
              <Image
                src={topic.heroImageUrl}
                alt={topic.heroImageAlt || topic.title}
                fill
                priority
                sizes="100vw"
                className="object-cover brightness-[0.42]"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_30%_40%,#1c1b1b_0%,#0e0e0e_100%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/68 to-black/48" />
            <div className="museum-grid absolute inset-0 opacity-30" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid gap-8 px-6 py-12 md:px-10 md:py-14 lg:grid-cols-[minmax(0,1.15fr)_340px] lg:px-14 lg:py-16"
          >
            <div>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-stone-200 transition hover:border-primary/30 hover:text-primary"
              >
                <ArrowLeft size={16} />
                {dictionary.topicPage.back}
              </button>

              <p className="mt-6 text-[11px] uppercase tracking-[0.36em] text-primary/85">
                {cleanText(topic.volumeNumber || dictionary.common.fullDossier)}
              </p>
              <h1 className="text-glow mt-4 max-w-4xl font-[family-name:var(--font-headline)] text-5xl leading-[0.95] text-on-surface md:text-7xl">
                {cleanText(topic.title)}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-stone-300 md:text-lg">
                {cleanText(topic.summary)}
              </p>
            </div>

            <div className="vault-frame rounded-[2rem] p-6 md:p-7">
              <p className="text-[11px] uppercase tracking-[0.32em] text-primary/80">
                {dictionary.topicPage.overview}
              </p>
              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-3">
                  <Clock size={16} className="mt-1 shrink-0 text-primary/70" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                      {dictionary.topicPage.period}
                    </p>
                    <p className="mt-1 text-sm text-on-surface">{cleanText(topic.era)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-1 shrink-0 text-primary/70" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                      {dictionary.topicPage.region}
                    </p>
                    <p className="mt-1 text-sm text-on-surface">{cleanText(topic.region)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ScrollText size={16} className="mt-1 shrink-0 text-primary/70" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                      {dictionary.topicPage.category}
                    </p>
                    <p className="mt-1 text-sm capitalize text-on-surface">
                      {cleanText(topic.category)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto mt-8 grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1.18fr)_360px]">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="vault-frame rounded-[2rem] p-6 md:p-8 lg:p-10"
          >
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                {dictionary.topicPage.fullDossierEyebrow}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                {dictionary.topicPage.fullDossierTitle}
              </h2>
            </div>

            <div className="space-y-6 text-base leading-relaxed text-stone-300 md:text-lg">
              {cleanText(topic.fullContent || topic.summary)
                .split('\n\n')
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>

            {topic.quote && (
              <div className="mt-8 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-6">
                <p className="font-[family-name:var(--font-headline)] text-2xl italic text-primary">
                  {cleanText(topic.quote)}
                </p>
                {topic.quoteAuthor && (
                  <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                    {cleanText(topic.quoteAuthor)}
                  </p>
                )}
              </div>
            )}
          </motion.article>

          <aside className="space-y-6">
            <div className="soft-panel rounded-[2rem] p-6 md:p-7">
              <p className="text-[11px] uppercase tracking-[0.34em] text-primary/80">
                {dictionary.topicPage.researchActions}
              </p>
              <div className="mt-5 space-y-3">
                <button
                  onClick={() =>
                    router.push(
                      `${localizePath(locale, '/search')}?q=${encodeURIComponent(topic.query)}`
                    )
                  }
                  className="flex w-full items-center justify-between rounded-[1.3rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-left text-stone-200 transition hover:border-primary/25"
                >
                  <span>{dictionary.topicPage.searchRelatedMaterial}</span>
                  <ArrowRight size={16} className="text-primary/80" />
                </button>
                <button
                  onClick={() => router.push(localizePath(locale, '/library'))}
                  className="flex w-full items-center justify-between rounded-[1.3rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-left text-stone-200 transition hover:border-primary/25"
                >
                  <span>{dictionary.topicPage.openYourLibrary}</span>
                  <ArrowRight size={16} className="text-primary/80" />
                </button>
              </div>
            </div>

            {topic.relatedTopics.length > 0 && (
              <div className="soft-panel rounded-[2rem] p-6 md:p-7">
                <p className="text-[11px] uppercase tracking-[0.34em] text-primary/80">
                  {dictionary.topicPage.relatedTopics}
                </p>
                <div className="mt-5 space-y-4">
                  {topic.relatedTopics.map((related, index) => (
                    <button
                      key={`${related.name}-${index}`}
                      onClick={() =>
                        router.push(
                          `${localizePath(locale, '/search')}?q=${encodeURIComponent(related.name)}`
                        )
                      }
                      className="block w-full rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4 text-left transition hover:border-primary/25"
                    >
                      <p className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                        {cleanText(related.name)}
                      </p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                        {cleanText(related.type)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>

        {topic.keyFigures.length > 0 && (
          <section className="mx-auto mt-8 max-w-7xl">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                {dictionary.topicPage.keyFiguresEyebrow}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                {dictionary.topicPage.keyFiguresTitle}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {topic.keyFigures.map((figure, index) => (
                <motion.article
                  key={`${figure.name}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="vault-frame rounded-[2rem] p-6 md:p-7"
                >
                  <div className="relative mb-6 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.5rem] bg-surface-container-low">
                    {figure.imageUrl ? (
                      <Image
                        src={figure.imageUrl}
                        alt={figure.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.08),transparent_55%)]">
                        <span className="font-[family-name:var(--font-headline)] text-7xl text-primary/50 md:text-8xl">
                          {getInitials(cleanText(figure.name))}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-[family-name:var(--font-headline)] text-3xl text-on-surface">
                    {cleanText(figure.name)}
                  </h3>
                  {figure.role && (
                    <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-secondary/80">
                      {cleanText(figure.role)}
                    </p>
                  )}
                  <p className="mt-4 text-sm leading-relaxed text-stone-400 md:text-base">
                    {cleanText(figure.shortDescription)}
                  </p>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {topic.timelineEvents.length > 0 && (
          <section className="mx-auto mt-8 max-w-7xl">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                {dictionary.topicPage.timelineEyebrow}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                {dictionary.topicPage.timelineTitle}
              </h2>
            </div>

            <div className="grid gap-4">
              {topic.timelineEvents.map((event, index) => (
                <motion.div
                  key={`${event.year}-${event.title}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="soft-panel rounded-[1.8rem] p-5 md:p-6"
                >
                  <div className="grid gap-4 md:grid-cols-[140px_minmax(0,1fr)] md:items-start">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-primary/85">
                      {cleanText(event.year)}
                    </p>
                    <div>
                      <h3 className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                        {cleanText(event.title)}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-stone-400">
                        {cleanText(event.description)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {(topic.relatedTopics.length > 0 || topic.relatedEvents.length > 0) && (
          <section className="mx-auto mt-8 max-w-7xl">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                {dictionary.topicPage.continueEyebrow}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                {dictionary.topicPage.continueTitle}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...topic.relatedTopics, ...topic.relatedEvents].map((related, index) => (
                <button
                  key={`${related.name}-${index}`}
                  onClick={() =>
                    router.push(
                      `${localizePath(locale, '/search')}?q=${encodeURIComponent(related.name)}`
                    )
                  }
                  className="soft-panel rounded-[1.8rem] p-5 text-left transition hover:border-primary/25"
                >
                  <p className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                    {cleanText(related.name)}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                    {cleanText(related.type)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-400">
                    {cleanText(related.shortDescription)}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto mt-8 max-w-7xl">
          <div className="luminous-panel rounded-[2.2rem] px-7 py-10 text-center md:px-10 md:py-12">
            <Users size={44} className="mx-auto text-white" />
            <h2 className="mt-6 font-[family-name:var(--font-headline)] text-4xl text-white md:text-5xl">
              {dictionary.topicPage.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
              {dictionary.topicPage.ctaDescription}
            </p>
            <button
              onClick={() => router.push(localizePath(locale, '/search'))}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
            >
              {dictionary.topicPage.ctaButton}
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
