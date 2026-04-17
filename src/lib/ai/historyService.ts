import { HistoryTopic, TimelineEvent, RelatedEntity, TopicCategory } from '@/types';
import {
  generateId,
  getCoverThemeForCategory,
  sanitizeTopic,
  slugify,
} from '@/lib/utils';
import { mockTopics } from '@/data/mockTopics';
import { Locale } from '@/i18n/config';

// AI Service abstraction layer
// Uses DeepSeek API for generating historical content

function inferCategory(query: string): TopicCategory {
  const q = query.toLowerCase();
  if (/war|battle|conflict|siege|campaign/i.test(q)) return 'war';
  if (/empire|imperial/i.test(q)) return 'empire';
  if (/kingdom|king|queen|monarchy/i.test(q)) return 'kingdom';
  if (/dynasty/i.test(q)) return 'dynasty';
  if (/civilization|culture|people|ancient/i.test(q)) return 'civilization';
  if (/country|nation|republic|history of/i.test(q)) return 'country';
  if (/era|age|period|century|renaissance/i.test(q)) return 'era';
  if (/revolution|treaty|event|fall|rise/i.test(q)) return 'event';
  return 'figure';
}

function parseAIResponse(text: string, query: string): HistoryTopic {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const category = parsed.category || inferCategory(query);
      return sanitizeTopic({
        id: generateId(),
        title: parsed.title || query,
        slug: slugify(parsed.title || query),
        query: query,
        category: category,
        era: parsed.era || 'Unknown Era',
        summary: parsed.summary || '',
        fullContent: parsed.fullContent || parsed.summary || '',
        timelineEvents: (parsed.timelineEvents || []).map((e: TimelineEvent) => ({
          year: e.year || '',
          title: e.title || '',
          description: e.description || '',
        })),
        keyFigures: (parsed.keyFigures || []).map((f: RelatedEntity) => ({
          name: f.name || '',
          type: 'figure' as const,
          shortDescription: f.shortDescription || '',
          role: f.role || '',
        })),
        relatedTopics: (parsed.relatedTopics || []).map((t: RelatedEntity) => ({
          name: t.name || '',
          type: t.type || 'event',
          shortDescription: t.shortDescription || '',
        })),
        relatedEvents: (parsed.relatedEvents || []).map((e: RelatedEntity) => ({
          name: e.name || '',
          type: e.type || 'event',
          shortDescription: e.shortDescription || '',
        })),
        region: parsed.region || 'Global',
        createdAt: new Date().toISOString(),
        coverTheme: getCoverThemeForCategory(category),
        quote: parsed.quote || '',
        quoteAuthor: parsed.quoteAuthor || '',
        volumeNumber: `Vol. ${Math.floor(Math.random() * 20) + 1}`,
      });
    }
  } catch (e) {
    console.warn('Failed to parse AI response as JSON, using text fallback:', e);
  }

  // Fallback: construct from raw text
  const category = inferCategory(query);
  return sanitizeTopic({
    id: generateId(),
    title: query,
    slug: slugify(query),
    query: query,
    category: category,
    era: 'Historical Period',
    summary: text.slice(0, 500),
    fullContent: text,
    timelineEvents: [],
    keyFigures: [],
    relatedTopics: [],
    relatedEvents: [],
    region: 'Global',
    createdAt: new Date().toISOString(),
    coverTheme: getCoverThemeForCategory(category),
    volumeNumber: `Vol. ${Math.floor(Math.random() * 20) + 1}`,
  });
}

const AI_PROMPT = `You are a world-class historian and curator. Given a historical query, provide a comprehensive, richly detailed response in JSON format. Be factual, eloquent, and thorough.

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "title": "A compelling, evocative title for the topic",
  "category": "one of: figure, war, kingdom, country, civilization, event, empire, dynasty, era",
  "era": "Time period, e.g. '1769 – 1821 AD'",
  "summary": "A 2-3 sentence elegant summary",
  "fullContent": "A rich, multi-paragraph essay (at least 4 paragraphs) exploring the topic in depth. Write in an editorial, museum-quality literary style.",
  "timelineEvents": [
    {"year": "date/year", "title": "Event name", "description": "1-2 sentence description"}
  ],
  "keyFigures": [
    {"name": "Person name", "role": "Their title/role", "shortDescription": "1-2 sentence description"}
  ],
  "relatedTopics": [
    {"name": "Topic name", "type": "figure/event/civilization/empire/etc", "shortDescription": "Brief connection"}
  ],
  "relatedEvents": [
    {"name": "Event name", "type": "event/conflict", "shortDescription": "Brief description"}
  ],
  "region": "Geographic region",
  "quote": "A famous relevant quote with attribution",
  "quoteAuthor": "Who said it"
}

Provide at least 4-6 timeline events, 2-3 key figures, 2-3 related topics, and 2-3 related events. Make the content rich and historically accurate.`;

function getLocaleInstruction(locale: Locale): string {
  switch (locale) {
    case 'fr':
      return 'Respond in French.';
    case 'ar':
      return 'Respond in Arabic.';
    default:
      return 'Respond in English.';
  }
}

