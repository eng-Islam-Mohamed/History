import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/i18n/config';
import { localizePath } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

function getSafeLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get('locale')?.value;
  return cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;
}

function getSafeNext(request: NextRequest, next: FormDataEntryValue | null) {
  if (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')) {
    return next;
  }

  return localizePath(getSafeLocale(request), '/login');
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const next = getSafeNext(request, formData.get('next'));

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  revalidatePath('/', 'layout');
  return NextResponse.redirect(new URL(next, request.url), { status: 302 });
}
