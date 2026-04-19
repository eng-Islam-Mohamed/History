'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import HistoricalVisualCard from '@/components/experience/HistoricalVisualCard';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { localizePath } from '@/i18n/navigation';
import {
  createCollectionForCurrentUser,
  deleteCollectionForCurrentUser,
} from '@/lib/experience/browser';
import { CollectionSummary } from '@/types/experience';
import { CoverTheme } from '@/types';

const collectionThemes: CoverTheme[] = [
  'imperial-navy',
  'ancient-sand',
  'emerald-dynasty',
  'royal-purple',
  'midnight-scholar',
  'oxblood-war',
];

interface CollectionsPageClientProps {
  initialCollections: CollectionSummary[];
}

export default function CollectionsPageClient({
  initialCollections,
}: CollectionsPageClientProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const [collections, setCollections] = useState(initialCollections);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverTheme, setCoverTheme] = useState<CoverTheme>('imperial-navy');

  async function handleCreateCollection() {
    if (!title.trim()) {
      return;
    }

    const result = await createCollectionForCurrentUser({
      title,
      description,
      coverTheme,
    });

    if (!result.error && result.collection) {
      setCollections((current) => [result.collection!, ...current]);
      setTitle('');
      setDescription('');
    }
  }

  async function handleDeleteCollection(id: string) {
    const result = await deleteCollectionForCurrentUser(id);
    if (!result.error) {
      setCollections((current) => current.filter((collection) => collection.id !== id));
    }
  }

  return (
    <>
      <Navbar />
      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="mx-auto max-w-7xl">
          <div className="vault-frame rounded-[2.2rem] p-6 md:p-8 lg:p-10">
            <p className="text-[11px] uppercase tracking-[0.36em] text-primary/85">
              Collections
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface md:text-6xl">
              Curate premium shelves for your archive.
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-stone-400 md:text-base">
              Create named shelves for figures, wars, empires, comparisons, and guided paths. These shelves now power the collectible side of ChronoLivre.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_220px_auto]">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Shelf title"
                className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
              />
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
              />
              <select
                value={coverTheme}
                onChange={(event) => setCoverTheme(event.target.value as CoverTheme)}
                className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface focus:border-primary/40 focus:outline-none"
              >
                {collectionThemes.map((theme) => (
                  <option key={theme} value={theme} className="bg-surface text-on-surface">
                    {theme}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => void handleCreateCollection()}
                className="rounded-[1.2rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
              >
                Create shelf
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <div key={collection.id} className="space-y-4">
                <HistoricalVisualCard
                  title={collection.title}
                  summary={collection.description || 'A curated shelf inside your historical archive.'}
                  era={`${collection.itemCount} items`}
                  category="path"
                  coverTheme={collection.coverTheme}
                  href={localizePath(locale, `/collections/${collection.slug}`)}
                  meta="Curated shelf"
                />
                <button
                  type="button"
                  onClick={() => void handleDeleteCollection(collection.id)}
                  className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone-200 transition hover:border-error/30 hover:text-error"
                >
                  Delete shelf
                </button>
              </div>
            ))}
          </div>

          {collections.length === 0 && (
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-12 text-center">
              <h2 className="font-[family-name:var(--font-headline)] text-4xl text-on-surface">
                No shelves yet
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-400 md:text-base">
                Create your first shelf to start organizing saved dossiers and premium comparisons.
              </p>
              <button
                type="button"
                onClick={() => router.push(localizePath(locale, '/library'))}
                className="mt-8 rounded-[1.2rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
              >
                Open library
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
