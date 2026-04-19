'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import HistoricalVisualCard from '@/components/experience/HistoricalVisualCard';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { localizePath } from '@/i18n/navigation';
import {
  deleteCollectionForCurrentUser,
  removeCollectionItemForCurrentUser,
  updateCollectionForCurrentUser,
} from '@/lib/experience/browser';
import { CollectionItemSummary, CollectionSummary } from '@/types/experience';
import { CoverTheme } from '@/types';

interface CollectionDetailClientProps {
  collection: CollectionSummary;
  initialItems: CollectionItemSummary[];
}

export default function CollectionDetailClient({
  collection,
  initialItems,
}: CollectionDetailClientProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const [title, setTitle] = useState(collection.title);
  const [description, setDescription] = useState(collection.description ?? '');
  const [coverTheme, setCoverTheme] = useState<CoverTheme>(collection.coverTheme);
  const [items, setItems] = useState(initialItems);

  async function handleSaveCollection() {
    const result = await updateCollectionForCurrentUser({
      id: collection.id,
      title,
      description,
      coverTheme,
    });

    if (!result.error) {
      router.refresh();
    }
  }

  async function handleDeleteCollection() {
    const result = await deleteCollectionForCurrentUser(collection.id);
    if (!result.error) {
      router.push(localizePath(locale, '/collections'));
    }
  }

  async function handleRemoveItem(id: string) {
    const result = await removeCollectionItemForCurrentUser(id);
    if (!result.error) {
      setItems((current) => current.filter((item) => item.id !== id));
    }
  }

  function getItemHref(item: CollectionItemSummary) {
    if (item.entityType === 'comparison') {
      return `${localizePath(locale, '/compare')}?saved=${encodeURIComponent(item.entityId)}`;
    }

    if (item.entityType === 'path') {
      return localizePath(locale, `/paths/${item.slug}`);
    }

    return `${localizePath(locale, `/topic/${item.slug}`)}?saved=${encodeURIComponent(item.entityId)}`;
  }

  return (
    <>
      <Navbar />
      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="mx-auto max-w-7xl">
          <div className="vault-frame rounded-[2.2rem] p-6 md:p-8 lg:p-10">
            <p className="text-[11px] uppercase tracking-[0.36em] text-primary/85">
              Collection detail
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_220px_auto_auto]">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface focus:border-primary/40 focus:outline-none"
              />
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface focus:border-primary/40 focus:outline-none"
              />
              <input
                value={coverTheme}
                onChange={(event) => setCoverTheme(event.target.value as CoverTheme)}
                className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface focus:border-primary/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void handleSaveCollection()}
                className="rounded-[1.2rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
              >
                Save shelf
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteCollection()}
                className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-stone-200 transition hover:border-error/30 hover:text-error"
              >
                Delete shelf
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="space-y-4">
                <HistoricalVisualCard
                  title={item.title}
                  summary={item.summary || 'A saved object from your premium archive.'}
                  era={item.entityType}
                  category="path"
                  coverTheme={item.coverTheme}
                  href={getItemHref(item)}
                  meta="Collection item"
                />
                <button
                  type="button"
                  onClick={() => void handleRemoveItem(item.id)}
                  className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone-200 transition hover:border-error/30 hover:text-error"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
