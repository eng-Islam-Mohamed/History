import { PostgrestError } from '@supabase/supabase-js';
import { Locale } from '@/i18n/config';
import { HistoryTopic, SavedBook } from '@/types';
import {
  CollectionEntityType,
  CollectionItemSummary,
  CollectionSummary,
  ComparisonExperience,
  SavedComparisonRecord,
  TopicBookmark,
  TopicNote,
} from '@/types/experience';
import {
  collectionItemRowToSummary,
  collectionRowToSummary,
  comparisonRowToRecord,
  topicBookmarkRowToBookmark,
  topicNoteRowToNote,
  CollectionItemRow,
  CollectionRow,
  ComparisonRecordRow,
  TopicBookmarkRow,
  TopicNoteRow,
} from '@/lib/experience/shared';
import { createClient } from '@/lib/supabase/client';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { slugify } from '@/lib/utils';

async function requireCurrentUser() {
  if (!hasSupabaseEnv()) {
    throw new Error('Supabase is not configured');
  }

  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('Authentication required');
  }

  return { supabase, user };
}

function normalizeCollectionSlug(title: string) {
  return `${slugify(title)}-${Date.now().toString(36).slice(-4)}`;
}

export async function getCollectionsForCurrentUserClient() {
  try {
    const { supabase, user } = await requireCurrentUser();
    const [{ data: collections, error: collectionsError }, { data: items, error: itemsError }] =
      await Promise.all([
        supabase
          .from('collections')
          .select('id, slug, title, description, cover_theme, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .returns<CollectionRow[]>(),
        supabase
          .from('collection_items')
          .select('collection_id')
          .eq('user_id', user.id)
          .returns<Array<{ collection_id: string }>>(),
      ]);

    if (collectionsError) {
      throw collectionsError;
    }

    if (itemsError) {
      throw itemsError;
    }

    const counts = new Map<string, number>();
    (items ?? []).forEach((item) => {
      counts.set(item.collection_id, (counts.get(item.collection_id) ?? 0) + 1);
    });

    const mappedCollections = (collections ?? []).map((row) =>
      collectionRowToSummary(row, counts.get(row.id) ?? 0)
    );

    return { collections: mappedCollections, error: null as PostgrestError | Error | null };
  } catch (error) {
    return {
      collections: [] as CollectionSummary[],
      error: error as PostgrestError | Error,
    };
  }
}

export async function createCollectionForCurrentUser(input: {
  title: string;
  description?: string;
  coverTheme: SavedBook['coverTheme'];
}) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { data, error } = await supabase
      .from('collections')
      .insert({
        user_id: user.id,
        slug: normalizeCollectionSlug(input.title),
        title: input.title.trim(),
        description: input.description?.trim() || null,
        cover_theme: input.coverTheme,
      })
      .select('id, slug, title, description, cover_theme, updated_at')
      .single<CollectionRow>();

    if (error) {
      throw error;
    }

    return {
      collection: collectionRowToSummary(data, 0),
      error: null as PostgrestError | Error | null,
    };
  } catch (error) {
    return {
      collection: null as CollectionSummary | null,
      error: error as PostgrestError | Error,
    };
  }
}

export async function deleteCollectionForCurrentUser(id: string) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return { error: null as PostgrestError | Error | null };
  } catch (error) {
    return { error: error as PostgrestError | Error };
  }
}

export async function updateCollectionForCurrentUser(input: {
  id: string;
  title: string;
  description?: string;
  coverTheme: SavedBook['coverTheme'];
}) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { data, error } = await supabase
      .from('collections')
      .update({
        title: input.title.trim(),
        description: input.description?.trim() || null,
        cover_theme: input.coverTheme,
      })
      .eq('id', input.id)
      .eq('user_id', user.id)
      .select('id, slug, title, description, cover_theme, updated_at')
      .single<CollectionRow>();

    if (error) {
      throw error;
    }

    return {
      collection: collectionRowToSummary(data, 0),
      error: null as PostgrestError | Error | null,
    };
  } catch (error) {
    return {
      collection: null as CollectionSummary | null,
      error: error as PostgrestError | Error,
    };
  }
}

