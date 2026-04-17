import { SavedBook, HistoryTopic } from '@/types';
import {
  generateId,
  getCoverThemeForCategory,
  sanitizeSavedBook,
  sanitizeTopic,
  slugify,
} from '@/lib/utils';

const STORAGE_KEY = 'chronolivre_library';

export function getSavedBooks(): SavedBook[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as SavedBook[]).map(sanitizeSavedBook);
  } catch {
    return [];
  }
}

export function saveBook(topic: HistoryTopic): SavedBook {
  const sanitizedTopic = sanitizeTopic(topic);
  const books = getSavedBooks();
  
  // Check for duplicate by slug
  const existing = books.find(
    (b) =>
      b.slug === sanitizedTopic.slug ||
      b.originalQuery.toLowerCase() === sanitizedTopic.query.toLowerCase()
  );
  if (existing) return existing;

  const newBook: SavedBook = {
    id: sanitizedTopic.id || generateId(),
    title: sanitizedTopic.title,
    slug: sanitizedTopic.slug || slugify(sanitizedTopic.title),
    category: sanitizedTopic.category,
    era: sanitizedTopic.era,
    summarySnippet: `${sanitizedTopic.summary.slice(0, 200)}...`,
    coverTheme:
      sanitizedTopic.coverTheme || getCoverThemeForCategory(sanitizedTopic.category),
    createdAt: new Date().toISOString(),
    originalQuery: sanitizedTopic.query,
    curatorNote: sanitizedTopic.summary.slice(0, 150),
  };

  books.unshift(newBook);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  return sanitizeSavedBook(newBook);
}

export function removeBook(id: string): void {
  const books = getSavedBooks().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function clearLibrary(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getBookCount(): number {
  return getSavedBooks().length;
}

export function bookExists(slug: string): boolean {
  return getSavedBooks().some((b) => b.slug === slug);
}
