'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { normalizeProfileRow } from '@/lib/auth/profile';
import { mapSupabaseUser } from '@/lib/auth/user';
import { createClient } from '@/lib/supabase/client';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { AuthenticatedUser, UserProfile } from '@/types/auth';

type AuthContextValue = {
  hasSupabase: boolean;
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  profile: UserProfile | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  initialProfile: UserProfile | null;
  initialUser: AuthenticatedUser | null;
}

export function AuthProvider({
  children,
  initialProfile,
  initialUser,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(initialUser);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const supabaseEnabled = hasSupabaseEnv();

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    if (!supabaseEnabled) {
      return;
    }

    const supabase = createClient();

    async function syncProfile(userId: string | null) {
      if (!userId) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, display_name, preferred_locale, bio, avatar_url')
        .eq('id', userId)
        .maybeSingle<{
          first_name: string | null;
          last_name: string | null;
          display_name: string | null;
          preferred_locale: string | null;
          bio: string | null;
          avatar_url: string | null;
        }>();

      setProfile(normalizeProfileRow(data));
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      void syncProfile(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseEnabled]);

  const value = useMemo<AuthContextValue>(
    () => ({
      hasSupabase: supabaseEnabled,
      isAuthenticated: Boolean(user),
      user,
      profile,
    }),
    [profile, supabaseEnabled, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
