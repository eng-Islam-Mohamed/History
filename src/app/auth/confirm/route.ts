import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/i18n/config';
import { localizePath } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

function getSafeLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get('locale')?.value;
  return cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;
}

function getSafeNext(next: string | null, fallbackLocale: ReturnType<typeof getSafeLocale>) {
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    return next;
  }

  return localizePath(fallbackLocale, '/library');
}

export async function GET(request: NextRequest) {
  const locale = getSafeLocale(request);
  const next = getSafeNext(request.nextUrl.searchParams.get('next'), locale);
  const loginUrl = new URL(localizePath(locale, '/login'), request.url);
  loginUrl.searchParams.set('next', next);

  if (!hasSupabaseEnv()) {
    loginUrl.searchParams.set('error', 'Supabase env is missing.');
    return NextResponse.redirect(loginUrl);
  }

  const code = request.nextUrl.searchParams.get('code');
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type') as EmailOtpType | null;
  const redirectTo = new URL(next, request.url);
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  loginUrl.searchParams.set(
    'error',
    'We could not confirm your account. Please try signing in again.'
  );
  return NextResponse.redirect(loginUrl);
}
