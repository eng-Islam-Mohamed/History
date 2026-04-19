const LOCAL_DEV_URL = 'http://localhost:3000';

function normalizeBaseUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    url.pathname = '/';
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

function getConfiguredBaseUrl() {
  const candidates = [
    process.env.APP_BASE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const normalized = candidate ? normalizeBaseUrl(candidate) : null;
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function getRequestBaseUrl(headersLike?: Pick<Headers, 'get'> | null) {
  if (!headersLike) {
    return null;
  }

  const origin = headersLike.get('origin');
  const normalizedOrigin = origin ? normalizeBaseUrl(origin) : null;
  if (normalizedOrigin) {
    return normalizedOrigin;
  }

  const forwardedHost = headersLike.get('x-forwarded-host');
  const host = forwardedHost ?? headersLike.get('host');
  if (!host) {
    return null;
  }

  const proto = headersLike.get('x-forwarded-proto') ?? 'https';
  return normalizeBaseUrl(`${proto}://${host}`);
}

export function getAppBaseUrl(headersLike?: Pick<Headers, 'get'> | null) {
  return getConfiguredBaseUrl() || getRequestBaseUrl(headersLike) || LOCAL_DEV_URL;
}

export function buildAppUrl(pathname: string, headersLike?: Pick<Headers, 'get'> | null) {
  return new URL(pathname, `${getAppBaseUrl(headersLike)}/`).toString();
}
