'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getExperienceCopy } from '@/i18n/experience-copy';
import { localizePath } from '@/i18n/navigation';
import { CollectionSummary } from '@/types/experience';

interface CollectionPickerProps {
  collections: CollectionSummary[];
  onAdd: (collectionId: string) => Promise<void> | void;
  buttonLabel: string;
  disabled?: boolean;
}

export default function CollectionPicker({
  collections,
  onAdd,
  buttonLabel,
  disabled = false,
}: CollectionPickerProps) {
  const { locale } = useI18n();
  const copy = getExperienceCopy(locale);
  const [selectedCollectionId, setSelectedCollectionId] = useState(collections[0]?.id ?? '');
  const resolvedCollectionId =
    collections.find((collection) => collection.id === selectedCollectionId)?.id ??
    collections[0]?.id ??
    '';

  if (collections.length === 0) {
    return (
      <Link
        href={localizePath(locale, '/collections')}
        className="inline-flex items-center justify-center rounded-[1.2rem] border border-primary/25 px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-on-primary"
      >
        {copy.collections.create}
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <select
        value={resolvedCollectionId}
        onChange={(event) => setSelectedCollectionId(event.target.value)}
        className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:outline-none"
      >
        {collections.map((collection) => (
          <option
            key={collection.id}
            value={collection.id}
            className="bg-surface text-on-surface"
          >
            {collection.title}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => resolvedCollectionId && void onAdd(resolvedCollectionId)}
        disabled={disabled || !resolvedCollectionId}
        className="rounded-[1.2rem] bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
