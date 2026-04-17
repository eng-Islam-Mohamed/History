'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
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

function mapUser(user: User | null): AuthenticatedUser | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}

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
  const [profile] = useState<UserProfile | null>(initialProfile);
  const supabaseEnabled = hasSupabaseEnv();

  useEffect(() => {
    if (!supabaseEnabled) {
      return;
    }

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user ?? null));
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
