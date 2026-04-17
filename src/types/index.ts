export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface RelatedEntity {
  name: string;
  type:
    | 'figure'
    | 'event'
    | 'place'
    | 'conflict'
    | 'civilization'
    | 'country'
    | 'empire'
    | 'dynasty'
    | 'era'
    | 'kingdom';
  shortDescription: string;
  imageUrl?: string;
  role?: string;
}

export interface HistoryTopic {
  id: string;
  title: string;
  slug: string;
  query: string;
  category: TopicCategory;
  era: string;
  summary: string;
  fullContent: string;
  timelineEvents: TimelineEvent[];
  keyFigures: RelatedEntity[];
  relatedTopics: RelatedEntity[];
  relatedEvents: RelatedEntity[];
  region: string;
  createdAt: string;
  coverTheme: CoverTheme;
  quote?: string;
  quoteAuthor?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  volumeNumber?: string;
}

export interface SavedBook {
  id: string;
  title: string;
  slug: string;
  category: TopicCategory;
  era: string;
  summarySnippet: string;
  coverTheme: CoverTheme;
  createdAt: string;
  originalQuery: string;
  curatorNote?: string;
}

export type TopicCategory =
  | 'figure'
  | 'war'
  | 'kingdom'
  | 'country'
  | 'civilization'
  | 'event'
  | 'empire'
  | 'dynasty'
  | 'era';

export type CoverTheme =
  | 'imperial-navy'
  | 'ancient-sand'
  | 'obsidian-industrial'
  | 'oxblood-war'
  | 'emerald-dynasty'
  | 'royal-purple'
  | 'bronze-civilization'
  | 'midnight-scholar';

export interface SearchState {
  query: string;
  isLoading: boolean;
  result: HistoryTopic | null;
  error: string | null;
}

export interface CoverStyle {
  background: string;
  accentColor: string;
  spineColor: string;
  textColor: string;
  iconName: string;
  overlayStyle?: string;
}
