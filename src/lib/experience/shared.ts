import {
  CollectionItemSummary,
  CollectionSummary,
  SavedComparisonRecord,
  TopicBookmark,
  TopicNote,
} from '@/types/experience';

export interface CollectionRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_theme: CollectionSummary['coverTheme'];
  updated_at: string;
}

export interface CollectionItemRow {
  id: string;
  collection_id: string;
  entity_type: CollectionItemSummary['entityType'];
  entity_id: string;
  title: string;
  slug: string;
  cover_theme: CollectionItemSummary['coverTheme'];
  summary: string | null;
  metadata: Record<string, unknown>;
  position: number;
  created_at: string;
}

export interface ComparisonRecordRow {
  id: string;
  slug: string;
  title: string;
  left_slug: string;
  left_title: string;
  right_slug: string;
  right_title: string;
  locale: string;
  summary: string;
  comparison_snapshot: {
    comparison: SavedComparisonRecord['comparison'];
    left: SavedComparisonRecord['leftTopic'];
    right: SavedComparisonRecord['rightTopic'];
  };
  created_at: string;
  updated_at: string;
}

export interface TopicNoteRow {
  id: string;
  topic_slug: string;
  topic_title: string;
  section_key: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TopicBookmarkRow {
  id: string;
  topic_slug: string;
  topic_title: string;
  section_key: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export function collectionRowToSummary(
  row: CollectionRow,
  itemCount: number
): CollectionSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    coverTheme: row.cover_theme,
    itemCount,
    updatedAt: row.updated_at,
  };
}

export function collectionItemRowToSummary(row: CollectionItemRow): CollectionItemSummary {
  return {
    id: row.id,
    collectionId: row.collection_id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    title: row.title,
    slug: row.slug,
    coverTheme: row.cover_theme,
    summary: row.summary,
    metadata: row.metadata ?? {},
    position: row.position,
    createdAt: row.created_at,
  };
}

export function comparisonRowToRecord(row: ComparisonRecordRow): SavedComparisonRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    locale: row.locale,
    leftSlug: row.left_slug,
    leftTitle: row.left_title,
    rightSlug: row.right_slug,
    rightTitle: row.right_title,
    leftTopic: row.comparison_snapshot?.left ?? null,
    rightTopic: row.comparison_snapshot?.right ?? null,
    comparison:
      row.comparison_snapshot?.comparison ??
      ({
        title: row.title,
        subtitle: row.summary,
        leftTitle: row.left_title,
        rightTitle: row.right_title,
        similarities: [],
        differences: [],
        sections: [],
        confidence: {
          level: 'uncertain',
          label: 'Uncertain',
          note: 'This saved comparison is missing part of its structured snapshot.',
        },
      } as SavedComparisonRecord['comparison']),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function topicNoteRowToNote(row: TopicNoteRow): TopicNote {
  return {
    id: row.id,
    topicSlug: row.topic_slug,
    topicTitle: row.topic_title,
    sectionKey: row.section_key,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function topicBookmarkRowToBookmark(row: TopicBookmarkRow): TopicBookmark {
  return {
    id: row.id,
    topicSlug: row.topic_slug,
    topicTitle: row.topic_title,
    sectionKey: row.section_key,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
