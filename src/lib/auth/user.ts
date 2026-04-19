import type { User } from '@supabase/supabase-js';
import { AuthenticatedUser } from '@/types/auth';

function normalizeTimestamp(value: string | null | undefined) {
  return value ?? null;
}

export function mapSupabaseUser(user: User | null): AuthenticatedUser | null {
  if (!user) {
    return null;
  }

  const verifiedAt = normalizeTimestamp(user.email_confirmed_at ?? user.confirmed_at ?? null);

  return {
    id: user.id,
    email: user.email ?? null,
    emailVerified: Boolean(verifiedAt),
    verifiedAt,
  };
}
