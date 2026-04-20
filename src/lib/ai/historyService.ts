import { HistoryTopic, RelatedEntity, TopicCategory } from '@/types';
import {
  generateId,
  getCoverThemeForCategory,
  sanitizeTopic,
  slugify,
} from '@/lib/utils';
import { mockTopics } from '@/data/mockTopics';
import { Locale } from '@/i18n/config';

export class SearchAccessError extends Error {
  code: 'auth_required' | 'email_not_verified';

  constructor(code: 'auth_required' | 'email_not_verified', message: string) {
    super(message);
    this.code = code;
  }
}

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

function mapQueryTypeToCategory(queryType: string | undefined, query: string): TopicCategory {
  switch (queryType) {
    case 'historical_figure':
      return 'figure';
    case 'war_or_battle':
      return 'war';
    case 'country_history':
      return 'country';
    case 'empire_or_kingdom':
      return /kingdom|royaume|مملكة/i.test(query) ? 'kingdom' : 'empire';
    case 'civilization':
      return 'civilization';
    case 'event':
      return 'event';
    case 'timeline':
    case 'broad_topic':
      return inferCategory(query);
    case 'comparison':
      return /war|battle|conflict|siege|campaign/i.test(query) ? 'war' : 'event';
    default:
      return inferCategory(query);
  }
}

function normaliseEntityType(type: string | undefined): RelatedEntity['type'] {
  switch (type) {
    case 'person':
    case 'figure':
      return 'figure';
    case 'war':
    case 'battle':
    case 'conflict':
      return 'conflict';
    case 'empire':
      return 'empire';
    case 'kingdom':
      return 'kingdom';
    case 'country':
      return 'country';
    case 'civilization':
      return 'civilization';
    case 'event':
      return 'event';
    case 'dynasty':
      return 'dynasty';
    case 'era':
    case 'timeline':
      return 'era';
    case 'place':
    case 'region':
      return 'place';
    default:
      return 'event';
  }
}

function getStringField(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function getArrayOfObjects(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' && item !== null
      )
    : [];
}

function getArrayOfStrings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
}

