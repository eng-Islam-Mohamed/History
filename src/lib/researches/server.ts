import { AuthenticatedUser, UserProfile } from '@/types/auth';
import {
  SavedResearchRow,
  savedResearchToBook,
  savedResearchToTopic,
} from '@/lib/researches';
import { mapSupabaseUser } from '@/lib/auth/user';
import { normalizeProfileRow } from '@/lib/auth/profile';
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

  const authUser = mapSupabaseUser(user) as AuthenticatedUser;

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

  const normalizedProfile: UserProfile = normalizeProfileRow(profile);

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
    .eq('user_id', user.id)
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
    .eq('user_id', user.id)
    .eq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<SavedResearchRow>();

  return data ? savedResearchToTopic(data) : null;
}

export async function getSavedTopicForCurrentUserById(id: string) {
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
    .eq('user_id', user.id)
    .eq('id', id)
    .maybeSingle<SavedResearchRow>();

  return data ? savedResearchToTopic(data) : null;
}
