'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Search, Sparkles, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getLocaleLabel, Locale, locales } from '@/i18n/config';
import { localizePath, replacePathLocale, stripLocaleFromPath } from '@/i18n/navigation';
import { getUiCopy } from '@/i18n/ui-copy';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dictionary, locale } = useI18n();
  const { hasSupabase, user } = useAuth();
  const ui = getUiCopy(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { href: '/', label: dictionary.nav.home },
    { href: '/search', label: dictionary.nav.search },
    { href: '/library', label: dictionary.nav.library },
  ];

  const closeOverlays = () => {
    setSearchOpen(false);
    setMobileOpen(false);
    setLanguageOpen(false);
  };

  const localizedCurrentPath = replacePathLocale(pathname, locale);
  const basePath = stripLocaleFromPath(pathname);
  const currentPathWithQuery = searchParams.toString()
    ? `${localizedCurrentPath}?${searchParams.toString()}`
    : localizedCurrentPath;
  const loginHref = `${localizePath(locale, '/login')}?next=${encodeURIComponent(currentPathWithQuery)}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const nextQuery = searchQuery.trim();
    if (!nextQuery) return;

    router.push(
      `${localizePath(locale, '/search')}?q=${encodeURIComponent(nextQuery)}`
    );
    setSearchQuery('');
    closeOverlays();
  };

  const selectPrompt = (prompt: string) => {
    router.push(`${localizePath(locale, '/search')}?q=${encodeURIComponent(prompt)}`);
    setSearchQuery('');
    closeOverlays();
  };

  const switchLocale = (nextLocale: Locale) => {
    const nextPath = replacePathLocale(pathname, nextLocale);
    const query = searchParams.toString();
    router.push(query ? `${nextPath}?${query}` : nextPath);
    closeOverlays();
  };

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-black/45 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl md:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href={localizePath(locale)}
              className="shrink-0 font-[family-name:var(--font-headline)] text-2xl font-semibold tracking-[0.08em] text-primary transition-colors hover:text-primary-fixed"
            >
              {dictionary.common.brand}
            </Link>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-stone-400 lg:flex">
              <Sparkles size={12} className="text-primary" />
              {dictionary.common.aiHistoryResearch}
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const localizedHref = localizePath(locale, link.href);
              const isActive =
                link.href === '/'
                  ? basePath === '/'
                  : localizedCurrentPath.startsWith(localizedHref);

              return (
                <Link
                  key={link.label}
                  href={localizedHref}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/14 text-primary'
                      : 'text-stone-300 hover:bg-white/5 hover:text-on-surface'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setLanguageOpen((current) => !current);
                  setSearchOpen(false);
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-200 transition hover:border-primary/30 hover:text-primary"
                aria-label={dictionary.common.language}
              >
                <span>{getLocaleLabel(locale)}</span>
                <ChevronDown size={14} />
              </button>

              <AnimatePresence>
                {languageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute end-0 top-12 z-50 w-40 rounded-2xl border border-white/10 bg-black/80 p-2 backdrop-blur-xl"
                  >
                    {locales.map((item) => (
                      <button
                        key={item}
                        onClick={() => switchLocale(item)}
                        className={cn(
                          'block w-full rounded-xl px-3 py-2 text-left text-sm transition',
                          item === locale
                            ? 'bg-primary/14 text-primary'
                            : 'text-stone-200 hover:bg-white/5'
                        )}
                      >
                        {getLocaleLabel(item)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                setSearchOpen((current) => !current);
                setMobileOpen(false);
                setLanguageOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-200 transition-colors hover:border-primary/30 hover:text-primary"
              aria-label="Toggle search"
            >
              <Search size={18} />
            </button>

            <Link
              href={localizePath(locale, '/search')}
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:brightness-110 md:inline-flex"
            >
              {dictionary.nav.startResearch}
            </Link>

            {hasSupabase && user ? (
              <div className="hidden items-center gap-2 md:flex">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-200">
                  {user.email || ui.auth.account}
                </span>
                <form action="/auth/signout" method="post">
                  <input
                    type="hidden"
                    name="next"
                    value={localizePath(locale, '/login')}
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-200 transition hover:border-primary/30 hover:text-primary"
                  >
                    {ui.auth.signOut}
                  </button>
                </form>
              </div>
            ) : hasSupabase ? (
              <Link
                href={loginHref}
                className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-200 transition hover:border-primary/30 hover:text-primary md:inline-flex"
              >
                {ui.auth.signIn}
              </Link>
            ) : null}

            <button
              onClick={() => {
                setMobileOpen((current) => !current);
                setSearchOpen(false);
                setLanguageOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-200 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-24 z-50 px-4 md:px-6"
          >
            <div className="mx-auto max-w-4xl vault-frame rounded-[2rem] p-6 md:p-8">
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-[11px] uppercase tracking-[0.34em] text-primary/80">
                  {dictionary.nav.directSearch}
                </p>
                <h3 className="font-[family-name:var(--font-headline)] text-3xl text-on-surface">
                  {dictionary.nav.searchArchive}
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-stone-400">
                  {dictionary.nav.searchArchiveDescription}
                </p>
              </div>

              <form onSubmit={handleSearch}>
                <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-3 md:flex-row md:items-center">
                  <div className="flex items-center gap-3 rounded-[1.15rem] px-3 py-2 text-stone-300">
                    <Search size={18} className="text-primary/70" />
                    <span className="hidden text-[11px] uppercase tracking-[0.28em] text-stone-500 md:inline">
                      {dictionary.common.query}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={dictionary.nav.searchPlaceholder}
                    className="w-full bg-transparent px-2 text-base text-on-surface placeholder:text-stone-500 focus:outline-none"
                    autoFocus
                  />

                  <button
                    type="submit"
                    className="rounded-[1rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
                  >
                    {dictionary.common.search}
                  </button>
                </div>
              </form>

              <div className="mt-5 flex flex-wrap gap-3">
                {dictionary.nav.prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => selectPrompt(prompt)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-stone-300 transition hover:border-primary/25 hover:text-primary"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-x-0 top-24 z-50 px-4 md:hidden"
          >
            <div className="mx-auto max-w-7xl vault-frame rounded-[2rem] p-5">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const localizedHref = localizePath(locale, link.href);
                  const isActive =
                    link.href === '/'
                      ? basePath === '/'
                      : localizedCurrentPath.startsWith(localizedHref);

                  return (
                    <Link
                      key={link.label}
                      href={localizedHref}
                      onClick={closeOverlays}
                      className={cn(
                        'rounded-2xl px-4 py-3 text-base transition-colors',
                        isActive
                          ? 'bg-primary/12 text-primary'
                          : 'text-stone-200 hover:bg-white/5'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="mt-2 border-t border-white/10 pt-3">
                  <p className="mb-2 px-4 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                    {dictionary.common.language}
                  </p>
                  {locales.map((item) => (
                    <button
                      key={item}
                      onClick={() => switchLocale(item)}
                      className={cn(
                        'block w-full rounded-2xl px-4 py-3 text-left text-base transition-colors',
                        item === locale
                          ? 'bg-primary/12 text-primary'
                          : 'text-stone-200 hover:bg-white/5'
                      )}
                    >
                      {getLocaleLabel(item)}
                    </button>
                  ))}
                </div>

                {hasSupabase && user ? (
                  <div className="mt-2 border-t border-white/10 pt-3">
                    <p className="mb-2 px-4 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                      {ui.auth.account}
                    </p>
                    <p className="px-4 py-2 text-sm text-stone-300">
                      {user.email || ui.auth.account}
                    </p>
                    <form action="/auth/signout" method="post" className="mt-2 px-2">
                      <input
                        type="hidden"
                        name="next"
                        value={localizePath(locale, '/login')}
                      />
                      <button
                        type="submit"
                        className="block w-full rounded-2xl px-4 py-3 text-left text-base text-stone-200 transition-colors hover:bg-white/5"
                      >
                        {ui.auth.signOut}
                      </button>
                    </form>
                  </div>
                ) : hasSupabase ? (
                  <div className="mt-2 border-t border-white/10 pt-3">
                    <Link
                      href={loginHref}
                      onClick={closeOverlays}
                      className="block rounded-2xl px-4 py-3 text-base text-stone-200 transition-colors hover:bg-white/5"
                    >
                      {ui.auth.signIn}
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(searchOpen || mobileOpen || languageOpen) && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOverlays}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-label={dictionary.common.closeOverlays}
          />
        )}
      </AnimatePresence>
    </>
  );
}
