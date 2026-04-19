import { Locale } from '@/i18n/config';
import { localizePath } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import {
  CollectionSummary,
  ContinueExploringItem,
  KnowledgeProfile,
  SavedComparisonRecord,
  TopicBookmark,
  TopicNote,
} from '@/types/experience';
import {
  CollectionItemRow,
  CollectionRow,
  ComparisonRecordRow,
  TopicBookmarkRow,
  TopicNoteRow,
  collectionItemRowToSummary,
  collectionRowToSummary,
  comparisonRowToRecord,
  topicBookmarkRowToBookmark,
  topicNoteRowToNote,
} from '@/lib/experience/shared';

function countTopLabels(items: string[], limit: number) {
  const counts = new Map<string, number>();
  items.filter(Boolean).forEach((item) => {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label]) => label);
}

function buildStreakDays(occurredAt: string[]) {
  const days = [...new Set(occurredAt.map((value) => value.slice(0, 10)))].sort().reverse();

  if (days.length === 0) {
    return 0;
  }

  let streak = 0;
  let cursor = new Date(`${days[0]}T00:00:00Z`);

  for (const day of days) {
    const current = new Date(`${day}T00:00:00Z`);
    const diff = Math.round((cursor.getTime() - current.getTime()) / 86400000);

    if (diff === 0 || diff === 1) {
      streak += 1;
      cursor = current;
      continue;
    }

    break;
  }

  return streak;
}

function buildBadges(profile: Omit<KnowledgeProfile, 'badges' | 'quests'>) {
  return [
    {
      id: 'antiquity-explorer',
      title: 'Antiquity Explorer',
      description: 'Save and study classical or ancient dossiers.',
      tone: 'bronze' as const,
      progress: Math.min(profile.savedBooksCount, 6),
      target: 6,
      unlocked: profile.savedBooksCount >= 6,
    },
    {
      id: 'empire-archivist',
      title: 'Empire Archivist',
      description: 'Compare and collect imperial histories.',
      tone: 'gold' as const,
      progress: Math.min(profile.comparisonsMade + profile.collectionsCreated, 5),
      target: 5,
      unlocked: profile.comparisonsMade + profile.collectionsCreated >= 5,
    },
    {
      id: 'path-scholar',
      title: 'Path Scholar',
      description: 'Complete guided historical journeys.',
      tone: 'teal' as const,
      progress: Math.min(profile.completedPaths, 3),
      target: 3,
      unlocked: profile.completedPaths >= 3,
    },
  ];
}

function buildQuests(profile: Omit<KnowledgeProfile, 'badges' | 'quests'>) {
  return [
    {
      id: 'quest-empires',
      title: 'Explore 5 empires',
      description: 'Build a wider sense of imperial rise, governance, and decline.',
      progress: Math.min(profile.savedBooksCount, 5),
      target: 5,
      unlocked: profile.savedBooksCount >= 5,
    },
    {
      id: 'quest-compare',
      title: 'Compare 3 major topics',
      description: 'Use Compare Mode to surface similarities and differences.',
      progress: Math.min(profile.comparisonsMade, 3),
      target: 3,
      unlocked: profile.comparisonsMade >= 3,
    },
    {
      id: 'quest-shelf',
      title: 'Build 2 premium shelves',
      description: 'Organize your archive into themed collections.',
      progress: Math.min(profile.collectionsCreated, 2),
      target: 2,
      unlocked: profile.collectionsCreated >= 2,
    },
  ];
}

async function getCurrentUserId() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function getCollectionsForCurrentUser() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return [] as CollectionSummary[];
  }

  const supabase = await createClient();
  const { data: collections } = await supabase
    .from('collections')
    .select('id, slug, title, description, cover_theme, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .returns<CollectionRow[]>();

  const { data: items } = await supabase
    .from('collection_items')
    .select('collection_id')
    .eq('user_id', userId)
    .returns<Array<{ collection_id: string }>>();

  const counts = new Map<string, number>();
  (items ?? []).forEach((item) => {
    counts.set(item.collection_id, (counts.get(item.collection_id) ?? 0) + 1);
  });

  return (collections ?? []).map((row) =>
    collectionRowToSummary(row, counts.get(row.id) ?? 0)
  );
}