export async function addEntityToCollectionForCurrentUser(input: {
  collectionId: string;
  entityType: CollectionEntityType;
  entityId: string;
  title: string;
  slug: string;
  coverTheme: SavedBook['coverTheme'];
  summary?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { data: existing } = await supabase
      .from('collection_items')
      .select('position')
      .eq('collection_id', input.collectionId)
      .eq('user_id', user.id)
      .order('position', { ascending: false })
      .limit(1)
      .returns<Array<{ position: number }>>();

    const nextPosition = (existing?.[0]?.position ?? -1) + 1;
    const { data, error } = await supabase
      .from('collection_items')
      .upsert(
        {
          collection_id: input.collectionId,
          user_id: user.id,
          entity_type: input.entityType,
          entity_id: input.entityId,
          title: input.title,
          slug: input.slug,
          cover_theme: input.coverTheme,
          summary: input.summary ?? null,
          metadata: input.metadata ?? {},
          position: nextPosition,
        },
        { onConflict: 'collection_id,entity_type,entity_id' }
      )
      .select(
        'id, collection_id, entity_type, entity_id, title, slug, cover_theme, summary, metadata, position, created_at'
      )
      .single<CollectionItemRow>();

    if (error) {
      throw error;
    }

    return {
      item: collectionItemRowToSummary(data),
      error: null as PostgrestError | Error | null,
    };
  } catch (error) {
    return {
      item: null as CollectionItemSummary | null,
      error: error as PostgrestError | Error,
    };
  }
}

export async function removeCollectionItemForCurrentUser(id: string) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { error } = await supabase
      .from('collection_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return { error: null as PostgrestError | Error | null };
  } catch (error) {
    return { error: error as PostgrestError | Error };
  }
}

export async function saveComparisonForCurrentUser(input: {
  left: HistoryTopic;
  right: HistoryTopic;
  comparison: ComparisonExperience;
  locale: Locale;
}) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { data, error } = await supabase
      .from('comparison_records')
      .insert({
        user_id: user.id,
        slug: `${slugify(input.left.slug)}-${slugify(input.right.slug)}-${Date.now()
          .toString(36)
          .slice(-4)}`,
        title: input.comparison.title,
        left_slug: input.left.slug,
        left_title: input.left.title,
        right_slug: input.right.slug,
        right_title: input.right.title,
        locale: input.locale,
        summary: input.comparison.subtitle,
        comparison_snapshot: {
          comparison: input.comparison,
          left: input.left,
          right: input.right,
        },
      })
      .select(
        'id, slug, title, left_slug, left_title, right_slug, right_title, locale, summary, comparison_snapshot, created_at, updated_at'
      )
      .single<ComparisonRecordRow>();

    if (error) {
      throw error;
    }

    return {
      record: comparisonRowToRecord(data),
      error: null as PostgrestError | Error | null,
    };
  } catch (error) {
    return {
      record: null as SavedComparisonRecord | null,
      error: error as PostgrestError | Error,
    };
  }
}

export async function getTopicAnnotationsForCurrentUser(topicSlug: string) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const [{ data: notes, error: notesError }, { data: bookmarks, error: bookmarksError }] =
      await Promise.all([
        supabase
          .from('topic_notes')
          .select(
            'id, topic_slug, topic_title, section_key, content, created_at, updated_at'
          )
          .eq('user_id', user.id)
          .eq('topic_slug', topicSlug)
          .order('updated_at', { ascending: false })
          .returns<TopicNoteRow[]>(),
        supabase
          .from('topic_bookmarks')
          .select('id, topic_slug, topic_title, section_key, note, created_at, updated_at')
          .eq('user_id', user.id)
          .eq('topic_slug', topicSlug)
          .order('created_at', { ascending: false })
          .returns<TopicBookmarkRow[]>(),
      ]);

    if (notesError) {
      throw notesError;
    }

    if (bookmarksError) {
      throw bookmarksError;
    }

    return {
      notes: (notes ?? []).map(topicNoteRowToNote),
      bookmarks: (bookmarks ?? []).map(topicBookmarkRowToBookmark),
      error: null as PostgrestError | Error | null,
    };
  } catch (error) {
    return {
      notes: [] as TopicNote[],
      bookmarks: [] as TopicBookmark[],
      error: error as PostgrestError | Error,
    };
  }
}

export async function createTopicNoteForCurrentUser(input: {
  topicSlug: string;
  topicTitle: string;
  savedResearchId?: string | null;
  sectionKey?: string | null;
  content: string;
}) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { data, error } = await supabase
      .from('topic_notes')
      .insert({
        user_id: user.id,
        topic_slug: input.topicSlug,
        topic_title: input.topicTitle,
        saved_research_id: input.savedResearchId ?? null,
        section_key: input.sectionKey ?? null,
        content: input.content.trim(),
      })
      .select(
        'id, topic_slug, topic_title, section_key, content, created_at, updated_at'
      )
      .single<TopicNoteRow>();

    if (error) {
      throw error;
    }

    return {
      note: topicNoteRowToNote(data),
      error: null as PostgrestError | Error | null,
    };
  } catch (error) {
    return {
      note: null as TopicNote | null,
      error: error as PostgrestError | Error,
    };
  }
}