function buildFullContentFromStructuredResponse(parsed: Record<string, unknown>): string {
  const subtitle = getStringField(parsed.subtitle).trim();
  const summary = getStringField(parsed.summary).trim();
  const keyPoints = getArrayOfStrings(parsed.key_points);
  const sections = getArrayOfObjects(parsed.sections)
    .map((section) => {
      const heading = getStringField(section.heading).trim();
      const content = getStringField(section.content).trim();
      if (!heading && !content) {
        return '';
      }
      return heading ? `${heading}\n${content}`.trim() : content;
    })
    .filter(Boolean);

  const timeline = getArrayOfObjects(parsed.timeline)
    .map((entry) => {
      const date = getStringField(entry.date).trim();
      const title = getStringField(entry.title).trim();
      const description = getStringField(entry.description).trim();
      return [date, title, description].filter(Boolean).join(' — ');
    })
    .filter(Boolean);

  const recommendations = getArrayOfStrings(parsed.recommendations);

  return [
    subtitle,
    summary,
    keyPoints.length ? keyPoints.map((point) => `• ${point}`).join('\n') : '',
    ...sections,
    timeline.length ? timeline.join('\n') : '',
    recommendations.length ? recommendations.join('\n') : '',
  ]
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

function parseAIResponse(text: string, query: string): HistoryTopic {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      const queryType = getStringField(parsed.query_type) || undefined;
      const category = mapQueryTypeToCategory(queryType, query);
      const timeline = getArrayOfObjects(parsed.timelineEvents).length
        ? getArrayOfObjects(parsed.timelineEvents)
        : getArrayOfObjects(parsed.timeline);
      const relatedEntities = getArrayOfObjects(parsed.related_entities);
      const keyFigures = getArrayOfObjects(parsed.keyFigures);
      const relatedTopics = getArrayOfObjects(parsed.relatedTopics);
      const relatedEvents = getArrayOfObjects(parsed.relatedEvents);
      const fullContent =
        getStringField(parsed.fullContent).trim() || buildFullContentFromStructuredResponse(parsed);
      const subtitle = getStringField(parsed.subtitle).trim();
      const summary =
        getStringField(parsed.summary).trim() || subtitle || fullContent.slice(0, 500);

      return sanitizeTopic({
        id: generateId(),
        title: getStringField(parsed.title) || query,
        slug: slugify(getStringField(parsed.title) || query),
        query,
        category,
        era: getStringField(parsed.era) || 'Unknown Era',
        summary,
        fullContent: fullContent || summary,
        timelineEvents: timeline.map((entry) => ({
          year: getStringField(entry.year) || getStringField(entry.date),
          title: getStringField(entry.title),
          description: getStringField(entry.description),
        })),
        keyFigures: [
          ...keyFigures,
          ...relatedEntities.filter(
            (entity) => normaliseEntityType(getStringField(entity.type) || undefined) === 'figure'
          ),
        ].map((figure) => ({
          name: getStringField(figure.name),
          type: 'figure' as const,
          shortDescription:
            getStringField(figure.shortDescription) || getStringField(figure.reason),
          role: getStringField(figure.role),
        })),
        relatedTopics: [
          ...relatedTopics,
          ...relatedEntities.filter((entity) => {
            const type = normaliseEntityType(getStringField(entity.type) || undefined);
            return type !== 'figure' && type !== 'event' && type !== 'conflict';
          }),
        ].map((entity) => ({
          name: getStringField(entity.name),
          type: normaliseEntityType(getStringField(entity.type) || undefined),
          shortDescription:
            getStringField(entity.shortDescription) || getStringField(entity.reason),
        })),
        relatedEvents: [
          ...relatedEvents,
          ...relatedEntities.filter((entity) => {
            const type = normaliseEntityType(getStringField(entity.type) || undefined);
            return type === 'event' || type === 'conflict';
          }),
        ].map((entity) => ({
          name: getStringField(entity.name),
          type: normaliseEntityType(getStringField(entity.type) || undefined),
          shortDescription:
            getStringField(entity.shortDescription) || getStringField(entity.reason),
        })),
        region: getStringField(parsed.region) || 'Global',
        createdAt: new Date().toISOString(),
        coverTheme: getCoverThemeForCategory(category),
        quote: getStringField(parsed.quote),
        quoteAuthor: getStringField(parsed.quoteAuthor),
        volumeNumber: `Vol. ${Math.floor(Math.random() * 20) + 1}`,
      });
    }
  } catch (e) {
    console.warn('Failed to parse AI response as JSON, using text fallback:', e);
  }

  const category = inferCategory(query);
  return sanitizeTopic({
    id: generateId(),
    title: query,
    slug: slugify(query),
    query,
    category,
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

const AI_PROMPT = `You are the historical intelligence engine behind Chronolivre, a premium AI-powered history platform.

Your job is to answer user queries about:
- historical figures
- wars and battles
- countries and their history
- kingdoms, empires, dynasties, and civilizations
- major historical events, timelines, and turning points

Your answers must be:
- historically responsible
- clear
- well-structured
- elegant
- informative
- useful for a premium history product
- concise but rich
- neutral in tone unless the user explicitly asks for storytelling mode

CRITICAL RULES:

1. Do not invent facts.
2. If something is uncertain, disputed, approximate, or debated, say so clearly.
3. Do not present speculation as fact.
4. If the query is ambiguous, choose the most likely interpretation and mention that assumption briefly.
5. Prefer broad historical consensus over sensational claims.
6. Distinguish clearly between:
   - widely accepted facts
   - debated interpretations
   - uncertain claims
7. When dates, borders, population estimates, or attribution are approximate, label them as approximate.
8. If the user asks for comparison, return a structured comparison, not a plain essay.
9. If the user asks for a person, war, kingdom, empire, country, or civilization, organize the answer into clean product-ready sections.
10. Keep the response suitable for rendering inside a modern history app.

RESPONSE STYLE:

- Write in polished modern English.
- Be direct and readable.
- Avoid unnecessary academic jargon.
- Do not use filler.
- Do not be repetitive.
- Use strong sectioning.
- Make the result feel premium, intelligent, and trustworthy.

OUTPUT MODE SELECTION:

You must first detect the query type and adapt the structure.

Possible query types:
- historical_figure
- war_or_battle
- country_history
- empire_or_kingdom
- civilization
- event
- comparison
- timeline
- broad_topic

RETURN FORMAT:

Return ONLY valid JSON.
Do not include markdown.
Do not include explanation outside JSON.

Use this schema:

{
  "query_type": "historical_figure | war_or_battle | country_history | empire_or_kingdom | civilization | event | comparison | timeline | broad_topic",
  "title": "string",
  "subtitle": "string",
  "summary": "A strong, polished summary for the topic in 2 to 5 sentences.",
  "era": "string",
  "region": "string",
  "confidence": {
    "level": "high | medium | low",
    "notes": "Explain uncertainty, debate, approximation, or limitations if needed."
  },
  "key_points": [
    "string",
    "string",
    "string"
  ],
  "timeline": [
    {
      "date": "string",
      "title": "string",
      "description": "string"
    }
  ],
  "sections": [
    {
      "heading": "string",
      "content": "string"
    }
  ],
  "related_entities": [
    {
      "name": "string",
      "type": "person | war | empire | kingdom | country | civilization | event",
      "reason": "string"
    }
  ],
  "recommendations": [
    "string",
    "string"
  ],
  "visual_theme": {
    "mood": "string",
    "palette": ["string", "string", "string"],
    "symbol": "string"
  }
}

SPECIAL RULES FOR COMPARISON QUERIES:

If the user asks to compare two subjects, return this structure instead:

{
  "query_type": "comparison",
  "title": "string",
  "subtitle": "string",
  "summary": "Short overview of the comparison.",
  "confidence": {
    "level": "high | medium | low",
    "notes": "string"
  },
  "entities": [
    {
      "name": "string",
      "type": "string",
      "overview": "string",
      "era": "string",
      "region": "string"
    },
    {
      "name": "string",
      "type": "string",
      "overview": "string",
      "era": "string",
      "region": "string"
    }
  ],
  "comparison": {
    "similarities": ["string", "string"],
    "differences": ["string", "string"],
    "categories": [
      {
        "heading": "Origins",
        "side_a": "string",
        "side_b": "string"
      },
      {
        "heading": "Political Structure",
        "side_a": "string",
        "side_b": "string"
      },
      {
        "heading": "Military Power",
        "side_a": "string",
        "side_b": "string"
      },
      {
        "heading": "Culture and Society",
        "side_a": "string",
        "side_b": "string"
      },
      {
        "heading": "Legacy",
        "side_a": "string",
        "side_b": "string"
      }
    ]
  },
  "related_entities": [
    {
      "name": "string",
      "type": "string",
      "reason": "string"
    }
  ],
  "recommendations": [
    "string",
    "string"
  ],
  "visual_theme": {
    "mood": "string",
    "palette": ["string", "string", "string"],
    "symbol": "string"
  }
}

SPECIAL RULES FOR TIMELINE QUERIES:

If the user asks for a timeline, prioritize:
- chronology
- turning points
- causes and consequences
- linked figures and events

SPECIAL RULES FOR COUNTRY / EMPIRE / KINGDOM QUERIES:

Include, when relevant:
- origins
- political development
- rulers or dynasties
- wars/conflicts
- cultural significance
- decline, transformation, or legacy

SPECIAL RULES FOR HISTORICAL FIGURES:

Include, when relevant:
- background
- rise to prominence
- major actions
- leadership or influence
- historical debate
- legacy

FAILSAFE BEHAVIOR:

If the query is too vague, still return useful JSON with:
- best interpretation
- medium or low confidence if appropriate
- recommendations for related follow-up topics

Never return empty fields unless absolutely necessary.
Never output placeholder text like "lorem ipsum" or "TBD".
Always make the output app-ready.

LANGUAGE RULES:

1. Detect the language of the user's query.
2. Respond in the same language as the user's query.
3. Translate all user-facing fields into the user's language, including:
   - title
   - subtitle
   - summary
   - key_points
   - timeline.title
   - timeline.description
   - sections.heading
   - sections.content
   - related_entities.reason
   - recommendations
   - confidence.notes
   - visual_theme.mood
4. Keep proper nouns, historical names, dynasties, treaties, and place names in their standard historical form when needed, but adapt them to the user's language if a common translated form exists.
5. If the user mixes languages, answer in the dominant language of the query.
6. If the user explicitly asks for another language, follow the user's explicit request.
7. Do not default to English unless the user wrote in English or the requested language is unclear.
8. Keep the JSON structure unchanged, but make the content values use the user's language.
9. Write naturally and fluently, not as a literal translation.
10. If the language is unsupported for high-quality output, respond in English and clearly mention this in confidence.notes.`;

function getLocaleInstruction(locale: Locale): string {
  switch (locale) {
    case 'fr':
      return 'Follow the system language rules and respond in French unless the user explicitly asked for another language.';
    case 'ar':
      return 'Follow the system language rules and respond in Arabic unless the user explicitly asked for another language.';
    default:
      return 'Follow the system language rules and respond in English unless the user explicitly asked for another language.';
  }
}

export async function searchHistoryTopic(
  query: string,
  locale: Locale = 'en'
): Promise<HistoryTopic> {
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

  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, locale }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      if (response.status === 401 && payload?.code === 'auth_required') {
        throw new SearchAccessError('auth_required', payload.error);
      }

      if (response.status === 403 && payload?.code === 'email_not_verified') {
        throw new SearchAccessError('email_not_verified', payload.error);
      }

      throw new Error(payload?.error ?? `API returned ${response.status}`);
    }

    const data = await response.json();
    if (data.topic) {
      return data.topic;
    }
    throw new Error('No topic in response');
  } catch (error) {
    if (error instanceof SearchAccessError) {
      throw error;
    }

    console.warn('AI API error, falling back to mock topic:', error);
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
    fr: `Une exploration de l'importance historique de ${query}. Ce sujet regroupe des evenements majeurs, des figures notables et des heritages durables qui ont faconne notre comprehension de cette question.`,
    ar: `استكشاف للأهمية التاريخية لموضوع ${query}. يجمع هذا الموضوع بين أحداث رئيسية وشخصيات بارزة وآثار طويلة المدى شكّلت فهمنا له.`,
  }[locale];

  const localizedContent = {
    en: `${query} represents a significant chapter in the tapestry of human history. The study of this topic reveals intricate connections between political, cultural, and social forces that continue to influence our world today.\n\nHistorians have long debated the precise significance and legacy of ${query}, with perspectives shifting as new evidence and interpretive frameworks emerge. What remains constant is the profound impact this subject has had on subsequent generations.\n\nThe exploration of ${query} invites us to consider how the past informs our present, and how the lessons drawn from historical study can illuminate the path forward. Each discovery adds a new thread to our understanding of the human experience.\n\nAs we delve deeper into this topic, we uncover layers of complexity that defy simple categorization. The story of ${query} is ultimately a story about human ambition, resilience, and the eternal quest for meaning.`,
    fr: `${query} represente un chapitre important de l'histoire humaine. L'etude de ce sujet revele des liens complexes entre des forces politiques, culturelles et sociales qui continuent d'influencer notre monde.\n\nLes historiens debattent depuis longtemps de la signification precise et de l'heritage de ${query}, alors que les interpretations evoluent avec de nouvelles sources et de nouveaux cadres d'analyse. Ce qui demeure constant, c'est l'impact profond de ce sujet sur les generations suivantes.\n\nExplorer ${query}, c'est reflechir a la maniere dont le passe eclaire le present et dont les lecons de l'histoire peuvent nous orienter. Chaque decouverte ajoute un nouveau fil a notre comprehension de l'experience humaine.\n\nEn approfondissant ce sujet, nous decouvrons des couches de complexite qui resistent aux classifications simples. L'histoire de ${query} est, au fond, une histoire d'ambition humaine, de resilience et de quete de sens.`,
    ar: `يمثل ${query} فصلاً مهماً في نسيج التاريخ الإنساني. وتكشف دراسة هذا الموضوع عن روابط معقدة بين القوى السياسية والثقافية والاجتماعية التي ما تزال تؤثر في عالمنا اليوم.\n\nلقد ناقش المؤرخون طويلاً المعنى الدقيق والإرث الذي تركه ${query}، مع تغيّر القراءات التاريخية كلما ظهرت أدلة جديدة وأطر تفسير مختلفة. وما يبقى ثابتاً هو الأثر العميق لهذا الموضوع في الأجيال اللاحقة.\n\nإن استكشاف ${query} يدعونا إلى التفكير في كيفية إضاءة الماضي لحاضرنا، وكيف يمكن للدروس المستخلصة من التاريخ أن ترشدنا إلى الأمام. فكل اكتشاف يضيف خيطاً جديداً إلى فهمنا للتجربة الإنسانية.\n\nومع التعمق في هذا الموضوع، نكشف طبقات من التعقيد تتجاوز التصنيفات البسيطة. وفي النهاية، فإن قصة ${query} هي قصة عن الطموح الإنساني والقدرة على الصمود والسعي الدائم إلى المعنى.`,
  }[locale];

  return sanitizeTopic({
    id: generateId(),
    title: query,
    slug: slugify(query),
    query,
    category,
    era: 'Historical Period',
    summary: localizedSummary,
    fullContent: localizedContent,
    timelineEvents: [
      {
        year: 'Origin',
        title: 'Beginning of the Era',
        description: `The foundational period of ${query}, establishing the conditions for what would follow.`,
      },
      {
        year: 'Peak',
        title: 'Height of Influence',
        description: `The zenith of ${query}'s impact on the broader historical landscape.`,
      },
      {
        year: 'Legacy',
        title: 'Enduring Legacy',
        description: `The lasting influence of ${query} on subsequent historical developments.`,
      },
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
