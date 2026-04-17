'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Clock3, LibraryBig, Sparkles } from 'lucide-react';
import { useI18n } from '@/components/i18n/LocaleProvider';
import BookCard from '@/components/library/BookCard';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { localizePath } from '@/i18n/navigation';
import { SavedBook } from '@/types';

interface LibraryPageClientProps {
  initialBooks: SavedBook[];
  mode?: 'ready' | 'setup';
}

export default function LibraryPageClient({
  initialBooks,
  mode = 'ready',
}: LibraryPageClientProps) {
  const router = useRouter();
  const { dictionary, locale } = useI18n();
  const books = initialBooks;
  const latestAcquisition = books[0];
  const categoryCount = new Set(books.map((book) => book.category)).size;

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
                {dictionary.libraryPage.eyebrow}
              </p>
              <h1 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface md:text-6xl">
                {dictionary.libraryPage.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-stone-400 md:text-base">
                {mode === 'setup'
                  ? 'Supabase is connected, but the publishable key is still missing in your local env file.'
                  : dictionary.libraryPage.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="soft-panel rounded-[1.8rem] p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  {dictionary.libraryPage.dossiers}
                </p>
                <p className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-primary">
                  {books.length}
                </p>
              </div>
              <div className="soft-panel rounded-[1.8rem] p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  {dictionary.libraryPage.categories}
                </p>
                <p className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-primary">
                  {categoryCount}
                </p>
              </div>
              <div className="soft-panel rounded-[1.8rem] p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  {dictionary.libraryPage.latest}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-300">
                  {latestAcquisition?.title || dictionary.libraryPage.noSavedDossierYet}
                </p>
              </div>
            </div>
          </motion.div>

          {mode === 'setup' && (
            <section className="mt-8">
              <div className="vault-frame rounded-[2rem] px-8 py-10 text-center">
                <BookOpen size={44} className="mx-auto text-primary/35" />
                <h2 className="mt-6 font-[family-name:var(--font-headline)] text-4xl text-on-surface">
                  Final env step required
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-400 md:text-base">
                  Add `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to `.env.local` and
                  restart the dev server. The backend schema and app integration are
                  already prepared.
                </p>
              </div>
            </section>
          )}

          {mode === 'ready' && books.length > 0 && (
            <>
              <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                      {dictionary.libraryPage.overviewEyebrow}
                    </p>
                    <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                      {dictionary.libraryPage.overviewTitle}
                    </h2>
                  </div>
                  <button
                    onClick={() => router.push(localizePath(locale, '/search'))}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
                  >
                    {dictionary.libraryPage.researchNewTopic}
                    <Sparkles size={16} />
                  </button>
                </div>
              </section>

              <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {books.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
                ))}
              </section>
            </>
          )}

          {mode === 'ready' && books.length === 0 && (
            <section className="mt-8">
              <div className="luminous-panel rounded-[2.2rem] px-7 py-10 text-center md:px-10 md:py-12">
                <LibraryBig size={48} className="mx-auto text-white" />
                <h2 className="mt-6 font-[family-name:var(--font-headline)] text-4xl text-white md:text-5xl">
                  {dictionary.libraryPage.emptyTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
                  {dictionary.libraryPage.emptyDescription}
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {dictionary.libraryPage.emptySuggestions.map((query) => (
                    <button
                      key={query}
                      onClick={() =>
                        router.push(
                          `${localizePath(locale, '/search')}?q=${encodeURIComponent(query)}`
                        )
                      }
                      className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/85 transition hover:bg-black/30"
                    >
                      {query}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => router.push(localizePath(locale, '/search'))}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
                >
                  {dictionary.libraryPage.startResearching}
                  <Sparkles size={16} />
                </button>
              </div>
            </section>
          )}

          {mode === 'ready' && latestAcquisition && (
            <section className="mt-12">
              <div className="soft-panel rounded-[2rem] p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
                        {dictionary.libraryPage.latestAddition}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-headline)] text-3xl text-on-surface">
                        {latestAcquisition.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      router.push(localizePath(locale, `/topic/${latestAcquisition.slug}`))
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-on-primary"
                  >
                    {dictionary.libraryPage.openLatestDossier}
                    <BookOpen size={16} />
                  </button>
                </div>
              </div>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
