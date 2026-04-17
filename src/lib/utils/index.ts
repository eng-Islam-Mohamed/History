import {
  CoverStyle,
  CoverTheme,
  HistoryTopic,
  RelatedEntity,
  SavedBook,
  TimelineEvent,
  TopicCategory,
} from '@/types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export function getCoverThemeForCategory(category: TopicCategory): CoverTheme {
  const themeMap: Record<TopicCategory, CoverTheme> = {
    figure: 'midnight-scholar',
    war: 'oxblood-war',
    kingdom: 'imperial-navy',
    country: 'emerald-dynasty',
    civilization: 'bronze-civilization',
    event: 'ancient-sand',
    empire: 'royal-purple',
    dynasty: 'emerald-dynasty',
    era: 'ancient-sand',
  };
  return themeMap[category] || 'imperial-navy';
}

export function getCoverStyle(theme: CoverTheme): CoverStyle {
  const styles: Record<CoverTheme, CoverStyle> = {
    'imperial-navy': {
      background: '#0d2137',
      accentColor: '#dec395',
      spineColor: '#0a192f',
      textColor: '#dec395',
      iconName: 'workspace_premium',
    },
    'ancient-sand': {
      background: '#3d3428',
      accentColor: '#dec395',
      spineColor: '#2a241c',
      textColor: '#1a1410',
      iconName: 'temple_hindu',
    },
    'obsidian-industrial': {
      background: '#131313',
      accentColor: '#b87333',
      spineColor: '#0a0a0a',
      textColor: '#e5e2e1',
      iconName: 'settings',
    },
    'oxblood-war': {
      background: '#2a1215',
      accentColor: '#f8b6b2',
      spineColor: '#1a0a0c',
      textColor: '#f8b6b2',
      iconName: 'shield',
    },
    'emerald-dynasty': {
      background: '#0d2a1f',
      accentColor: '#7ecfa0',
      spineColor: '#071a13',
      textColor: '#7ecfa0',
      iconName: 'castle',
    },
    'royal-purple': {
      background: '#1a0d2e',
      accentColor: '#c4a0e8',
      spineColor: '#12081f',
      textColor: '#c4a0e8',
      iconName: 'crown',
    },
    'bronze-civilization': {
      background: '#2a2015',
      accentColor: '#cd9a5b',
      spineColor: '#1a1408',
      textColor: '#cd9a5b',
      iconName: 'account_balance',
    },
    'midnight-scholar': {
      background: '#0e1a2e',
      accentColor: '#8bb8e8',
      spineColor: '#071020',
      textColor: '#8bb8e8',
      iconName: 'auto_stories',
    },
  };
  return styles[theme];
}

const mojibakeReplacements: Array<[string, string]> = [
  ['â€“', '-'],
  ['â€”', '-'],
  ['â€¢', '•'],
  ['â€™', "'"],
  ['â€œ', '"'],
  ['â€', '"'],
  ['Â©', 'Copyright'],
  ['Ã©', 'e'],
  ['Ã¨', 'e'],
  ['Ãª', 'e'],
  ['Ã«', 'e'],
  ['Ã¡', 'a'],
  ['Ã ', 'a'],
  ['Ã¢', 'a'],
  ['Ã¤', 'a'],
  ['Ã­', 'i'],
  ['Ã¯', 'i'],
  ['Ã³', 'o'],
  ['Ã¶', 'o'],
  ['Ãº', 'u'],
  ['Ã¼', 'u'],
  ['Ã±', 'n'],
  ['Ã§', 'c'],
  ['Å“', 'oe'],
  ['Ã', 'A'],
];

export function cleanText(value: string): string {
  if (!value || !/[ÂÃâÅ]/.test(value)) {
    return value;
  }

  return mojibakeReplacements.reduce(
    (result, [search, replacement]) => result.split(search).join(replacement),
    value
  );
}

export function sanitizeTimelineEvent(event: TimelineEvent): TimelineEvent {
  return {
    ...event,
    year: cleanText(event.year),
    title: cleanText(event.title),
    description: cleanText(event.description),
  };
}

export function sanitizeRelatedEntity(entity: RelatedEntity): RelatedEntity {
  return {
    ...entity,
    name: cleanText(entity.name),
    shortDescription: cleanText(entity.shortDescription),
    role: entity.role ? cleanText(entity.role) : entity.role,
    imageUrl: entity.imageUrl,
  };
}

export function sanitizeTopic(topic: HistoryTopic): HistoryTopic {
  return {
    ...topic,
    title: cleanText(topic.title),
    query: cleanText(topic.query),
    era: cleanText(topic.era),
    summary: cleanText(topic.summary),
    fullContent: cleanText(topic.fullContent),
    region: cleanText(topic.region),
    quote: topic.quote ? cleanText(topic.quote) : topic.quote,
    quoteAuthor: topic.quoteAuthor ? cleanText(topic.quoteAuthor) : topic.quoteAuthor,
    heroImageAlt: topic.heroImageAlt ? cleanText(topic.heroImageAlt) : topic.heroImageAlt,
    volumeNumber: topic.volumeNumber ? cleanText(topic.volumeNumber) : topic.volumeNumber,
    timelineEvents: topic.timelineEvents.map(sanitizeTimelineEvent),
    keyFigures: topic.keyFigures.map(sanitizeRelatedEntity),
    relatedTopics: topic.relatedTopics.map(sanitizeRelatedEntity),
    relatedEvents: topic.relatedEvents.map(sanitizeRelatedEntity),
  };
}

export function sanitizeSavedBook(book: SavedBook): SavedBook {
  return {
    ...book,
    title: cleanText(book.title),
    era: cleanText(book.era),
    summarySnippet: cleanText(book.summarySnippet),
    originalQuery: cleanText(book.originalQuery),
    curatorNote: book.curatorNote ? cleanText(book.curatorNote) : book.curatorNote,
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