export async function searchHistoryTopic(
  query: string,
  locale: Locale = 'en'
): Promise<HistoryTopic> {
  // First check mock data for exact or close matches
  const normalizedQuery = query.toLowerCase().trim();
  const mockMatch = mockTopics.find(
    (t) =>
      t.query.toLowerCase() === normalizedQuery ||
      t.title.toLowerCase().includes(normalizedQuery) ||
      t.slug === slugify(normalizedQuery)
  );

  if (mockMatch) {
    return sanitizeTopic({
      ...mockMatch,
      createdAt: new Date().toISOString(),
    });
  }

  // Try AI API
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, locale }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    if (data.topic) {
      return data.topic;
    }
    throw new Error('No topic in response');
  } catch (error) {
    console.warn('AI API error, falling back to mock topic:', error);
    // Generate a basic mock response for unknown queries
    return generateFallbackTopic(query, locale);
  }
}

export function getTopicBySlug(slug: string): HistoryTopic | null {
  const match = mockTopics.find((t) => t.slug === slug);
  return match ? sanitizeTopic(match) : null;
}

function generateFallbackTopic(query: string, locale: Locale): HistoryTopic {
  const category = inferCategory(query);
  const localizedSummary = {
    en: `An exploration into the historical significance of ${query}. This topic encompasses key events, notable figures, and lasting impacts that have shaped our understanding of this subject.`,
    fr: `Une exploration de l'importance historique de ${query}. Ce sujet regroupe des événements majeurs, des figures notables et des héritages durables qui ont façonné notre compréhension de cette question.`,
    ar: `استكشاف للأهمية التاريخية لموضوع ${query}. يجمع هذا الموضوع بين أحداث رئيسية وشخصيات بارزة وآثار طويلة المدى شكّلت فهمنا له.`,
  }[locale];

  const localizedContent = {
    en: `${query} represents a significant chapter in the tapestry of human history. The study of this topic reveals intricate connections between political, cultural, and social forces that continue to influence our world today.\n\nHistorians have long debated the precise significance and legacy of ${query}, with perspectives shifting as new evidence and interpretive frameworks emerge. What remains constant is the profound impact this subject has had on subsequent generations.\n\nThe exploration of ${query} invites us to consider how the past informs our present, and how the lessons drawn from historical study can illuminate the path forward. Each discovery adds a new thread to our understanding of the human experience.\n\nAs we delve deeper into this topic, we uncover layers of complexity that defy simple categorization. The story of ${query} is ultimately a story about human ambition, resilience, and the eternal quest for meaning.`,
    fr: `${query} représente un chapitre important de l'histoire humaine. L'étude de ce sujet révèle des liens complexes entre des forces politiques, culturelles et sociales qui continuent d'influencer notre monde.\n\nLes historiens débattent depuis longtemps de la signification précise et de l'héritage de ${query}, alors que les interprétations évoluent avec de nouvelles sources et de nouveaux cadres d'analyse. Ce qui demeure constant, c'est l'impact profond de ce sujet sur les générations suivantes.\n\nExplorer ${query}, c'est réfléchir à la manière dont le passé éclaire le présent et dont les leçons de l'histoire peuvent nous orienter. Chaque découverte ajoute un nouveau fil à notre compréhension de l'expérience humaine.\n\nEn approfondissant ce sujet, nous découvrons des couches de complexité qui résistent aux classifications simples. L'histoire de ${query} est, au fond, une histoire d'ambition humaine, de résilience et de quête de sens.`,
    ar: `يمثل ${query} فصلًا مهمًا في نسيج التاريخ الإنساني. وتكشف دراسة هذا الموضوع عن روابط معقدة بين القوى السياسية والثقافية والاجتماعية التي ما تزال تؤثر في عالمنا اليوم.\n\nلقد ناقش المؤرخون طويلًا المعنى الدقيق والإرث الذي تركه ${query}، مع تغيّر القراءات التاريخية كلما ظهرت أدلة جديدة وأطر تفسير مختلفة. وما يبقى ثابتًا هو الأثر العميق لهذا الموضوع في الأجيال اللاحقة.\n\nإن استكشاف ${query} يدعونا إلى التفكير في كيفية إضاءة الماضي لحاضرنا، وكيف يمكن للدروس المستخلصة من التاريخ أن ترشدنا إلى الأمام. فكل اكتشاف يضيف خيطًا جديدًا إلى فهمنا للتجربة الإنسانية.\n\nومع التعمق في هذا الموضوع، نكشف طبقات من التعقيد تتجاوز التصنيفات البسيطة. وفي النهاية، فإن قصة ${query} هي قصة عن الطموح الإنساني والقدرة على الصمود والسعي الدائم إلى المعنى.`,
  }[locale];

  return sanitizeTopic({
    id: generateId(),
    title: query,
    slug: slugify(query),
    query: query,
    category: category,
    era: 'Historical Period',
    summary: localizedSummary,
    fullContent: localizedContent,
    timelineEvents: [
      { year: 'Origin', title: 'Beginning of the Era', description: `The foundational period of ${query}, establishing the conditions for what would follow.` },
      { year: 'Peak', title: 'Height of Influence', description: `The zenith of ${query}'s impact on the broader historical landscape.` },
      { year: 'Legacy', title: 'Enduring Legacy', description: `The lasting influence of ${query} on subsequent historical developments.` },
    ],
    keyFigures: [],
    relatedTopics: [],
    relatedEvents: [],
    region: 'Global',
    createdAt: new Date().toISOString(),
    coverTheme: getCoverThemeForCategory(category),
    volumeNumber: `Vol. ${Math.floor(Math.random() * 20) + 1}`,
  });
}

export { AI_PROMPT, getLocaleInstruction, parseAIResponse };