export async function getCollectionBySlugForCurrentUser(slug: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  const supabase = await createClient();
  const { data: collection } = await supabase
    .from('collections')
    .select('id, slug, title, description, cover_theme, updated_at')
    .eq('user_id', userId)
    .eq('slug', slug)
    .maybeSingle<CollectionRow>();

  if (!collection) {
    return null;
  }

  const { data: items } = await supabase
    .from('collection_items')
    .select(
      'id, collection_id, entity_type, entity_id, title, slug, cover_theme, summary, metadata, position, created_at'
    )
    .eq('user_id', userId)
    .eq('collection_id', collection.id)
    .order('position', { ascending: true })
    .returns<CollectionItemRow[]>();

  return {
    collection: collectionRowToSummary(collection, items?.length ?? 0),
    items: (items ?? []).map(collectionItemRowToSummary),
  };
}

export async function getComparisonRecordsForCurrentUser(limit = 6) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return [] as SavedComparisonRecord[];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('comparison_records')
    .select(
      'id, slug, title, left_slug, left_title, right_slug, right_title, locale, summary, comparison_snapshot, created_at, updated_at'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<ComparisonRecordRow[]>();

  return (data ?? []).map(comparisonRowToRecord);
}

export async function getComparisonRecordForCurrentUserById(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('comparison_records')
    .select(
      'id, slug, title, left_slug, left_title, right_slug, right_title, locale, summary, comparison_snapshot, created_at, updated_at'
    )
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle<ComparisonRecordRow>();

  return data ? comparisonRowToRecord(data) : null;
}

export async function getTopicAnnotationsForCurrentUser(topicSlug: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return {
      notes: [] as TopicNote[],
      bookmarks: [] as TopicBookmark[],
    };
  }

  const supabase = await createClient();
  const [{ data: notes }, { data: bookmarks }] = await Promise.all([
    supabase
      .from('topic_notes')
      .select('id, topic_slug, topic_title, section_key, content, created_at, updated_at')
      .eq('user_id', userId)
      .eq('topic_slug', topicSlug)
      .order('updated_at', { ascending: false })
      .returns<TopicNoteRow[]>(),
    supabase
      .from('topic_bookmarks')
      .select('id, topic_slug, topic_title, section_key, note, created_at, updated_at')
      .eq('user_id', userId)
      .eq('topic_slug', topicSlug)
      .order('created_at', { ascending: false })
      .returns<TopicBookmarkRow[]>(),
  ]);

  return {
    notes: (notes ?? []).map(topicNoteRowToNote),
    bookmarks: (bookmarks ?? []).map(topicBookmarkRowToBookmark),
  };
}

export async function getPathProgressForCurrentUser(pathSlug: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('user_path_progress')
    .select('status, current_step, completed_steps')
    .eq('user_id', userId)
    .eq('path_slug', pathSlug)
    .maybeSingle<{
      status: string;
      current_step: number;
      completed_steps: number[];
    }>();

  return data;
}

