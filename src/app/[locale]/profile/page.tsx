import { redirect } from 'next/navigation';
import ProfilePageClient from './ProfilePageClient';
import { Locale, defaultLocale, isLocale } from '@/i18n/config';
import { localizePath } from '@/i18n/navigation';
import { normalizeProfileRow } from '@/lib/auth/profile';
import { mapSupabaseUser } from '@/lib/auth/user';
import { getKnowledgeProfileForCurrentUser } from '@/lib/experience/server';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { AuthenticatedUser, UserProfile } from '@/types/auth';

export default async function LocalizedProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const profilePath = localizePath(locale, '/profile');

  if (!hasSupabaseEnv()) {
    redirect(localizePath(locale, '/login'));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `${localizePath(locale, '/login')}?next=${encodeURIComponent(profilePath)}`
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, display_name, preferred_locale, bio, avatar_url')
    .eq('id', user.id)
    .maybeSingle<{
      first_name: string | null;
      last_name: string | null;
      display_name: string | null;
      preferred_locale: string | null;
      bio: string | null;
      avatar_url: string | null;
    }>();

  const initialUser = mapSupabaseUser(user) as AuthenticatedUser;

  const initialProfile: UserProfile = normalizeProfileRow(profile);
  const knowledgeProfile = await getKnowledgeProfileForCurrentUser(locale);

  return (
    <ProfilePageClient
      initialProfile={initialProfile}
      initialUser={initialUser}
      knowledgeProfile={knowledgeProfile}
    />
  );
}
