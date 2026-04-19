'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Clock3, LibraryBig, Sparkles } from 'lucide-react';
import HistoricalVisualCard from '@/components/experience/HistoricalVisualCard';
import { useI18n } from '@/components/i18n/LocaleProvider';
import BookCard from '@/components/library/BookCard';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { localizePath } from '@/i18n/navigation';
import { deleteSavedResearchForCurrentUser } from '@/lib/researches/browser';
import { SavedBook } from '@/types';
import {
  CollectionSummary,
  ContinueExploringItem,
  SavedComparisonRecord,
} from '@/types/experience';

interface LibraryPageClientProps {
  initialBooks: SavedBook[];
  initialCollections?: CollectionSummary[];
  initialComparisons?: SavedComparisonRecord[];
  continueExploring?: ContinueExploringItem[];
  mode?: 'ready' | 'setup';
}

export default function LibraryPageClient({
  initialBooks,
  initialCollections = [],
  initialComparisons = [],
  continueExploring = [],
  mode = 'ready',
}: LibraryPageClientProps) {
  const router = useRouter();
  const { dictionary, locale } = useI18n();
  const [books, setBooks] = useState(initialBooks);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<'recent' | 'era' | 'title'>('recent');
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const filteredBooks = useMemo(() => {
    const normalizedQuery = searchFilter.trim().toLowerCase();
    const nextBooks = books.filter((book) => {
      const matchesCategory =
        categoryFilter === 'all' ? true : book.category === categoryFilter;
      const matchesQuery =
        !normalizedQuery ||
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.era.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    return nextBooks.sort((left, right) => {
      if (sortKey === 'title') {
        return left.title.localeCompare(right.title);
      }

      if (sortKey === 'era') {
        return left.era.localeCompare(right.era);
      }

      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });
  }, [books, categoryFilter, searchFilter, sortKey]);
  const latestAcquisition = filteredBooks[0] ?? books[0];
  const categoryCount = new Set(books.map((book) => book.category)).size;
  const categories = ['all', ...new Set(books.map((book) => book.category))];

  async function handleDelete(id: string) {
    setDeletingBookId(id);
    setDeleteError(null);

    const { error } = await deleteSavedResearchForCurrentUser(id);

    if (error) {
      setDeleteError(dictionary.libraryPage.deleteError);
      setDeletingBookId(null);
      return;
    }

    setBooks((currentBooks) => currentBooks.filter((book) => book.id !== id));
    setDeletingBookId(null);
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

              {continueExploring.length > 0 && (
                <section className="mt-8">
                  <div className="mb-6">
                    <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                      Continue exploring
                    </p>
                    <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                      Resume your active threads
                    </h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {continueExploring.map((item) => (
                      <HistoricalVisualCard
                        key={`${item.type}-${item.href}`}
                        title={item.title}
                        summary={item.summary}
                        era={item.eyebrow}
                        category="path"
                        coverTheme={item.coverTheme}
                        href={item.href}
                      />
                    ))}
                  </div>
                </section>
              )}

              {(initialCollections.length > 0 || initialComparisons.length > 0) && (
                <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                          Shelves
                        </p>
                        <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                          Collections in your archive
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push(localizePath(locale, '/collections'))}
                        className="rounded-[1.2rem] border border-primary/25 px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-on-primary"
                      >
                        Open shelves
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {initialCollections.slice(0, 2).map((collection) => (
                        <HistoricalVisualCard
                          key={collection.id}
                          title={collection.title}
                          summary={
                            collection.description ||
                            'A curated premium shelf tied to your library.'
                          }
                          era={`${collection.itemCount} items`}
                          category="path"
                          coverTheme={collection.coverTheme}
                          href={localizePath(locale, `/collections/${collection.slug}`)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                    <div className="mb-6">
                      <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                        Compare mode
                      </p>
                      <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                        Saved comparisons
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {initialComparisons.map((comparison) => (
                        <button
                          key={comparison.id}
                          type="button"
                          onClick={() =>
                            router.push(
                              `${localizePath(locale, '/compare')}?saved=${encodeURIComponent(
                                comparison.id
                              )}`
                            )
                          }
                          className="block w-full rounded-[1.4rem] border border-white/8 bg-black/20 p-4 text-left transition hover:border-primary/25"
                        >
                          <p className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                            {comparison.title}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-stone-400">
                            {comparison.summary}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {deleteError && (
                <div className="mt-6 rounded-[1.4rem] border border-error/40 bg-error/10 px-4 py-4 text-sm text-red-200">
                  {deleteError}
                </div>
              )}

              <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                  <input
                    value={searchFilter}
                    onChange={(event) => setSearchFilter(event.target.value)}
                    placeholder="Search inside your library..."
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface focus:border-primary/40 focus:outline-none"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-surface text-on-surface"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortKey}
                    onChange={(event) =>
                      setSortKey(event.target.value as 'recent' | 'era' | 'title')
                    }
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface focus:border-primary/40 focus:outline-none"
                  >
                    <option value="recent" className="bg-surface text-on-surface">
                      Most recent
                    </option>
                    <option value="era" className="bg-surface text-on-surface">
                      Era
                    </option>
                    <option value="title" className="bg-surface text-on-surface">
                      Title
                    </option>
                  </select>
                </div>
              </section>

              <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredBooks.map((book, index) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    index={index}
                    isDeleting={deletingBookId === book.id}
                    onDelete={handleDelete}
                  />
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
                      router.push(
                        `${localizePath(locale, `/topic/${latestAcquisition.slug}`)}?saved=${encodeURIComponent(latestAcquisition.id)}`
                      )
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
