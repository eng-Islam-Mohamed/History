import { NextRequest, NextResponse } from 'next/server';
import {
  AI_PROMPT,
  buildCorrectivePrompt,
  getLocaleInstruction,
  isTopicRelevantToQuery,
  parseAIResponse,
} from '@/lib/ai/historyService';
import { AiProviderError, requestAiCompletion } from '@/lib/ai/provider';
import { defaultLocale, isLocale } from '@/i18n/config';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

function inferSearchIntent(query: string) {
  const normalized = query.toLocaleLowerCase();

  if (/compare|vs|versus|against|difference between|مقارنة|قارن|contre/i.test(normalized)) {
    return 'comparison';
  }

  if (/timeline|chronology|periods|مراحل|خط زمني|تسلسل/i.test(normalized)) {
    return 'timeline';
  }

  if (/war|battle|siege|campaign|conflict|حرب|معركة|فتح|حصار/i.test(normalized)) {
    return 'war_or_battle';
  }

  if (/empire|caliphate|sultanate|dynasty|kingdom|civilization|إمبراطورية|خلافة|سلطنة|دولة|مملكة|حضارة|سلالة/i.test(normalized)) {
    return 'empire_or_kingdom';
  }

  if (/country|history of|republic|nation|بلد|دولة|تاريخ /i.test(normalized)) {
    return 'country_history';
  }

  if (/event|revolution|treaty|fall of|rise of|حدث|ثورة|معاهدة|سقوط|قيام/i.test(normalized)) {
    return 'event';
  }

  return 'historical_figure';
}

function buildFocusInstruction(query: string) {
  const intent = inferSearchIntent(query);

  switch (intent) {
    case 'historical_figure':
      return `Treat this as a historical figure query. The exact person to identify is: "${query}". If you are not reasonably sure who this person is, say that clearly in confidence.notes instead of switching to another subject.`;
    case 'war_or_battle':
      return `Treat this as a war or battle query. The exact conflict to identify is: "${query}". Do not replace it with a different war.`;
    case 'empire_or_kingdom':
      return `Treat this as an empire, kingdom, dynasty, caliphate, or civilization query. The exact polity to identify is: "${query}".`;
    case 'country_history':
      return `Treat this as a country history query focused on: "${query}".`;
    case 'timeline':
      return `Treat this as a timeline request focused strictly on: "${query}".`;
    case 'comparison':
      return `Treat this as a comparison request focused strictly on: "${query}".`;
    default:
      return `Stay strictly on the exact requested subject: "${query}".`;
  }
}

function buildSearchPrompt(query: string) {
  return `Historical query: "${query}"

Research this deeply. Return a topic-specific dossier with concrete chronology, major actors, turning points, causes, consequences, legacy, and enough detail for a premium history app. Do not use generic placeholder language. Make the answer specific to this exact query.

${buildFocusInstruction(query)}

Prefer the standard historical name for the title, but only if it refers to the same exact subject as the user's query.`;
}

export async function POST(request: NextRequest) {
  try {
    if (hasSupabaseEnv()) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: 'Authentication is required to search.', code: 'auth_required' },
          { status: 401 }
        );
      }

      if (!(user.email_confirmed_at ?? user.confirmed_at)) {
        return NextResponse.json(
          { error: 'Please verify your email address to use search.', code: 'email_not_verified' },
          { status: 403 }
        );
      }
    }

    const { query, locale: rawLocale } = await request.json();
    const locale = rawLocale && isLocale(rawLocale) ? rawLocale : defaultLocale;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const systemPrompt = `${AI_PROMPT}

${getLocaleInstruction(locale)}

Always answer the exact requested subject. If the query names a person, empire, war, kingdom, country, or event, your title must stay on that exact subject. If the query looks like a personal name, do not answer with a war, era, treaty, or broad topic.`;

    const content = await requestAiCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: buildSearchPrompt(query) },
      ],
      temperature: 0.35,
      maxTokens: 3200,
      retries: 2,
    });

    let topic = parseAIResponse(content, query);

    if (!isTopicRelevantToQuery(query, topic)) {
      const refinedContent = await requestAiCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: buildCorrectivePrompt(query, content) },
        ],
        temperature: 0.2,
        maxTokens: 2800,
        retries: 2,
      });

      topic = parseAIResponse(refinedContent, query);

      if (!isTopicRelevantToQuery(query, topic)) {
        return NextResponse.json(
          {
            error:
              'The archive AI could not lock onto the exact subject for this query. Please try a slightly more specific search.',
          },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ topic, relevanceChecked: true });
  } catch (error) {
    if (error instanceof AiProviderError) {
      console.error('Search API AI provider error:', error.status, error.details);
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'missing_config' ? 500 : 502 }
      );
    }

    console.error('Search API error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'The archive could not complete this dossier. Please try again.',
      },
      { status: 500 }
    );
  }
}
