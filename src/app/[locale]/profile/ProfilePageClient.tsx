'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Camera,
  CircleAlert,
  Globe2,
  LibraryBig,
  Mail,
  Save,
  Upload,
  UserCircle2,
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import EmailVerificationPanel from '@/components/auth/EmailVerificationPanel';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getLocaleLabel, locales, type Locale } from '@/i18n/config';
import { getUiCopy } from '@/i18n/ui-copy';
import { localizePath } from '@/i18n/navigation';
import { getProfileDisplayName, getProfileInitials } from '@/lib/auth/profile';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { AuthenticatedUser, UserProfile } from '@/types/auth';
import { KnowledgeProfile } from '@/types/experience';
import HistoricalVisualCard from '@/components/experience/HistoricalVisualCard';

const supabase = createClient();
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

type FeedbackState = {
  tone: 'success' | 'error';
  text: string;
} | null;

function normalizeLocale(value: string, fallback: Locale): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : fallback;
}

interface ProfilePageClientProps {
  initialProfile: UserProfile;
  initialUser: AuthenticatedUser;
  knowledgeProfile: KnowledgeProfile;
}

export default function ProfilePageClient({
  initialProfile,
  initialUser,
  knowledgeProfile,
}: ProfilePageClientProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const ui = getUiCopy(locale);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [firstName, setFirstName] = useState(initialProfile.firstName ?? '');
  const [lastName, setLastName] = useState(initialProfile.lastName ?? '');
  const [displayName, setDisplayName] = useState(initialProfile.displayName ?? '');
  const [preferredLocale, setPreferredLocale] = useState<Locale>(
    initialProfile.preferredLocale ?? locale
  );
  const [bio, setBio] = useState(initialProfile.bio ?? '');
  const [avatarPath, setAvatarPath] = useState<string | null>(
    initialProfile.avatarUrl
  );
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadAvatar() {
      if (!avatarPath) {
        setAvatarPreviewUrl(null);
        return;
      }

      const { data, error } = await supabase.storage
        .from('avatars')
        .download(avatarPath);

      if (cancelled) {
        return;
      }

      if (error) {
        console.warn('Avatar download failed:', error);
        setAvatarPreviewUrl(null);
        return;
      }

      objectUrl = URL.createObjectURL(data);
      setAvatarPreviewUrl(objectUrl);
    }

    void loadAvatar();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [avatarPath]);

  async function persistProfile(nextAvatarPath: string | null = avatarPath) {
    const normalizedLocale = normalizeLocale(preferredLocale, locale);
    const normalizedFirstName = firstName.trim() || null;
    const normalizedLastName = lastName.trim() || null;
    const normalizedDisplayName =
      displayName.trim() ||
      [normalizedFirstName, normalizedLastName].filter(Boolean).join(' ') ||
      null;

    const { error: authUpdateError } = await supabase.auth.updateUser({
      data: {
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        display_name: normalizedDisplayName,
        preferred_locale: normalizedLocale,
      },
    });

    if (authUpdateError) {
      console.warn('Auth profile metadata update failed:', authUpdateError);
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: initialUser.id,
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        display_name: normalizedDisplayName,
        preferred_locale: normalizedLocale,
        bio: bio.trim() || null,
        avatar_url: nextAvatarPath,
      })
      .select('first_name, last_name, display_name, preferred_locale, bio, avatar_url')
      .single<{
        first_name: string | null;
        last_name: string | null;
        display_name: string | null;
        preferred_locale: Locale;
        bio: string | null;
        avatar_url: string | null;
      }>();

    if (error) {
      throw error;
    }

    setFirstName(data.first_name ?? '');
    setLastName(data.last_name ?? '');
    setDisplayName(data.display_name ?? '');
    setPreferredLocale(data.preferred_locale);
    setBio(data.bio ?? '');
    setAvatarPath(data.avatar_url);

    document.cookie = `locale=${data.preferred_locale}; path=/; max-age=31536000; SameSite=Lax`;

    const nextProfilePath = localizePath(data.preferred_locale, '/profile');
    if (data.preferred_locale !== locale) {
      router.push(nextProfilePath);
      return;
    }

    router.refresh();
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await persistProfile();
      setFeedback({ tone: 'success', text: ui.profile.saved });
    } catch (error) {
      console.warn('Profile save failed:', error);
      setFeedback({ tone: 'error', text: ui.profile.saveError });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_SIZE) {
      setFeedback({ tone: 'error', text: ui.profile.fileRequirements });
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const nextAvatarPath = `${initialUser.id}/avatar.${extension}`;
    const previousAvatarPath = avatarPath;

    setIsUploading(true);
    setFeedback(null);

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(nextAvatarPath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      await persistProfile(nextAvatarPath);

      if (previousAvatarPath && previousAvatarPath !== nextAvatarPath) {
        const { error: cleanupError } = await supabase.storage
          .from('avatars')
          .remove([previousAvatarPath]);

        if (cleanupError) {
          console.warn('Avatar cleanup failed:', cleanupError);
        }
      }

      setFeedback({ tone: 'success', text: ui.profile.saved });
    } catch (error) {
      console.warn('Avatar upload failed:', error);
      setFeedback({ tone: 'error', text: ui.profile.uploadError });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemoveAvatar() {
    if (!avatarPath) {
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      const currentAvatarPath = avatarPath;
      const { error: removeError } = await supabase.storage
        .from('avatars')
        .remove([currentAvatarPath]);

      if (removeError) {
        throw removeError;
      }

      await persistProfile(null);
      setFeedback({ tone: 'success', text: ui.profile.saved });
    } catch (error) {
      console.warn('Avatar remove failed:', error);
      setFeedback({ tone: 'error', text: ui.profile.uploadError });
    } finally {
      setIsUploading(false);
    }
  }

  const liveProfile: UserProfile = {
    firstName: firstName.trim() || null,
    lastName: lastName.trim() || null,
    displayName: displayName.trim() || null,
    preferredLocale,
    bio: bio.trim() || null,
    avatarUrl: avatarPath,
  };
  const headingName = getProfileDisplayName(liveProfile, initialUser.email);
  const initials = getProfileInitials(liveProfile, initialUser.email);

  return (
    <>
      <Navbar />

      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]"
          >
            <aside className="space-y-6">
              <div className="vault-frame rounded-[2rem] p-6 md:p-7">
                <p className="text-[11px] uppercase tracking-[0.34em] text-primary/80">
                  {ui.profile.avatarTitle}
                </p>

                <div className="mt-6 flex flex-col items-center text-center">
                  <div className="relative">
                      {avatarPreviewUrl ? (
                      <Image
                        src={avatarPreviewUrl}
                        alt={headingName}
                        width={144}
                        height={144}
                        unoptimized
                        className="h-36 w-36 rounded-[2rem] object-cover shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                      />
                    ) : (
                      <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.04] text-4xl font-semibold text-primary shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
                        {initials}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute -bottom-3 -right-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-[0_12px_24px_rgba(0,0,0,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={ui.profile.uploadPhoto}
                    >
                      <Camera size={18} />
                    </button>
                  </div>

                  <h1 className="mt-6 font-[family-name:var(--font-headline)] text-4xl text-on-surface">
                    {headingName}
                  </h1>
                  <p className="mt-4 text-sm leading-relaxed text-stone-400">
                    {ui.profile.avatarDescription}
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.26em] text-stone-500">
                    {ui.profile.fileRequirements}
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />

                <div className="mt-8 grid gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Upload size={16} />
                    {isUploading ? ui.profile.uploadingPhoto : ui.profile.uploadPhoto}
                  </button>

                  {avatarPath && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={isUploading}
                      className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-stone-200 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {ui.profile.removePhoto}
                    </button>
                  )}
                </div>
              </div>

              <div className="soft-panel rounded-[2rem] p-6 md:p-7">
                <p className="text-[11px] uppercase tracking-[0.32em] text-stone-500">
                  {ui.profile.signedInAs}
                </p>
                <div className="mt-4 flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-on-surface">
                      {initialUser.email || ui.auth.account}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">{ui.profile.email}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <div
                    className={cn(
                      'rounded-[1.2rem] border px-4 py-3 text-sm',
                      initialUser.emailVerified
                        ? 'border-emerald-300/20 bg-emerald-500/10 text-emerald-100'
                        : 'border-amber-300/20 bg-amber-500/10 text-amber-100'
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      {initialUser.emailVerified ? (
                        <BadgeCheck size={16} />
                      ) : (
                        <CircleAlert size={16} />
                      )}
                      {initialUser.emailVerified
                        ? ui.auth.emailVerifiedBadge
                        : ui.auth.emailNotVerifiedBadge}
                    </span>
                  </div>

                  <Link
                    href={localizePath(locale, '/library')}
                    className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-primary/25 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-on-primary"
                  >
                    <LibraryBig size={16} />
                    {ui.profile.openLibrary}
                  </Link>

                  <form action="/auth/signout" method="post">
                    <input
                      type="hidden"
                      name="next"
                      value={localizePath(locale, '/login')}
                    />
                    <button
                      type="submit"
                      className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-stone-200 transition hover:bg-white/[0.06]"
                    >
                      {ui.auth.signOut}
                    </button>
                  </form>
                </div>

                {!initialUser.emailVerified && (
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <EmailVerificationPanel next={localizePath(locale, '/profile')} />
                  </div>
                )}
              </div>
            </aside>

            <section className="vault-frame rounded-[2rem] p-6 md:p-8 lg:p-10">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                  {ui.auth.account}
                </p>
                <h2 className="mt-4 font-[family-name:var(--font-headline)] text-4xl text-on-surface md:text-5xl">
                  {ui.profile.title}
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-stone-400 md:text-base">
                  {ui.profile.description}
                </p>
              </div>

              {feedback && (
                <div
                  className={cn(
                    'mt-8 rounded-[1.4rem] border px-4 py-4 text-sm',
                    feedback.tone === 'success'
                      ? 'border-primary/30 bg-primary/10 text-stone-100'
                      : 'border-error/35 bg-error/10 text-red-200'
                  )}
                >
                  {feedback.text}
                </div>
              )}

              <form onSubmit={handleSave} className="mt-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      {ui.profile.firstName}
                    </span>
                    <div className="relative locale-icon-field">
                      <UserCircle2
                        size={16}
                        className="locale-field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/70"
                      />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder={ui.profile.firstNamePlaceholder}
                        className="locale-icon-input w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      {ui.profile.lastName}
                    </span>
                    <div className="relative locale-icon-field">
                      <UserCircle2
                        size={16}
                        className="locale-field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/70"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder={ui.profile.lastNamePlaceholder}
                        className="locale-icon-input w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                      />
                    </div>
                  </label>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      {ui.profile.displayName}
                    </span>
                    <div className="relative locale-icon-field">
                      <UserCircle2
                        size={16}
                        className="locale-field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/70"
                      />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                        placeholder={ui.profile.displayNamePlaceholder}
                        className="locale-icon-input w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      {ui.profile.preferredLocale}
                    </span>
                    <div className="relative locale-icon-field">
                      <Globe2
                        size={16}
                        className="locale-field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/70"
                      />
                      <select
                        value={preferredLocale}
                        onChange={(event) =>
                          setPreferredLocale(
                            normalizeLocale(event.target.value, locale)
                          )
                        }
                        className="locale-icon-input w-full appearance-none rounded-[1.2rem] border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-base text-on-surface focus:border-primary/40 focus:outline-none"
                      >
                        {locales.map((item) => (
                          <option key={item} value={item} className="bg-surface text-on-surface">
                            {getLocaleLabel(item)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500">
                    {ui.profile.email}
                  </span>
                  <div className="relative locale-icon-field">
                    <Mail
                      size={16}
                      className="locale-field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/70"
                    />
                    <input
                      type="email"
                      value={initialUser.email ?? ''}
                      disabled
                      className="locale-icon-input w-full rounded-[1.2rem] border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-base text-stone-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500">
                    {ui.profile.bio}
                  </span>
                  <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder={ui.profile.bioPlaceholder}
                    rows={6}
                    className="w-full rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-base leading-relaxed text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                  />
                </label>

                <div className="flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm leading-relaxed text-stone-500">
                    {ui.profile.fileRequirements}
                  </p>

                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={16} />
                    {isSaving ? ui.profile.saving : ui.profile.save}
                  </button>
                </div>
              </form>

              <section className="mt-10 border-t border-white/10 pt-8">
                <div className="max-w-3xl">
                  <p className="text-[11px] uppercase tracking-[0.34em] text-secondary/80">
                    Knowledge profile
                  </p>
                  <h3 className="mt-4 font-[family-name:var(--font-headline)] text-4xl text-on-surface">
                    Your historical identity
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-stone-400 md:text-base">
                    A premium snapshot of what you save, compare, finish, and return to across the archive.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                  <div className="soft-panel rounded-[1.6rem] p-5">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      Saved dossiers
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-primary">
                      {knowledgeProfile.savedBooksCount}
                    </p>
                  </div>
                  <div className="soft-panel rounded-[1.6rem] p-5">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      Comparisons
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-primary">
                      {knowledgeProfile.comparisonsMade}
                    </p>
                  </div>
                  <div className="soft-panel rounded-[1.6rem] p-5">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      Shelves
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-primary">
                      {knowledgeProfile.collectionsCreated}
                    </p>
                  </div>
                  <div className="soft-panel rounded-[1.6rem] p-5">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      Completed paths
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-primary">
                      {knowledgeProfile.completedPaths}
                    </p>
                  </div>
                  <div className="soft-panel rounded-[1.6rem] p-5">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      Reading depth
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-primary">
                      {knowledgeProfile.readingMinutes}
                    </p>
                  </div>
                  <div className="soft-panel rounded-[1.6rem] p-5">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      Explorer streak
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-headline)] text-4xl text-primary">
                      {knowledgeProfile.streakDays}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-secondary/80">
                      Favorite eras
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {knowledgeProfile.favoriteEras.map((era) => (
                        <span
                          key={era}
                          className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-stone-300"
                        >
                          {era}
                        </span>
                      ))}
                    </div>

                    <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-secondary/80">
                      Favorite regions
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {knowledgeProfile.favoriteRegions.map((region) => (
                        <span
                          key={region}
                          className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-stone-300"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-secondary/80">
                      Historical quests
                    </p>
                    <div className="mt-4 space-y-4">
                      {knowledgeProfile.quests.map((quest) => (
                        <div key={quest.id} className="rounded-[1.3rem] border border-white/8 bg-black/20 p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium text-on-surface">{quest.title}</p>
                              <p className="mt-1 text-sm text-stone-400">{quest.description}</p>
                            </div>
                            <span className="text-sm text-primary">
                              {quest.progress}/{quest.target}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-secondary/80">
                    Era badges
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {knowledgeProfile.badges.map((badge) => (
                      <div key={badge.id} className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                        <p className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                          {badge.title}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-stone-400">
                          {badge.description}
                        </p>
                        <p className="mt-3 text-sm text-primary">
                          {badge.progress}/{badge.target}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {knowledgeProfile.continueExploring.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-secondary/80">
                      Continue exploring
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {knowledgeProfile.continueExploring.map((item) => (
                        <HistoricalVisualCard
                          key={`${item.type}-${item.href}`}
                          title={item.title}
                          summary={item.summary}
                          era={item.eyebrow}
                          category="path"
                          coverTheme={item.coverTheme}
                          href={item.href}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </section>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