export async function getContinueExploringForCurrentUser(locale: Locale) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return [] as ContinueExploringItem[];
  }

  const supabase = await createClient();
  const [{ data: resume }, { data: comparison }, { data: recentBook }, { data: collection }] =
    await Promise.all([
      supabase
        .from('user_resume_state')
        .select(
          'last_topic_slug, last_topic_title, last_path_slug, last_collection_slug, last_comparison_id'
        )
        .eq('user_id', userId)
        .maybeSingle<{
          last_topic_slug: string | null;
          last_topic_title: string | null;
          last_path_slug: string | null;
          last_collection_slug: string | null;
          last_comparison_id: string | null;
        }>(),
      supabase
        .from('comparison_records')
        .select('id, title, summary')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle<{ id: string; title: string; summary: string }>(),
      supabase
        .from('saved_researches')
        .select('id, title, slug, summary_snippet, cover_theme')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle<{
          id: string;
          title: string;
          slug: string;
          summary_snippet: string;
          cover_theme: ContinueExploringItem['coverTheme'];
        }>(),
      supabase
        .from('collections')
        .select('slug, title, cover_theme')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle<{
          slug: string;
          title: string;
          cover_theme: ContinueExploringItem['coverTheme'];
        }>(),
    ]);

  const items: ContinueExploringItem[] = [];

  if (recentBook) {
    items.push({
      type: 'topic',
      title: recentBook.title,
      href: `${localizePath(locale, `/topic/${recentBook.slug}`)}?saved=${encodeURIComponent(recentBook.id)}`,
      summary: recentBook.summary_snippet,
      eyebrow: 'Recent dossier',
      coverTheme: recentBook.cover_theme,
    });
  }

  if (comparison) {
    items.push({
      type: 'comparison',
      title: comparison.title,
      href: `${localizePath(locale, '/compare')}?saved=${encodeURIComponent(comparison.id)}`,
      summary: comparison.summary,
      eyebrow: 'Saved comparison',
      coverTheme: 'royal-purple',
    });
  }

  if (resume?.last_path_slug) {
    items.push({
      type: 'path',
      title: resume.last_path_slug.replace(/-/g, ' '),
      href: localizePath(locale, `/paths/${resume.last_path_slug}`),
      summary: 'Resume the last guided journey you opened.',
      eyebrow: 'Deep dive path',
      coverTheme: 'midnight-scholar',
    });
  }

  if (collection) {
    items.push({
      type: 'collection',
      title: collection.title,
      href: localizePath(locale, `/collections/${collection.slug}`),
      summary: 'Return to a curated shelf in your archive.',
      eyebrow: 'Collection',
      coverTheme: collection.cover_theme,
    });
  }

  return items.slice(0, 4);
}

export async function getKnowledgeProfileForCurrentUser(locale: Locale): Promise<KnowledgeProfile> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return {
      favoriteEras: [],
      favoriteRegions: [],
      mostSearchedTopics: [],
      completedPaths: 0,
      savedBooksCount: 0,
      comparisonsMade: 0,
      collectionsCreated: 0,
      notesCount: 0,
      bookmarksCount: 0,
      readingMinutes: 0,
      streakDays: 0,
      badges: [],
      quests: [],
      continueExploring: [],
    };
  }

  const supabase = await createClient();
  const [
    { data: savedResearches },
    { count: comparisonCount },
    { count: collectionCount },
    { count: notesCount },
    { count: bookmarksCount },
    { data: pathProgress },
    { data: activityEvents },
  ] = await Promise.all([
    supabase
      .from('saved_researches')
      .select('query, era, region', { count: 'exact' })
      .eq('user_id', userId)
      .returns<Array<{ query: string; era: string; region: string }>>(),
    supabase
      .from('comparison_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase.from('collections').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('topic_notes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase
      .from('topic_bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('user_path_progress')
      .select('status')
      .eq('user_id', userId)
      .returns<Array<{ status: string }>>(),
    supabase
      .from('user_activity_events')
      .select('occurred_at')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false })
      .limit(30)
      .returns<Array<{ occurred_at: string }>>(),
  ]);

  const completedPaths =
    (pathProgress ?? []).filter((entry) => entry.status === 'completed').length ?? 0;
  const savedBooksCount = savedResearches?.length ?? 0;
  const comparisonsMade = comparisonCount ?? 0;
  const collectionsCreated = collectionCount ?? 0;
  const continueExploring = await getContinueExploringForCurrentUser(locale);

  const baseProfile = {
    favoriteEras: countTopLabels((savedResearches ?? []).map((item) => item.era), 3),
    favoriteRegions: countTopLabels((savedResearches ?? []).map((item) => item.region), 3),
    mostSearchedTopics: countTopLabels(
      (savedResearches ?? []).map((item) => item.query),
      3
    ),
    completedPaths,
    savedBooksCount,
    comparisonsMade,
    collectionsCreated,
    notesCount: notesCount ?? 0,
    bookmarksCount: bookmarksCount ?? 0,
    readingMinutes:
      savedBooksCount * 8 +
      completedPaths * 10 +
      (notesCount ?? 0) * 2 +
      comparisonsMade * 5,
    streakDays: buildStreakDays((activityEvents ?? []).map((entry) => entry.occurred_at)),
    continueExploring,
  };

  return {
    ...baseProfile,
    badges: buildBadges(baseProfile),
    quests: buildQuests(baseProfile),
  };
}
