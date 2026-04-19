import { mockTopics } from '@/data/mockTopics';
import {
  AskEraResponse,
  CompareSection,
  ComparisonExperience,
  ConfidenceLevel,
  DebateBlockData,
  PerspectiveLens,
  PerspectivePanel,
  RecommendationItem,
  TimelineCategory,
  TimelineEngineEvent,
} from '@/types/experience';
import { HistoryTopic, RelatedEntity, TopicCategory } from '@/types';
import { cleanText, getCoverThemeForCategory, slugify } from '@/lib/utils';

function extractParagraphs(text: string) {
  return cleanText(text)
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function firstSentence(text: string) {
  const sentence = cleanText(text).split(/(?<=[.!?])\s+/)[0]?.trim();
  return sentence || cleanText(text);
}

function parseYear(value: string) {
  const cleaned = cleanText(value).replace(/,/g, '').trim();
  const numeric = cleaned.match(/-?\d+/)?.[0];

  if (!numeric) {
    return 0;
  }

  const parsed = Number.parseInt(numeric, 10);
  return /bc/i.test(cleaned) ? -Math.abs(parsed) : parsed;
}

function normaliseLabel(level: ConfidenceLevel) {
  switch (level) {
    case 'debated':
      return 'Debated';
    case 'uncertain':
      return 'Uncertain';
    case 'approximate':
      return 'Approximate';
    default:
      return 'Commonly accepted';
  }
}

function formatTimelineCategory(category: TopicCategory): TimelineCategory {
  switch (category) {
    case 'war':
      return 'war';
    case 'figure':
      return 'ruler';
    case 'dynasty':
      return 'dynasty';
    case 'civilization':
      return 'society';
    case 'event':
      return 'political';
    default:
      return 'expansion';
  }
}

export function deriveConfidence(topic: HistoryTopic) {
  const timelineDensity = topic.timelineEvents.length;
  const figureDensity = topic.keyFigures.length;
  let level: ConfidenceLevel = 'commonly-accepted';
  let note =
    'This dossier is grounded in widely attested chronology and well-known interpretive frames.';

  if (topic.category === 'era' || topic.category === 'event') {
    level = 'approximate';
    note =
      'Period labels and territorial reach are often interpretive when historians compress large spans into a single dossier.';
  }

  if (timelineDensity < 3 || figureDensity === 0) {
    level = 'uncertain';
    note =
      'This topic is readable, but some sections rely on broader synthesis rather than dense documentary support in the current dossier.';
  }

  if (/legacy|revolution|collapse|decline|renaissance/i.test(topic.title)) {
    level = level === 'uncertain' ? level : 'debated';
    note =
      'The chronology is broadly understood, but historians continue to debate causation, emphasis, and long-term significance.';
  }

  return {
    level,
    label: normaliseLabel(level),
    note,
    citations: topic.relatedTopics.slice(0, 3).map((entry) => entry.name),
  };
}

function buildLensSummary(topic: HistoryTopic, lens: PerspectiveLens) {
  const paragraphs = extractParagraphs(topic.fullContent || topic.summary);
  const opening = paragraphs[0] || topic.summary;
  const secondary = paragraphs[1] || topic.summary;

  switch (lens) {
    case 'political':
      return {
        title: 'Political lens',
        summary: `Seen politically, ${topic.title} is about authority, legitimacy, and the institutions that kept power coherent across ${topic.region}.`,
        bullets: [
          firstSentence(opening),
          `The dossier frames ${topic.title} within ${topic.era}, which is useful for reading how rule changed over time.`,
          `Key political personalities include ${topic.keyFigures.slice(0, 2).map((figure) => figure.name).join(' and ') || 'a rotating cast of elites and rulers'}.`,
        ],
      };
    case 'military':
      return {
        title: 'Military lens',
        summary: `Through a military lens, ${topic.title} reveals how force, campaigns, deterrence, or conflict altered the balance of power.`,
        bullets: [
          firstSentence(secondary),
          topic.relatedEvents[0]
            ? `A useful conflict anchor here is ${topic.relatedEvents[0].name}.`
            : 'Even when this is not primarily a war dossier, coercive power still shaped the outcome.',
          `Timeline markers such as ${topic.timelineEvents.slice(0, 2).map((event) => event.title).join(' and ')} help track escalation and turning points.`,
        ],
      };
    case 'social':
      return {
        title: 'Social lens',
        summary: `Socially, ${topic.title} can be read as a story about everyday order, status, and how communities absorbed historical change.`,
        bullets: [
          `The dossier’s regional frame, ${topic.region}, helps situate the lived consequences behind elite decisions.`,
          'Social continuity often outlasts dramatic political rupture, which is why legacy matters in this topic.',
          topic.relatedTopics[0]
            ? `A nearby social comparison is ${topic.relatedTopics[0].name}.`
            : 'ChronoLivre treats this dossier as part of a broader social landscape rather than an isolated event.',
        ],
      };
    case 'economic':
      return {
        title: 'Economic lens',
        summary: `Economically, ${topic.title} is shaped by resources, logistics, taxation, and the ability to sustain power over time.`,
        bullets: [
          `Long duration matters here: ${topic.era} covers enough time for trade, production, and fiscal pressure to matter.`,
          firstSentence(opening),
          'When the dossier turns toward decline or transformation, economic strain is often part of the explanation.',
        ],
      };
    case 'religious':
      return {
        title: 'Religious lens',
        summary: `Religiously, ${topic.title} reveals how belief, legitimacy, sacred authority, or ritual identity shaped historical meaning.`,
        bullets: [
          'Religion is treated here as a source of both cohesion and contestation.',
          topic.keyFigures[0]
            ? `${topic.keyFigures[0].name} is a useful figure for tracing how authority could become moral as well as political.`
            : 'Even without one dominant figure, the dossier suggests a moral world larger than statecraft alone.',
          'Legacy matters because religious memory often outlives formal institutions.',
        ],
      };
    default:
      return {
        title: 'Cultural lens',
        summary: `Culturally, ${topic.title} shows how symbols, memory, scholarship, and artistic imagination preserve a subject beyond its own era.`,
        bullets: [
          'The dossier already carries a strong cultural identity through its era label, regional framing, and featured figures.',
          topic.quote
            ? `The quoted line in this dossier points to how the subject has been remembered: ${topic.quote}`
            : 'This topic’s long afterlife is part of what makes it collectible and worth revisiting.',
          'ChronoLivre treats legacy as a cultural story as much as a political one.',
        ],
      };
  }
}

export function buildPerspectivePanels(topic: HistoryTopic): PerspectivePanel[] {
  const lenses: PerspectiveLens[] = [
    'political',
    'military',
    'social',
    'economic',
    'cultural',
    'religious',
  ];

  return lenses.map((lens) => ({ lens, ...buildLensSummary(topic, lens) }));
}

export function buildDebateBlock(topic: HistoryTopic): DebateBlockData {
  const confidence = deriveConfidence(topic);
  const paragraphs = extractParagraphs(topic.fullContent || topic.summary);
  const question =
    topic.category === 'figure'
      ? `Was ${topic.title} primarily a reformer or an instrument of power?`
      : topic.category === 'war'
        ? `Did ${topic.title} transform history more through destruction or political reordering?`
        : `Should ${topic.title} be understood more through governance or through legacy?`;

  return {
    question,
    consensus:
      'Most historians accept the broad chronology, but they often disagree on emphasis: institutions, ideas, violence, and long-term afterlives do not weigh equally in every interpretation.',
    uncertainty:
      'This debate block highlights competing emphases rather than claiming a single final interpretation.',
    confidence,
    sides: [
      {
        title: 'Institutional reading',
        argument: `This reading treats ${topic.title} as a story of structure, administration, and durable systems more than personality alone.`,
        evidence: [
          firstSentence(paragraphs[0] || topic.summary),
          `The dossier’s timeline suggests long-term continuity across ${topic.era}.`,
          topic.relatedTopics[0]
            ? `Related comparison: ${topic.relatedTopics[0].name}.`
            : 'Legacy and institutional persistence remain central to this view.',
        ],
      },
      {
        title: 'Contingency reading',
        argument: `This reading emphasizes turning points, human agency, and the fragile decisions that could have pushed the outcome in another direction.`,
        evidence: [
          topic.timelineEvents[0]
            ? `${topic.timelineEvents[0].title} anchors an early moment of contingency.`
            : 'The chronology itself suggests moments of rapid change.',
          topic.keyFigures[0]
            ? `${topic.keyFigures[0].name} becomes especially important in this interpretation.`
            : 'The debate still hinges on how much agency individuals retained within larger structures.',
          firstSentence(paragraphs[1] || topic.summary),
        ],
      },
    ],
  };
}

function overlapScore(left: HistoryTopic, right: HistoryTopic) {
  let score = 0;

  if (left.category === right.category) score += 3;
  if (left.region === right.region) score += 2;
  if (
    left.relatedTopics.some((entry) =>
      right.title.toLowerCase().includes(entry.name.toLowerCase())
    )
  ) {
    score += 4;
  }

  const leftTerms = new Set(left.title.toLowerCase().split(/\s+/));
  const rightTerms = new Set(right.title.toLowerCase().split(/\s+/));
  leftTerms.forEach((term) => {
    if (term.length > 3 && rightTerms.has(term)) {
      score += 1;
    }
  });

  return score;
}

export function buildRecommendations(topic: HistoryTopic): RecommendationItem[] {
  return mockTopics
    .filter((candidate) => candidate.slug !== topic.slug)
    .map((candidate) => {
      const reason =
        candidate.region === topic.region
          ? 'Same region, different lens'
          : candidate.category === topic.category
            ? 'Parallel historical form'
            : topic.relatedTopics.some((related) =>
                  candidate.title.toLowerCase().includes(related.name.toLowerCase())
                )
              ? 'Explicitly connected in the dossier'
              : 'Adjacent path worth exploring next';

      return {
        candidate: {
          slug: candidate.slug,
          title: candidate.title,
          category: candidate.category,
          era: candidate.era,
          region: candidate.region,
          summary: candidate.summary,
          query: candidate.query,
          coverTheme: candidate.coverTheme,
          reason,
        } satisfies RecommendationItem,
        score: overlapScore(topic, candidate),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.candidate);
}

function joinEntityNames(entities: RelatedEntity[], fallback: string) {
  const names = entities.slice(0, 3).map((entry) => entry.name);
  return names.length > 0 ? names.join(', ') : fallback;
}

function getOriginNarrative(topic: HistoryTopic) {
  if (topic.timelineEvents[0]) {
    return `${topic.timelineEvents[0].year}: ${topic.timelineEvents[0].title}. ${topic.timelineEvents[0].description}`;
  }

  const paragraphs = extractParagraphs(topic.fullContent || topic.summary);
  return paragraphs[0] || topic.summary;
}

function getTimelineNarrative(topic: HistoryTopic) {
  if (topic.timelineEvents.length === 0) {
    return `ChronoLivre currently frames ${topic.title} across ${topic.era} without a denser event register.`;
  }

  return topic.timelineEvents
    .slice(0, 4)
    .map((event) => `${event.year}: ${event.title}`)
    .join(' • ');
}

function getPoliticalNarrative(topic: HistoryTopic) {
  return `${topic.title} is situated as a ${topic.category} whose political shape is best read through ${topic.region}, ${topic.era}, and the figure of ${joinEntityNames(topic.keyFigures, 'its leading institutions')}.`;
}

function getMilitaryNarrative(topic: HistoryTopic) {
  return topic.category === 'war'
    ? `${topic.title} is itself a military dossier, so conflict is the organizing principle rather than a supporting dimension.`
    : `${topic.title} is linked to conflict through ${joinEntityNames(topic.relatedEvents, 'its turning points and coercive pressure')}.`;
}

function getEconomyNarrative(topic: HistoryTopic) {
  return `Economic reading emphasizes endurance: long spans like ${topic.era} imply logistics, taxation, trade, or resource management even when the dossier foregrounds politics.`;
}

function getCultureNarrative(topic: HistoryTopic) {
  return `${topic.title} carries a cultural afterlife through memory, representation, and the symbolic legacy attached to ${joinEntityNames(topic.relatedTopics, 'related civilizations and traditions')}.`;
}

function getLegacyNarrative(topic: HistoryTopic) {
  return `The dossier frames legacy through later influence, especially in ${topic.region}, and through the durability of names, institutions, and narratives tied to ${topic.title}.`;
}

export function buildComparisonExperience(
  left: HistoryTopic,
  right: HistoryTopic
): ComparisonExperience {
  const confidence = {
    level: 'debated' as const,
    label: 'Debated',
    note:
      'This comparison aligns chronology and structure clearly, but interpretive weighting remains a matter of historical judgment.',
  };

  const sections: CompareSection[] = [
    {
      id: 'overview',
      label: 'Overview',
      left: left.summary,
      right: right.summary,
      summary:
        'Both dossiers are introduced through narrative synthesis rather than bare chronology.',
    },
    {
      id: 'origin',
      label: 'Origin / formation',
      left: getOriginNarrative(left),
      right: getOriginNarrative(right),
      summary:
        'Formation reveals whether each topic begins as an institution, a rupture, a conquest, or a long social build-up.',
    },
    {
      id: 'timeline',
      label: 'Timeline',
      left: getTimelineNarrative(left),
      right: getTimelineNarrative(right),
      summary:
        'Chronology makes scale visible: one subject may move in sudden turns while the other unfolds over longer duration.',
    },
    {
      id: 'political-structure',
      label: 'Political structure',
      left: getPoliticalNarrative(left),
      right: getPoliticalNarrative(right),
      summary:
        'This section compares how rule, legitimacy, and institutional control are presented in each dossier.',
    },
    {
      id: 'military-power',
      label: 'Military power',
      left: getMilitaryNarrative(left),
      right: getMilitaryNarrative(right),
      summary:
        'Military analysis distinguishes a subject organized around force from one merely shaped by it.',
    },
    {
      id: 'economy',
      label: 'Economy',
      left: getEconomyNarrative(left),
      right: getEconomyNarrative(right),
      summary:
        'Economic capacity often explains what political narratives alone cannot sustain.',
    },
    {
      id: 'culture-society',
      label: 'Culture / religion / society',
      left: getCultureNarrative(left),
      right: getCultureNarrative(right),
      summary:
        'Cultural comparison helps read how each subject survives in memory and collective identity.',
    },
    {
      id: 'key-figures',
      label: 'Key figures',
      left: joinEntityNames(left.keyFigures, 'No single figure dominates the current dossier.'),
      right: joinEntityNames(
        right.keyFigures,
        'No single figure dominates the current dossier.'
      ),
      summary:
        'Leadership concentration often indicates whether a subject is remembered personally or structurally.',
    },
    {
      id: 'turning-points',
      label: 'Turning points',
      left: joinEntityNames(left.relatedEvents, getTimelineNarrative(left)),
      right: joinEntityNames(right.relatedEvents, getTimelineNarrative(right)),
      summary:
        'Turning points show where continuity broke, accelerated, or was reinterpreted.',
    },
    {
      id: 'major-conflicts',
      label: 'Major conflicts',
      left: joinEntityNames(
        left.relatedEvents,
        'Conflict is a secondary layer in this dossier.'
      ),
      right: joinEntityNames(
        right.relatedEvents,
        'Conflict is a secondary layer in this dossier.'
      ),
      summary:
        'Conflict clarifies what each subject had to resist, absorb, or unleash.',
    },
    {
      id: 'decline-legacy',
      label: 'Decline / legacy',
      left: getLegacyNarrative(left),
      right: getLegacyNarrative(right),
      summary:
        'Historical importance often lies as much in afterlife as in peak power.',
    },
    {
      id: 'influence',
      label: 'Influence on later history',
      left: `Later inquiry into ${left.title} usually moves toward ${joinEntityNames(left.relatedTopics, 'its downstream institutional and cultural echoes')}.`,
      right: `Later inquiry into ${right.title} usually moves toward ${joinEntityNames(right.relatedTopics, 'its downstream institutional and cultural echoes')}.`,
      summary:
        'Influence reveals where a subject remains active in the historical imagination.',
    },
  ];

  return {
    title: `${left.title} and ${right.title}`,
    subtitle:
      'A structured archival comparison across formation, chronology, power, society, conflict, and historical afterlife.',
    leftTitle: left.title,
    rightTitle: right.title,
    confidence,
    similarities: [
      `${left.title} and ${right.title} are both readable through chronology, regional context, and the personalities attached to them.`,
      'Both dossiers produce a long afterlife that extends beyond their immediate historical moment.',
      'Each subject becomes clearer when political structure is read together with cultural memory.',
    ],
    differences: [
      `${left.title} is framed primarily as a ${left.category}, while ${right.title} is framed as a ${right.category}.`,
      `${left.region} and ${right.region} place these dossiers in different geographic theaters of consequence.`,
      `The active timeline of ${left.title} (${left.era}) differs in scale and duration from ${right.title} (${right.era}).`,
    ],
    sections,
  };
}

export function buildTimelineEvents(topic: HistoryTopic): TimelineEngineEvent[] {
  const confidence = deriveConfidence(topic);

  return topic.timelineEvents.map((event, index) => ({
    id: `${topic.slug}-${index}`,
    title: event.title,
    description: event.description,
    yearLabel: event.year,
    startYear: parseYear(event.year),
    endYear: null,
    category: formatTimelineCategory(topic.category),
    region: topic.region,
    importance: Math.max(1, Math.min(5, 5 - index)) as 1 | 2 | 3 | 4 | 5,
    relatedTopics: topic.relatedTopics.map((related) => related.name),
    confidence,
  }));
}

export function buildAskEraFallback(
  topic: HistoryTopic,
  perspective: string
): AskEraResponse {
  return {
    title: `${topic.title} through the voice of ${perspective}`,
    perspective,
    response: `From within ${topic.era}, a narrator shaped by ${perspective} would likely understand ${topic.title} through order, risk, and survival rather than hindsight. The subject would not feel like a completed chapter, but like an unstable present whose meaning was still being argued in markets, courts, barracks, and households.`,
    caution:
      'This is a historically informed simulation intended to help imagination and context. It should not be treated as a literal eyewitness transcript.',
  };
}

export function buildComparisonSlug(left: HistoryTopic, right: HistoryTopic) {
  return slugify(`${left.slug}-${right.slug}`);
}

export function topicToRecommendation(topic: HistoryTopic, reason: string): RecommendationItem {
  return {
    slug: topic.slug,
    title: topic.title,
    category: topic.category,
    era: topic.era,
    region: topic.region,
    summary: topic.summary,
    reason,
    query: topic.query,
    coverTheme: topic.coverTheme || getCoverThemeForCategory(topic.category),
  };
}
