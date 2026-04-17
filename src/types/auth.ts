import { Locale } from '@/i18n/config';

export interface AuthenticatedUser {
  id: string;
  email: string | null;
}

export interface UserProfile {
  displayName: string | null;
  preferredLocale: Locale | null;
}
