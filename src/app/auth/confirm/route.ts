import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/i18n/config';
import { localizePath } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

function getSafeLocale(request: NextRequest, nextPath: string | null) {
  const pathnameLocale = nextPath?.split('/').filter(Boolean)[0];
  if (pathnameLocale && isLocale(pathnameLocale)) {
    return pathnameLocale;
  }

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
  const requestedNext = request.nextUrl.searchParams.get('next');
  const locale = getSafeLocale(request, requestedNext);
  const next = getSafeNext(requestedNext, locale);
  const loginUrl = new URL(localizePath(locale, '/login'), request.url);
  loginUrl.searchParams.set('next', next);

  if (!hasSupabaseEnv()) {
    loginUrl.searchParams.set('error', 'Supabase env is missing.');
    return NextResponse.redirect(loginUrl);
  }

  const code = request.nextUrl.searchParams.get('code');
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type') as EmailOtpType | null;
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await supabase.auth.signOut();
      loginUrl.searchParams.set('verified', 'success');
      return NextResponse.redirect(loginUrl);
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      await supabase.auth.signOut();
      loginUrl.searchParams.set('verified', 'success');
      return NextResponse.redirect(loginUrl);
    }
  }

  loginUrl.searchParams.set('verified', 'error');
  return NextResponse.redirect(loginUrl);
}
