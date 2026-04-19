import {
  ConfidenceMetadata,
  DeepDivePath,
  HistoricalMapHotspot,
} from '@/types/experience';

const acceptedConfidence: ConfidenceMetadata = {
  level: 'commonly-accepted',
  label: 'Commonly accepted',
  note: 'This interpretation is broadly aligned with standard historical consensus.',
};

const approximateConfidence: ConfidenceMetadata = {
  level: 'approximate',
  label: 'Approximate',
  note:
    'Boundaries, chronology, or territorial influence here should be read as interpretive rather than exact.',
};

export const deepDivePaths: DeepDivePath[] = [
  {
    slug: 'fall-of-empires',
    title: 'Fall of Empires',
    description:
      'Trace how imperial systems lose coherence, legitimacy, and territorial control across different eras.',
    coverTheme: 'imperial-navy',
    theme: 'Imperial transitions',
    estimatedMinutes: 48,
    difficulty: 'Intermediate',
    chapters: [
      {
        id: 'rome-fractures',
        title: 'The fractures of Rome',
        description:
          'Study how administrative overstretch, military pressure, and political fragmentation weakened Roman authority.',
        query: 'Roman Empire',
        estimatedMinutes: 12,
        category: 'empire',
        era: '27 BC - 476 AD',
        region: 'Europe / Mediterranean',
        coverTheme: 'imperial-navy',
      },
      {
        id: 'ottoman-retreat',
        title: 'Ottoman retreat and reinvention',
        description:
          'Follow the empire from continental powerhouse to contested legacy under global pressure.',
        query: 'Ottoman Empire',
        estimatedMinutes: 12,
        category: 'empire',
        era: '1299 - 1922 AD',
        region: 'Europe / Middle East / North Africa',
        coverTheme: 'royal-purple',
      },
      {
        id: 'ww1-collapse',
        title: 'World War I and collapsing orders',
        description:
          'Examine how industrial war accelerated the end of long-standing imperial systems.',
        query: 'World War I',
        estimatedMinutes: 14,
        category: 'war',
        era: '1914 - 1918 AD',
        region: 'Global',
        coverTheme: 'oxblood-war',
      },
      {
        id: 'legacy-afterlives',
        title: 'Imperial afterlives',
        description:
          'Compare the legal, administrative, and cultural inheritances empires leave behind after political collapse.',
        query: 'Byzantine Empire',
        estimatedMinutes: 10,
        category: 'empire',
        era: '330 - 1453 AD',
        region: 'Eastern Mediterranean',
        coverTheme: 'bronze-civilization',
      },
    ],
  },
  {
    slug: 'great-islamic-dynasties',
    title: 'Great Islamic Dynasties',
    description:
      'Move through courts, capitals, scholarship, and imperial governance across major Islamic polities.',
    coverTheme: 'emerald-dynasty',
    theme: 'Dynasties and scholarship',
    estimatedMinutes: 44,
    difficulty: 'Introductory',
    chapters: [
      {
        id: 'umayyad-expansion',
        title: 'Umayyad expansion',
        description:
          'Survey the political logic of early expansion and the administrative challenges it produced.',
        query: 'Umayyad Caliphate',
        estimatedMinutes: 10,
        category: 'dynasty',
        era: '661 - 750 AD',
        region: 'Middle East / North Africa / Iberia',
        coverTheme: 'emerald-dynasty',
      },
      {
        id: 'abbasid-cosmopolis',
        title: 'Abbasid cosmopolis',
        description:
          'Enter Baghdad as a center of translation, commerce, and imperial imagination.',
        query: 'Abbasid Caliphate',
        estimatedMinutes: 12,
        category: 'dynasty',
        era: '750 - 1258 AD',
        region: 'Middle East',
        coverTheme: 'midnight-scholar',
      },
      {
        id: 'fatimid-mediterranean',
        title: 'Fatimid Mediterranean',
        description:
          'Explore Cairo, trade networks, and competing claims to legitimacy.',
        query: 'Fatimid Caliphate',
        estimatedMinutes: 10,
        category: 'dynasty',
        era: '909 - 1171 AD',
        region: 'North Africa / Middle East',
        coverTheme: 'ancient-sand',
      },
      {
        id: 'ottoman-synthesis',
        title: 'Ottoman imperial synthesis',
        description:
          'Understand how the Ottomans combined military power, law, and cosmopolitan court culture.',
        query: 'Ottoman Empire',
        estimatedMinutes: 12,
        category: 'empire',
        era: '1299 - 1922 AD',
        region: 'Europe / Middle East / North Africa',
        coverTheme: 'royal-purple',
      },
    ],
  },
  {
    slug: 'history-of-north-africa',
    title: 'History of North Africa',
    description:
      'A layered path through ancient kingdoms, empires, trade corridors, and modern state formation.',
    coverTheme: 'bronze-civilization',
    theme: 'Regional continuity',
    estimatedMinutes: 40,
    difficulty: 'Intermediate',
    chapters: [
      {
        id: 'ancient-egypt',
        title: 'Ancient Egypt and the Nile state',
        description:
          'Begin with the long civilizational arc of pharaonic rule and its regional influence.',
        query: 'Ancient Egypt',
        estimatedMinutes: 10,
        category: 'civilization',
        era: '3100 BC - 30 BC',
        region: 'North Africa',
        coverTheme: 'ancient-sand',
      },
      {
        id: 'carthage',
        title: 'Carthage and Punic power',
        description:
          'Study maritime influence, commercial networks, and rivalry across the Mediterranean.',
        query: 'Carthage',
        estimatedMinutes: 8,
        category: 'civilization',
        era: '814 BC - 146 BC',
        region: 'North Africa / Mediterranean',
        coverTheme: 'obsidian-industrial',
      },
      {
        id: 'almoravids',
        title: 'Maghrebi dynasties',
        description:
          'Explore statecraft, trans-Saharan exchange, and religious authority in the medieval Maghreb.',
        query: 'Almoravid dynasty',
        estimatedMinutes: 10,
        category: 'dynasty',
        era: '1040 - 1147 AD',
        region: 'North Africa / Iberia',
        coverTheme: 'emerald-dynasty',
      },
      {
        id: 'colonial-transition',
        title: 'Colonialism and modern nationhood',
        description:
          'Follow how imperial rule, resistance, and decolonization reshaped North African states.',
        query: 'History of Algeria',
        estimatedMinutes: 12,
        category: 'country',
        era: '19th - 20th century',
        region: 'North Africa',
        coverTheme: 'midnight-scholar',
      },
    ],
  },
];

