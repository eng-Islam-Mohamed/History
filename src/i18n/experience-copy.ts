import { Locale } from '@/i18n/config';

const sharedCopy = {
  compare: {
    eyebrow: 'Compare Mode',
    title: 'Place two historical dossiers in dialogue.',
    description:
      'Search two topics, let the archive align them, and read through their similarities, turning points, and long-term influence side by side.',
    leftQuery: 'Left topic',
    rightQuery: 'Right topic',
    prompt: 'Search for a figure, empire, war, civilization, or country...',
    swap: 'Swap sides',
    compare: 'Compare',
    another: 'Compare another',
    saving: 'Saving comparison...',
    save: 'Save comparison',
    saved: 'Saved to your archive',
    saveError: 'This comparison could not be saved right now.',
    emptyTitle: 'Build an intelligent comparison',
    emptyDescription:
      'Start with two topics and ChronoLivre will structure the relationship across origin, power, conflict, legacy, and downstream influence.',
    similarities: 'Key similarities',
    differences: 'Key differences',
    addToCollection: 'Add comparison to shelf',
    addTopicToCollection: 'Add topic to shelf',
  },
  timeline: {
    eyebrow: 'Interactive Timeline',
    title: 'Shift between centuries, decades, and dense turning points.',
    description:
      'Use the shared timeline engine to inspect key events, filter by theme, and open details without losing the bigger arc.',
    zoomCentury: 'Century',
    zoomDecade: 'Decade',
    zoomYear: 'Year',
    filters: 'Filters',
    jumpTo: 'Jump to period',
    openTopic: 'Open topic',
  },
  map: {
    eyebrow: 'Living World Map',
    title: 'A stylized atlas of influence, conflict, and circulation.',
    description:
      'Drag the year slider and watch the active historical layer shift across eras, with clear confidence labels where historical precision is approximate.',
    year: 'Year',
    legend: 'Legend',
    overlayActive: 'Active overlays',
    uncertainty: 'Some borders and zones are interpretive rather than exact.',
  },
  collections: {
    eyebrow: 'Collections',
    title: 'Arrange dossiers into premium shelves.',
    description:
      'Group saved books, comparisons, and guided paths into curated shelves with their own visual identity.',
    create: 'Create shelf',
    creating: 'Creating...',
    titleField: 'Shelf title',
    descriptionField: 'Description',
    emptyTitle: 'No shelves yet',
    emptyDescription:
      'Create your first shelf to organize figures, empires, wars, paths, or comparisons around a theme.',
    add: 'Add to shelf',
    remove: 'Remove',
    delete: 'Delete shelf',
    emptyCollection: 'This shelf is waiting for its first dossier.',
  },
  paths: {
    eyebrow: 'Deep Dive Paths',
    title: 'Guided historical journeys with progress tracking.',
    description:
      'Follow a curated route, mark chapters as completed, and keep the reading arc preserved in your profile.',
    follow: 'Follow path',
    resume: 'Resume path',
    markComplete: 'Mark chapter complete',
    completed: 'Completed',
    progress: 'Progress',
    estimated: 'Estimated time',
    difficulty: 'Depth',
  },
  topic: {
    readingMode: 'Reading mode',
    standardMode: 'Standard mode',
    sourceConfidence: 'Source confidence',
    perspectives: 'Perspective mode',
    debate: 'Debate mode',
    askEra: 'Ask the era',
    notes: 'Notes',
    bookmarks: 'Bookmarks',
    recommendations: 'Smart recommendations',
    addToCollection: 'Add dossier to shelf',
    addBookmark: 'Bookmark section',
    addNote: 'Add note',
    saveNote: 'Save note',
    updateNote: 'Update note',
    deleteNote: 'Delete note',
    bookmarkSaved: 'Section bookmarked',
    bookmarkRemoved: 'Bookmark removed',
    notePlaceholder:
      'Capture an argument, a date, a question, or a connection you want to revisit later.',
  },
  knowledge: {
    title: 'Personal knowledge profile',
    description:
      'A living picture of your historical taste, study rhythm, and long-term exploration patterns.',
    streak: 'Explorer streak',
    favoriteEras: 'Favorite eras',
    favoriteRegions: 'Favorite regions',
    readingDepth: 'Reading depth',
    completedPaths: 'Completed paths',
    comparisons: 'Comparisons',
    collections: 'Shelves',
    savedBooks: 'Saved dossiers',
    continueExploring: 'Continue exploring',
    quests: 'Historical quests',
    badges: 'Era badges',
  },
  confidence: {
    'commonly-accepted': 'Commonly accepted',
    debated: 'Debated',
    uncertain: 'Uncertain',
    approximate: 'Approximate',
  },
  askEra: {
    defaultPrompt: 'How would a citizen of this era interpret the event?',
    generate: 'Generate perspective',
    generating: 'Generating...',
    caution:
      'Perspective mode is a historically informed simulation, not a literal eyewitness account.',
  },
} as const;

export function getExperienceCopy(locale: Locale) {
  void locale;
  return sharedCopy;
}