export async function updateTopicNoteForCurrentUser(id: string, content: string) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { data, error } = await supabase
      .from('topic_notes')
      .update({ content: content.trim() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(
        'id, topic_slug, topic_title, section_key, content, created_at, updated_at'
      )
      .single<TopicNoteRow>();

    if (error) {
      throw error;
    }

    return {
      note: topicNoteRowToNote(data),
      error: null as PostgrestError | Error | null,
    };
  } catch (error) {
    return {
      note: null as TopicNote | null,
      error: error as PostgrestError | Error,
    };
  }
}

export async function deleteTopicNoteForCurrentUser(id: string) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { error } = await supabase
      .from('topic_notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return { error: null as PostgrestError | Error | null };
  } catch (error) {
    return { error: error as PostgrestError | Error };
  }
}

export async function createTopicBookmarkForCurrentUser(input: {
  topicSlug: string;
  topicTitle: string;
  savedResearchId?: string | null;
  sectionKey: string;
  note?: string | null;
}) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { data, error } = await supabase
      .from('topic_bookmarks')
      .insert({
        user_id: user.id,
        topic_slug: input.topicSlug,
        topic_title: input.topicTitle,
        saved_research_id: input.savedResearchId ?? null,
        section_key: input.sectionKey,
        note: input.note?.trim() || null,
      })
      .select('id, topic_slug, topic_title, section_key, note, created_at, updated_at')
      .single<TopicBookmarkRow>();

    if (error) {
      throw error;
    }

    return {
      bookmark: topicBookmarkRowToBookmark(data),
      error: null as PostgrestError | Error | null,
    };
  } catch (error) {
    return {
      bookmark: null as TopicBookmark | null,
      error: error as PostgrestError | Error,
    };
  }
}

export async function deleteTopicBookmarkForCurrentUser(id: string) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { error } = await supabase
      .from('topic_bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return { error: null as PostgrestError | Error | null };
  } catch (error) {
    return { error: error as PostgrestError | Error };
  }
}

export async function upsertPathProgressForCurrentUser(input: {
  pathSlug: string;
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
}) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { error } = await supabase.from('user_path_progress').upsert({
      user_id: user.id,
      path_slug: input.pathSlug,
      status: input.isCompleted ? 'completed' : 'in_progress',
      current_step: input.currentStep,
      completed_steps: input.completedSteps,
      completed_at: input.isCompleted ? new Date().toISOString() : null,
    });

    if (error) {
      throw error;
    }

    return { error: null as PostgrestError | Error | null };
  } catch (error) {
    return { error: error as PostgrestError | Error };
  }
}

export async function recordUserActivityForCurrentUser(input: {
  eventType: string;
  referenceType: string;
  referenceId: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { error } = await supabase.from('user_activity_events').insert({
      user_id: user.id,
      event_type: input.eventType,
      reference_type: input.referenceType,
      reference_id: input.referenceId,
      metadata: input.metadata ?? {},
    });

    if (error) {
      throw error;
    }

    return { error: null as PostgrestError | Error | null };
  } catch (error) {
    return { error: error as PostgrestError | Error };
  }
}

export async function updateResumeStateForCurrentUser(input: {
  lastResearchId?: string | null;
  lastTopicSlug?: string | null;
  lastTopicTitle?: string | null;
  lastComparisonId?: string | null;
  lastPathSlug?: string | null;
  lastCollectionSlug?: string | null;
}) {
  try {
    const { supabase, user } = await requireCurrentUser();
    const { error } = await supabase.from('user_resume_state').upsert({
      user_id: user.id,
      last_research_id: input.lastResearchId ?? null,
      last_topic_slug: input.lastTopicSlug ?? null,
      last_topic_title: input.lastTopicTitle ?? null,
      last_comparison_id: input.lastComparisonId ?? null,
      last_path_slug: input.lastPathSlug ?? null,
      last_collection_slug: input.lastCollectionSlug ?? null,
    });

    if (error) {
      throw error;
    }

    return { error: null as PostgrestError | Error | null };
  } catch (error) {
    return { error: error as PostgrestError | Error };
  }
}
