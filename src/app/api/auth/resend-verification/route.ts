import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildAppUrl } from '@/lib/app-url';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

function getSafeNext(next: unknown) {
  if (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')) {
    return next;
  }

  return '/library';
}

export async function POST(request: NextRequest) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'You must be signed in to resend verification.' }, { status: 401 });
  }

  if (user.email_confirmed_at ?? user.confirmed_at) {
    return NextResponse.json({ error: 'Your email is already verified.' }, { status: 400 });
  }

  let next = '/library';
  try {
    const body = await request.json();
    next = getSafeNext(body?.next);
  } catch {
    next = '/library';
  }

  const requestHeaders = await headers();
  const confirmUrl = new URL(buildAppUrl('/auth/confirm', requestHeaders));
  confirmUrl.searchParams.set('next', next);

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email,
    options: {
      emailRedirectTo: confirmUrl.toString(),
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: 'Verification email sent.',
    email: user.email,
  });
}
