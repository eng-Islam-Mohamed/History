import { Locale } from '@/i18n/config';

export interface AuthenticatedUser {
  id: string;
  email: string | null;
  emailVerified: boolean;
  verifiedAt: string | null;
}

export interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  preferredLocale: Locale | null;
  bio: string | null;
  avatarUrl: string | null;
}
