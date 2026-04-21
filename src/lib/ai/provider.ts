type AiMessage = {
  role: 'system' | 'user';
  content: string;
};

type RequestAiCompletionOptions = {
  messages: AiMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
  retries?: number;
  timeoutMs?: number;
};

export class AiProviderError extends Error {
  code: 'missing_config' | 'upstream_error' | 'invalid_response';
  status?: number;
  details?: string;

  constructor(
    code: 'missing_config' | 'upstream_error' | 'invalid_response',
    message: string,
    options?: { status?: number; details?: string }
  ) {
    super(message);
    this.code = code;
    this.status = options?.status;
    this.details = options?.details;
  }
}

function normalizeApiBaseUrl(value: string | undefined): string {
  const base = (value || 'https://api.deepseek.com').trim().replace(/\/+$/, '');
  return base.endsWith('/chat/completions') ? base.slice(0, -'/chat/completions'.length) : base;
}

function resolveAiConfig() {
  const apiUrl = normalizeApiBaseUrl(
    process.env.AI_API_URL || process.env.NEXT_PUBLIC_AI_API_URL || process.env.DEEPSEEK_API_URL
  );
  const isOpenAIUrl = /api\.openai\.com/i.test(apiUrl);
  const apiKey = isOpenAIUrl
    ? process.env.OPENAI_API_KEY || process.env.AI_API_KEY || ''
    : process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY || '';

  if (!apiKey) {
    throw new AiProviderError(
      'missing_config',
      isOpenAIUrl
        ? 'AI search is not configured on the server. Add OPENAI_API_KEY or AI_API_KEY and restart the app.'
        : 'AI search is not configured on the server. Add AI_API_KEY or DEEPSEEK_API_KEY and restart the app.'
    );
  }

  return { apiKey, apiUrl };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(status: number) {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

export async function requestAiCompletion({
  messages,
  temperature = 0.35,
  maxTokens = 4000,
  model = 'deepseek-chat',
  retries = 2,
  timeoutMs = 90_000,
}: RequestAiCompletionOptions): Promise<string> {
  const { apiKey, apiUrl } = resolveAiConfig();
  let currentMaxTokens = maxTokens;
  let lastError: AiProviderError | null = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: currentMaxTokens,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        const details = await response.text();
        const retryable = shouldRetry(response.status);

        if (
          response.status === 400 &&
          currentMaxTokens > 3200 &&
          /max_tokens|context|length|too long|exceed/i.test(details)
        ) {
          currentMaxTokens = 3200;
          continue;
        }

        lastError = new AiProviderError(
          'upstream_error',
          retryable
            ? 'The archive AI is temporarily unavailable. Please try again in a moment.'
            : response.status === 401 || response.status === 403
              ? 'The configured AI provider key was rejected. Check the Vercel AI_API_KEY or DEEPSEEK_API_KEY for production.'
              : 'The archive AI rejected this search request.',
          { status: response.status, details }
        );

        if (retryable && attempt < retries) {
          await sleep(600 * (attempt + 1));
          continue;
        }

        throw lastError;
      }

      const payload = await response.json();
      const content = payload.choices?.[0]?.message?.content;

      if (!content || typeof content !== 'string') {
        throw new AiProviderError(
          'invalid_response',
          'The archive AI returned an empty response.',
          { details: JSON.stringify(payload).slice(0, 1200) }
        );
      }

      return content;
    } catch (error) {
      if (error instanceof AiProviderError) {
        lastError = error;
        throw error;
      }

      const details = error instanceof Error ? error.message : String(error);
      if (/timeout|aborted/i.test(details) && currentMaxTokens > 2600) {
        currentMaxTokens = Math.max(2600, Math.floor(currentMaxTokens * 0.7));
      }

      lastError = new AiProviderError(
        'upstream_error',
        'The archive AI did not respond in time. Please try again.',
        { details }
      );

      if (attempt < retries) {
        await sleep(600 * (attempt + 1));
        continue;
      }
    }
  }

  throw lastError ?? new AiProviderError('upstream_error', 'The archive AI is unavailable.');
}
