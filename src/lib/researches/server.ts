import { AuthenticatedUser, UserProfile } from '@/types/auth';
import {
  SavedResearchRow,
  savedResearchToBook,
  savedResearchToTopic,
} from '@/lib/researches';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

export async function getCurrentAuthState() {
  if (!hasSupabaseEnv()) {
    return {
      user: null,
      profile: null,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
    };
  }

  const authUser: AuthenticatedUser = {
    id: user.id,
    email: user.email ?? null,
  };

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, preferred_locale')
    .eq('id', user.id)
    .maybeSingle<{ display_name: string | null; preferred_locale: string | null }>();

  const normalizedProfile: UserProfile = {
    displayName: profile?.display_name ?? null,
    preferredLocale:
      profile?.preferred_locale === 'en' ||
      profile?.preferred_locale === 'fr' ||
      profile?.preferred_locale === 'ar'
        ? profile.preferred_locale
        : null,
  };

  return {
    user: authUser,
    profile: normalizedProfile,
  };
}

export async function getSavedBooksForCurrentUser() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from('saved_researches')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<SavedResearchRow[]>();

  return (data ?? []).map(savedResearchToBook);
}

export async function getSavedTopicForCurrentUser(slug: string) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from('saved_researches')
    .select('*')
    .eq('slug', slug)
    .maybeSingle<SavedResearchRow>();

  return data ? savedResearchToTopic(data) : null;
}
