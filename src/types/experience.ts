import { CoverTheme, HistoryTopic, TopicCategory } from '@/types';

export type ConfidenceLevel =
  | 'commonly-accepted'
  | 'debated'
  | 'uncertain'
  | 'approximate';

export interface ConfidenceMetadata {
  level: ConfidenceLevel;
  label: string;
  note: string;
  citations?: string[];
}

export type PerspectiveLens =
  | 'political'
  | 'military'
  | 'social'
  | 'economic'
  | 'cultural'
  | 'religious';

export interface PerspectivePanel {
  lens: PerspectiveLens;
  title: string;
  summary: string;
  bullets: string[];
}

export interface DebateSide {
  title: string;
  argument: string;
  evidence: string[];
}

export interface DebateBlockData {
  question: string;
  consensus: string;
  uncertainty: string;
  sides: DebateSide[];
  confidence: ConfidenceMetadata;
}

export interface RecommendationItem {
  slug: string;
  title: string;
  category: TopicCategory;
  era: string;
  region: string;
  summary: string;
  reason: string;
  query: string;
  coverTheme: CoverTheme;
}

export type TimelineCategory =
  | 'war'
  | 'ruler'
  | 'political'
  | 'cultural'
  | 'invention'
  | 'dynasty'
  | 'society'
  | 'expansion';

export interface TimelineEngineEvent {
  id: string;
  title: string;
  description: string;
  yearLabel: string;
  startYear: number;
  endYear?: number | null;
  category: TimelineCategory;
  region: string;
  importance: 1 | 2 | 3 | 4 | 5;
  relatedTopics: string[];
  confidence: ConfidenceMetadata;
}

export type CompareSectionId =
  | 'overview'
  | 'origin'
  | 'timeline'
  | 'political-structure'
  | 'military-power'
  | 'economy'
  | 'culture-society'
  | 'key-figures'
  | 'turning-points'
  | 'major-conflicts'
  | 'decline-legacy'
  | 'influence';

export interface CompareSection {
  id: CompareSectionId;
  label: string;
  left: string;
  right: string;
  summary: string;
}

export interface ComparisonExperience {
  title: string;
  subtitle: string;
  leftTitle: string;
  rightTitle: string;
  similarities: string[];
  differences: string[];
  sections: CompareSection[];
  confidence: ConfidenceMetadata;
}

export interface SavedComparisonRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  locale: string;
  leftSlug: string;
  leftTitle: string;
  rightSlug: string;
  rightTitle: string;
  leftTopic: HistoryTopic | null;
  rightTopic: HistoryTopic | null;
  comparison: ComparisonExperience;
  createdAt: string;
  updatedAt: string;
}

export interface AskEraResponse {
  title: string;
  perspective: string;
  response: string;
  caution: string;
}

export type HistoricalMapCategory = TopicCategory | 'route' | 'conflict';

export interface HistoricalMapHotspotFact {
  label: string;
  value: string;
}

export interface HistoricalMapEraPreset {
  id: string;
  year: number;
  label: string;
  description: string;
}

export interface HistoricalMapHotspot {
  id: string;
  title: string;
  category: HistoricalMapCategory;
  query: string;
  region: string;
  startYear: number;
  endYear: number;
  x: number;
  y: number;
  radius: number;
  summary: string;
  facts: HistoricalMapHotspotFact[];
  significance: string[];
  presentDay: string[];
  relatedQueries: string[];
  confidence: ConfidenceMetadata;
}

export interface DeepDiveChapter {
  id: string;
  title: string;
  description: string;
  query: string;
  estimatedMinutes: number;
  category: TopicCategory;
  era: string;
  region: string;
  coverTheme: CoverTheme;
}

export interface DeepDivePath {
  slug: string;
  title: string;
  description: string;
  coverTheme: CoverTheme;
  theme: string;
  estimatedMinutes: number;
  difficulty: 'Introductory' | 'Intermediate' | 'Advanced';
  chapters: DeepDiveChapter[];
}

export type CollectionEntityType = 'research' | 'comparison' | 'path';

export interface CollectionSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverTheme: CoverTheme;
  itemCount: number;
  updatedAt: string;
}

export interface CollectionItemSummary {
  id: string;
  collectionId: string;
  entityType: CollectionEntityType;
  entityId: string;
  title: string;
  slug: string;
  coverTheme: CoverTheme;
  summary: string | null;
  metadata: Record<string, unknown>;
  position: number;
  createdAt: string;
}

export interface TopicNote {
  id: string;
  topicSlug: string;
  topicTitle: string;
  sectionKey: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopicBookmark {
  id: string;
  topicSlug: string;
  topicTitle: string;
  sectionKey: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContinueExploringItem {
  type: 'topic' | 'comparison' | 'path' | 'collection';
  title: string;
  href: string;
  summary: string;
  eyebrow: string;
  coverTheme: CoverTheme;
}

export interface EraBadge {
  id: string;
  title: string;
  description: string;
  tone: 'gold' | 'teal' | 'bronze';
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface HistoricalQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unlocked: boolean;
}

export interface KnowledgeProfile {
  favoriteEras: string[];
  favoriteRegions: string[];
  mostSearchedTopics: string[];
  completedPaths: number;
  savedBooksCount: number;
  comparisonsMade: number;
  collectionsCreated: number;
  notesCount: number;
  bookmarksCount: number;
  readingMinutes: number;
  streakDays: number;
  badges: EraBadge[];
  quests: HistoricalQuest[];
  continueExploring: ContinueExploringItem[];
}
