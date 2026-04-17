import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export default async function SearchRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const queryValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = queryValue ? `?q=${encodeURIComponent(queryValue)}` : '';

  redirect(`/${defaultLocale}/search${query}`);
}
