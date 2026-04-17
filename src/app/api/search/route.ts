import { NextRequest, NextResponse } from 'next/server';
import { AI_PROMPT, getLocaleInstruction, parseAIResponse } from '@/lib/ai/historyService';
import { defaultLocale, isLocale } from '@/i18n/config';

export async function POST(request: NextRequest) {
  try {
    const { query, locale: rawLocale } = await request.json();
    const locale = rawLocale && isLocale(rawLocale) ? rawLocale : defaultLocale;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'https://api.deepseek.com';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: `${AI_PROMPT}\n\n${getLocaleInstruction(locale)}` },
          { role: 'user', content: `Historical query: "${query}"` },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'AI service unavailable' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Empty response from AI' },
        { status: 502 }
      );
    }

    const topic = parseAIResponse(content, query);

    return NextResponse.json({ topic });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
