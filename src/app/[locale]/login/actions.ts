'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Locale, defaultLocale, isLocale } from '@/i18n/config';
import { localizePath } from '@/i18n/navigation';
import { buildAppUrl } from '@/lib/app-url';
import { createClient } from '@/lib/supabase/server';

function getSafeLocale(value: FormDataEntryValue | null): Locale {
  return typeof value === 'string' && isLocale(value) ? value : defaultLocale;
}

function getSafeNext(next: FormDataEntryValue | null, locale: Locale) {
  if (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')) {
    return next;
  }

  return localizePath(locale, '/library');
}

function getFieldValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function signIn(formData: FormData) {
  const locale = getSafeLocale(formData.get('locale'));
  const next = getSafeNext(formData.get('next'), locale);
  const email = getFieldValue(formData, 'email');
  const password = getFieldValue(formData, 'password');
  const loginPath = localizePath(locale, '/login');
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `${loginPath}?mode=signin&error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
    );
  }

  revalidatePath('/', 'layout');
  redirect(next);
}

export async function signUp(formData: FormData) {
  const locale = getSafeLocale(formData.get('locale'));
  const next = getSafeNext(formData.get('next'), locale);
  const firstName = getFieldValue(formData, 'firstName');
  const lastName = getFieldValue(formData, 'lastName');
  const email = getFieldValue(formData, 'email');
  const password = getFieldValue(formData, 'password');
  const loginPath = localizePath(locale, '/login');

  if (!firstName || !lastName) {
    redirect(
      `${loginPath}?mode=signup&error=${encodeURIComponent('First name and last name are required.')}&next=${encodeURIComponent(next)}`
    );
  }

  const requestHeaders = await headers();
  const confirmUrl = new URL(buildAppUrl('/auth/confirm', requestHeaders));
  confirmUrl.searchParams.set('next', next);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName}`.trim(),
        preferred_locale: locale,
      },
      emailRedirectTo: confirmUrl.toString(),
    },
  });

  if (error) {
    redirect(
      `${loginPath}?mode=signup&error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
    );
  }

  revalidatePath('/', 'layout');

  if (data.session) {
    redirect(next);
  }

  redirect(
    `${loginPath}?mode=signup&success=confirm&next=${encodeURIComponent(next)}`
  );
}
