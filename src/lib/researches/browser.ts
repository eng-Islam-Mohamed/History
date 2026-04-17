import { PostgrestError } from '@supabase/supabase-js';
import { Locale } from '@/i18n/config';
import { HistoryTopic } from '@/types';
import {
  createSavedResearchPayload,
  SavedResearchRow,
  savedResearchToTopic,
} from '@/lib/researches';
import { createClient } from '@/lib/supabase/client';
import { hasSupabaseEnv } from '@/lib/supabase/env';

export async function saveResearchForCurrentUser(
  topic: HistoryTopic,
  locale: Locale
) {
  if (!hasSupabaseEnv()) {
    return {
      topic: null,
      error: new Error('Supabase is not configured'),
    };
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return {
      topic: null,
      error: authError,
    };
  }

  if (!user) {
    return {
      topic: null,
      error: new Error('Authentication required'),
    };
  }

  const { data, error } = await supabase
    .from('saved_researches')
    .upsert(
      {
        user_id: user.id,
        ...createSavedResearchPayload(topic, locale),
      },
      {
        onConflict: 'user_id,slug',
      }
    )
    .select('*')
    .single<SavedResearchRow>();

  return {
    topic: data ? savedResearchToTopic(data) : null,
    error,
  };
}

export async function getSavedResearchBySlugClient(slug: string) {
  if (!hasSupabaseEnv()) {
    return {
      topic: null,
      error: new Error('Supabase is not configured'),
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('saved_researches')
    .select('*')
    .eq('slug', slug)
    .maybeSingle<SavedResearchRow>();

  return {
    topic: data ? savedResearchToTopic(data) : null,
    error: error as PostgrestError | null,
  };
}