export const historicalMapHotspots: HistoricalMapHotspot[] = [
  {
    id: 'rome-peak',
    title: 'Roman imperial core',
    category: 'empire',
    query: 'Roman Empire',
    region: 'Mediterranean',
    startYear: -27,
    endYear: 476,
    x: 52,
    y: 33,
    radius: 30,
    summary:
      'A Mediterranean imperial system anchored by roads, law, taxation, and military logistics.',
    confidence: acceptedConfidence,
  },
  {
    id: 'abbasid-baghdad',
    title: 'Abbasid cosmopolis',
    category: 'dynasty',
    query: 'Abbasid Caliphate',
    region: 'Mesopotamia',
    startYear: 750,
    endYear: 1258,
    x: 61,
    y: 34,
    radius: 24,
    summary:
      "Baghdad's intellectual and commercial gravity made it one of the great centers of the medieval world.",
    confidence: acceptedConfidence,
  },
  {
    id: 'ottoman-zones',
    title: 'Ottoman imperial span',
    category: 'empire',
    query: 'Ottoman Empire',
    region: 'Europe / Middle East / North Africa',
    startYear: 1299,
    endYear: 1922,
    x: 57,
    y: 31,
    radius: 28,
    summary:
      'An imperial bridge across continents whose influence reconfigured regional politics for centuries.',
    confidence: acceptedConfidence,
  },
  {
    id: 'trans-saharan',
    title: 'Trans-Saharan trade routes',
    category: 'route',
    query: 'Trans-Saharan trade',
    region: 'North Africa / Sahel',
    startYear: 700,
    endYear: 1800,
    x: 47,
    y: 46,
    radius: 22,
    summary:
      'Caravan networks linked Mediterranean markets to West African polities through salt, gold, and scholarship.',
    confidence: approximateConfidence,
  },
  {
    id: 'ww1-europe',
    title: 'World War I fronts',
    category: 'conflict',
    query: 'World War I',
    region: 'Europe',
    startYear: 1914,
    endYear: 1918,
    x: 54,
    y: 25,
    radius: 20,
    summary:
      'Dense theaters of trench warfare and alliance politics reshaped Europe and accelerated imperial collapse.',
    confidence: acceptedConfidence,
  },
  {
    id: 'egypt-nile',
    title: 'Ancient Nile civilization',
    category: 'civilization',
    query: 'Ancient Egypt',
    region: 'North Africa',
    startYear: -3100,
    endYear: -30,
    x: 58,
    y: 43,
    radius: 20,
    summary:
      'A river-based state whose agricultural rhythm, monumental building, and sacred kingship endured for millennia.',
    confidence: acceptedConfidence,
  },
];
