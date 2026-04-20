import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/i18n/config';
import { getLocaleInstruction } from '@/lib/ai/historyService';
import {
  buildAskEraFallback,
  buildComparisonExperience,
} from '@/lib/experience/intelligence';
import { HistoryTopic } from '@/types';

function parseJsonPayload<T>(content: string): T | null {
  try {
    const match = content.match(/\{[\s\S]*\}/);
    return match ? (JSON.parse(match[0]) as T) : null;
  } catch {
    return null;
  }
}

async function requestIntelligence(messages: Array<{ role: 'system' | 'user'; content: string }>) {
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'https://api.deepseek.com';

  if (!apiKey) {
    return null;
  }

  const response = await fetch(`${apiUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.55,
      max_tokens: 2200,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content as string | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;

    if (body.mode === 'ask-era') {
      const topic = body.topic as HistoryTopic;
      const perspective = String(body.perspective || 'a citizen of the era');
      const prompt = String(body.prompt || '');

      const fallback = buildAskEraFallback(topic, perspective, locale);
      const content = await requestIntelligence([
        {
          role: 'system',
          content: `You are a historically responsible narrative assistant. Return ONLY valid JSON with this exact shape: {"title":"...","perspective":"...","response":"...","caution":"..."}. Clearly label the answer as a perspective simulation rather than literal truth. ${getLocaleInstruction(locale)}`,
        },
        {
          role: 'user',
          content: `Topic JSON: ${JSON.stringify(topic)}\nPerspective: ${perspective}\nPrompt: ${prompt}`,
        },
      ]);

      const parsed = content ? parseJsonPayload<typeof fallback>(content) : null;
      return NextResponse.json({ result: parsed ?? fallback });
    }

    if (body.mode === 'compare') {
      const left = body.left as HistoryTopic;
      const right = body.right as HistoryTopic;
      const fallback = buildComparisonExperience(left, right, locale);
      const content = await requestIntelligence([
        {
          role: 'system',
          content: `You are a senior historian. Return ONLY valid JSON with this exact shape: {"title":"...","subtitle":"...","leftTitle":"...","rightTitle":"...","similarities":["..."],"differences":["..."],"sections":[{"id":"overview","label":"Overview","left":"...","right":"...","summary":"..."}],"confidence":{"level":"commonly-accepted|debated|uncertain|approximate","label":"...","note":"..."}}. Include the sections overview, origin, timeline, political-structure, military-power, economy, culture-society, key-figures, turning-points, major-conflicts, decline-legacy, influence. ${getLocaleInstruction(locale)}`,
        },
        {
          role: 'user',
          content: `Left topic: ${JSON.stringify(left)}\nRight topic: ${JSON.stringify(right)}`,
        },
      ]);

      const parsed = content ? parseJsonPayload<typeof fallback>(content) : null;
      return NextResponse.json({ result: parsed ?? fallback });
    }

    return NextResponse.json({ error: 'Unsupported intelligence mode' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
