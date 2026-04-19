import { redirect } from 'next/navigation';
import LibraryPageClient from './LibraryPageClient';
import { localizePath } from '@/i18n/navigation';
import { Locale, isLocale } from '@/i18n/config';
import { getSavedBooksForCurrentUser } from '@/lib/researches/server';
import {
  getCollectionsForCurrentUser,
  getComparisonRecordsForCurrentUser,
  getContinueExploringForCurrentUser,
} from '@/lib/experience/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

export default async function LocalizedLibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : 'en';

  if (!hasSupabaseEnv()) {
    return <LibraryPageClient initialBooks={[]} mode="setup" />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `${localizePath(locale, '/login')}?next=${encodeURIComponent(localizePath(locale, '/library'))}`
    );
  }

  const [books, collections, comparisons, continueExploring] = await Promise.all([
    getSavedBooksForCurrentUser(),
    getCollectionsForCurrentUser(),
    getComparisonRecordsForCurrentUser(4),
    getContinueExploringForCurrentUser(locale),
  ]);

  return (
    <LibraryPageClient
      initialBooks={books}
      initialCollections={collections}
      initialComparisons={comparisons}
      continueExploring={continueExploring}
    />
  );
}
