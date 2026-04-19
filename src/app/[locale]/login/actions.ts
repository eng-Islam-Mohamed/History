'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { type EmailOtpType } from '@supabase/supabase-js';
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

function getPendingVerificationRedirect({
  locale,
  next,
  email,
  message,
}: {
  locale: Locale;
  next: string;
  email: string;
  message?: string;
}) {
  const loginPath = localizePath(locale, '/login');
  const params = new URLSearchParams({
    mode: 'signup',
    success: 'verify-code',
    next,
    email,
  });

  if (message) {
    params.set('message', message);
  }

  return `${loginPath}?${params.toString()}`;
}

async function verifyEmailCodeForTypes({
  supabase,
  email,
  token,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  email: string;
  token: string;
}) {
  const attempts: EmailOtpType[] = ['email', 'signup'];
  let lastError: string | null = null;

  for (const type of attempts) {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });

    if (!error) {
      return true;
    }

    lastError = error.message;
  }

  return lastError;
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
    if (/already registered/i.test(error.message)) {
      redirect(
        getPendingVerificationRedirect({
          locale,
          next,
          email,
          message: 'Account already exists. Enter the verification code from your email or resend a fresh code.',
        })
      );
    }

    redirect(
      `${loginPath}?mode=signup&error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
    );
  }

  revalidatePath('/', 'layout');

  if (data.session) {
    redirect(next);
  }

  redirect(getPendingVerificationRedirect({ locale, next, email }));
}

export async function verifyEmailCode(formData: FormData) {
  const locale = getSafeLocale(formData.get('locale'));
  const next = getSafeNext(formData.get('next'), locale);
  const email = getFieldValue(formData, 'email');
  const code = getFieldValue(formData, 'code');
  const loginPath = localizePath(locale, '/login');

  if (!email || !code) {
    redirect(
      `${loginPath}?mode=signup&error=${encodeURIComponent('Email and verification code are required.')}&email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`
    );
  }

  const supabase = await createClient();
  const result = await verifyEmailCodeForTypes({
    supabase,
    email,
    token: code,
  });

  if (result !== true) {
    redirect(
      `${loginPath}?mode=signup&error=${encodeURIComponent(result ?? 'The verification code is invalid or expired.')}&email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`
    );
  }

  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect(
    `${loginPath}?mode=signin&verified=success&next=${encodeURIComponent(next)}`
  );
}

export async function resendVerificationCode(formData: FormData) {
  const locale = getSafeLocale(formData.get('locale'));
  const next = getSafeNext(formData.get('next'), locale);
  const email = getFieldValue(formData, 'email');

  if (!email) {
    redirect(
      `${localizePath(locale, '/login')}?mode=signup&error=${encodeURIComponent('Email is required to resend a verification code.')}&next=${encodeURIComponent(next)}`
    );
  }

  const requestHeaders = await headers();
  const confirmUrl = new URL(buildAppUrl('/auth/confirm', requestHeaders));
  confirmUrl.searchParams.set('next', next);

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: confirmUrl.toString(),
    },
  });

  if (error) {
    redirect(
      `${localizePath(locale, '/login')}?mode=signup&email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}&error=${encodeURIComponent(error.message)}`
    );
  }

  redirect(
    getPendingVerificationRedirect({
      locale,
      next,
      email,
      message: 'A fresh verification code has been sent to your email address.',
    })
  );
}
