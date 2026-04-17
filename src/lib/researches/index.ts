import { Locale } from '@/i18n/config';
import { HistoryTopic, SavedBook } from '@/types';
import { sanitizeTopic } from '@/lib/utils';

export interface SavedResearchRow {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  query: string;
  category: string;
  era: string;
  region: string;
  summary_snippet: string;
  curator_note: string | null;
  cover_theme: SavedBook['coverTheme'];
  locale: Locale;
  topic_snapshot: HistoryTopic;
  created_at: string;
  updated_at: string;
}

function buildSummarySnippet(topic: HistoryTopic) {
  const snippet = topic.summary.slice(0, 200).trim();
  return snippet.endsWith('.') ? snippet : `${snippet}...`;
}

export function createSavedBook(topic: HistoryTopic): SavedBook {
  return {
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
    category: topic.category,
    era: topic.era,
    summarySnippet: buildSummarySnippet(topic),
    coverTheme: topic.coverTheme,
    createdAt: topic.createdAt,
    originalQuery: topic.query,
    curatorNote: topic.summary.slice(0, 150).trim(),
  };
}

export function createSavedResearchPayload(topic: HistoryTopic, locale: Locale) {
  const snapshot = sanitizeTopic(topic);
  const book = createSavedBook(snapshot);

  return {
    slug: snapshot.slug,
    title: snapshot.title,
    query: snapshot.query,
    category: snapshot.category,
    era: snapshot.era,
    region: snapshot.region,
    summary_snippet: book.summarySnippet,
    curator_note: book.curatorNote ?? null,
    cover_theme: snapshot.coverTheme,
    locale,
    topic_snapshot: snapshot,
  };
}

export function savedResearchToBook(row: SavedResearchRow): SavedBook {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category as SavedBook['category'],
    era: row.era,
    summarySnippet: row.summary_snippet,
    coverTheme: row.cover_theme,
    createdAt: row.created_at,
    originalQuery: row.query,
    curatorNote: row.curator_note ?? undefined,
  };
}

export function savedResearchToTopic(row: SavedResearchRow): HistoryTopic {
  const snapshot = sanitizeTopic(row.topic_snapshot);

  return {
    ...snapshot,
    id: row.id,
    title: row.title,
    slug: row.slug,
    query: row.query,
    category: row.category as HistoryTopic['category'],
    era: row.era,
    region: row.region,
    createdAt: row.created_at,
    coverTheme: row.cover_theme,
  };
}
