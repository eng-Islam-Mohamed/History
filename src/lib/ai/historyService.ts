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

function getObjectField(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function getNormalizedPayload(parsed: Record<string, unknown>): Record<string, unknown> {
  const dossier = getObjectField(parsed.dossier);
  if (!dossier) {
    return parsed;
  }

  const subject = getObjectField(dossier.subject);
  const majorActors = getObjectField(dossier.major_actors);
  const chronology = getArrayOfObjects(dossier.concrete_chronology).map((entry) => ({
    date: getStringField(entry.year) || getStringField(entry.date),
    title: getStringField(entry.title) || getStringField(entry.event),
    description: getStringField(entry.description) || getStringField(entry.event),
  }));
  const causes = getArrayOfStrings(dossier.causes);
  const consequences = getArrayOfStrings(dossier.consequences);
  const legacy = getArrayOfStrings(dossier.legacy);
  const significance = getArrayOfStrings(dossier.historical_significance);
  const debate = getArrayOfStrings(dossier.historical_debate);
  const actorGroups = [
    ...getArrayOfObjects(majorActors?.macedonian),
    ...getArrayOfObjects(majorActors?.persian),
    ...getArrayOfObjects(majorActors?.other),
  ];

  return {
    query_type: getStringField(dossier.query_type) || getStringField(parsed.query_type),
    title:
      getStringField(dossier.title) ||
      getStringField(subject?.known_as) ||
      getStringField(subject?.name) ||
      getStringField(parsed.title),
    subtitle:
      getStringField(dossier.subtitle) ||
      getStringField(subject?.title) ||
      getStringField(parsed.subtitle),
    summary:
      getStringField(dossier.summary) ||
      getStringField(dossier.overview) ||
      getStringField(parsed.summary),
    era: getStringField(dossier.era) || getStringField(parsed.era),
    region: getStringField(dossier.region) || getStringField(parsed.region),
    key_points:
      getArrayOfStrings(dossier.key_points).length > 0
        ? getArrayOfStrings(dossier.key_points)
        : [...causes.slice(0, 2), ...consequences.slice(0, 2), ...legacy.slice(0, 1)],
    timeline: chronology.length > 0 ? chronology : getArrayOfObjects(parsed.timeline),
    sections: [
      { heading: 'Overview', content: getStringField(dossier.overview) },
      { heading: 'Historical Significance', content: significance.join(' ') },
      { heading: 'Historical Debate', content: debate.join(' ') },
      { heading: 'Legacy', content: legacy.join(' ') },
    ].filter((section) => getStringField(section.content).trim().length > 0),
    related_entities: actorGroups.map((actor) => ({
      name: getStringField(actor.name),
      type: 'person',
      reason: getStringField(actor.role),
    })),
    recommendations:
      getArrayOfStrings(dossier.recommendations).length > 0
        ? getArrayOfStrings(dossier.recommendations)
        : legacy.slice(0, 2),
    visual_theme: getObjectField(dossier.visual_theme) ?? getObjectField(parsed.visual_theme),
    confidence: getObjectField(dossier.confidence) ?? getObjectField(parsed.confidence),
  };
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
      const parsed = getNormalizedPayload(JSON.parse(jsonMatch[0]) as Record<string, unknown>);
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

function normalizeForMatching(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{Letter}\p{Number}\s]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function getQueryTokens(query: string): string[] {
  const source = /[\u0600-\u06FF]/u.test(query)
    ? query.toLocaleLowerCase()
    : normalizeForMatching(query);
  const tokens = source
    .split(/\s+/u)
    .map((token) => token.replace(/[^\p{Letter}\p{Number}]/gu, ''))
    .filter(Boolean);

  return tokens.filter((token) => {
    if (/[\u0600-\u06FF]/u.test(token)) {
      return token.length >= 2;
    }

    return token.length >= 3;
  });
}

function categoriesLookCompatible(query: string, resultCategory: TopicCategory): boolean {
  const expected = inferCategory(query);
  if (expected === resultCategory) {
    return true;
  }

  if ((expected === 'empire' && resultCategory === 'kingdom') || (expected === 'kingdom' && resultCategory === 'empire')) {
    return true;
  }

  if (expected === 'event' && resultCategory === 'war') {
    return true;
  }

  return false;
}

function seemsStrictMatch(query: string, topic: HistoryTopic): boolean {
  const tokens = getQueryTokens(query);
  const title = normalizeForMatching(topic.title);
  const namesHaystack = normalizeForMatching(
    [topic.title, topic.keyFigures.map((figure) => figure.name).join(' ')]
      .filter(Boolean)
      .join(' ')
  );
  const haystack = normalizeForMatching(
    [
      topic.title,
      topic.summary,
      topic.fullContent,
      topic.keyFigures.map((figure) => figure.name).join(' '),
      topic.relatedTopics.map((entity) => entity.name).join(' '),
    ]
      .filter(Boolean)
      .join(' ')
  );

  if (tokens.length === 0) {
    return true;
  }

  if (tokens.some((token) => title.includes(token))) {
    return true;
  }

  const matchedCount = tokens.filter((token) => haystack.includes(token)).length;
  const expectedCategory = inferCategory(query);

  if (expectedCategory === 'figure' && tokens.length >= 2) {
    const nameMatches = tokens.filter((token) => namesHaystack.includes(token)).length;
    return nameMatches >= 1 || matchedCount >= Math.max(2, tokens.length);
  }

  if (tokens.length >= 2 && matchedCount >= Math.ceil(tokens.length / 2)) {
    return true;
  }

  return matchedCount > 0 && categoriesLookCompatible(query, topic.category);
}

function buildCorrectivePrompt(query: string, previousContent: string): string {
  return [
    `The previous answer did not stay on the exact requested subject: "${query}".`,
    'Return ONLY valid JSON for the exact requested subject.',
    'Do not switch to another person, war, empire, kingdom, or event.',
    'If the query is a historical figure, the returned title must explicitly name that figure.',
    'If the user wrote in Arabic or French, answer in that language.',
    '',
    'Previous incorrect answer:',
    previousContent.slice(0, 2400),
  ].join('\n');
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
      if (data.relevanceChecked === false || seemsStrictMatch(query, data.topic)) {
        return data.topic;
      }

      throw new Error('The archive AI returned a result for a different subject.');
    }

    if (data.error) {
      throw new Error(String(data.error));
    }

    throw new Error('No topic in response');
  } catch (error) {
    if (error instanceof SearchAccessError) {
      throw error;
    }

    console.warn('AI API error:', error);
    throw error instanceof Error
      ? error
      : new Error('The AI archive is temporarily unavailable.');
  }
}

export function getTopicBySlug(slug: string): HistoryTopic | null {
  const match = mockTopics.find((t) => t.slug === slug);
  return match ? sanitizeTopic(match) : null;
}

function isTopicRelevantToQuery(query: string, topic: HistoryTopic): boolean {
  return seemsStrictMatch(query, topic);
}

export { AI_PROMPT, buildCorrectivePrompt, getLocaleInstruction, isTopicRelevantToQuery, parseAIResponse };
