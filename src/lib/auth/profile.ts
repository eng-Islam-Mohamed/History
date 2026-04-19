import { Locale } from '@/i18n/config';
import { UserProfile } from '@/types/auth';

export interface ProfileRow {
  avatar_url: string | null;
  bio: string | null;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  preferred_locale: string | null;
}

function normalizeText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function normalizeProfileLocale(value: string | null | undefined): Locale | null {
  return value === 'en' || value === 'fr' || value === 'ar' ? value : null;
}

export function normalizeProfileRow(profile: ProfileRow | null | undefined): UserProfile {
  return {
    firstName: normalizeText(profile?.first_name),
    lastName: normalizeText(profile?.last_name),
    displayName: normalizeText(profile?.display_name),
    preferredLocale: normalizeProfileLocale(profile?.preferred_locale),
    bio: normalizeText(profile?.bio),
    avatarUrl: normalizeText(profile?.avatar_url),
  };
}

export function getProfileFullName(profile: UserProfile | null | undefined) {
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim();
  return fullName || null;
}

export function getProfileDisplayName(
  profile: UserProfile | null | undefined,
  email: string | null
) {
  return (
    getProfileFullName(profile) ||
    profile?.displayName ||
    email?.split('@')[0] ||
    'Account'
  );
}

export function getProfileInitials(
  profile: UserProfile | null | undefined,
  email: string | null
) {
  return getProfileDisplayName(profile, email)
    .split(/\s+/)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('');
}
