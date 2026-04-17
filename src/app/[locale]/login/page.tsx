import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/i18n/dictionaries';
import { getUiCopy } from '@/i18n/ui-copy';
import { localizePath } from '@/i18n/navigation';
import { Locale, isLocale } from '@/i18n/config';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { getCurrentAuthState } from '@/lib/researches/server';
import { signIn, signUp } from './actions';

function getSafeNext(next: string | undefined, locale: Locale) {
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    return next;
  }

  return localizePath(locale, '/library');
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    redirect(localizePath('en', '/login'));
  }

  const locale = rawLocale;
  const dictionary = getDictionary(locale);
  const ui = getUiCopy(locale);
  const query = await searchParams;
  const mode = query.mode === 'signup' ? 'signup' : 'signin';
  const next = getSafeNext(
    typeof query.next === 'string' ? query.next : undefined,
    locale
  );
  const error = typeof query.error === 'string' ? query.error : null;
  const success = typeof query.success === 'string' ? query.success : null;
  const { user } = await getCurrentAuthState();

  if (user) {
    redirect(next);
  }

  return (
    <>
      <Navbar />

      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <section className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1.08fr)_460px]">
          <div className="vault-frame rounded-[2.2rem] p-6 md:p-8 lg:p-10">
            <p className="text-[11px] uppercase tracking-[0.36em] text-primary/85">
              {ui.auth.signIn}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-headline)] text-4xl leading-tight text-on-surface md:text-6xl">
              {ui.auth.signInTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-stone-400 md:text-base">
              {mode === 'signup'
                ? ui.auth.signUpDescription
                : ui.auth.signInDescription}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="soft-panel rounded-[1.7rem] p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  {dictionary.libraryPage.dossiers}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  {ui.auth.helper}
                </p>
              </div>
              <div className="soft-panel rounded-[1.7rem] p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  {dictionary.nav.library}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  {ui.auth.continueToLibrary}
                </p>
              </div>
              <div className="soft-panel rounded-[1.7rem] p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  {dictionary.common.aiHistoryResearch}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  {dictionary.home.whyDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="soft-panel rounded-[2rem] p-6 md:p-7">
            <div className="flex gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
              <Link
                href={`${localizePath(locale, '/login')}?mode=signin&next=${encodeURIComponent(next)}`}
                className={`flex-1 rounded-full px-4 py-3 text-center text-sm transition ${
                  mode === 'signin'
                    ? 'bg-primary text-on-primary'
                    : 'text-stone-300 hover:bg-white/[0.04]'
                }`}
              >
                {ui.auth.signIn}
              </Link>
              <Link
                href={`${localizePath(locale, '/login')}?mode=signup&next=${encodeURIComponent(next)}`}
                className={`flex-1 rounded-full px-4 py-3 text-center text-sm transition ${
                  mode === 'signup'
                    ? 'bg-primary text-on-primary'
                    : 'text-stone-300 hover:bg-white/[0.04]'
                }`}
              >
                {ui.auth.createAccount}
              </Link>
            </div>

            {error && (
              <div className="mt-5 rounded-[1.4rem] border border-error/40 bg-error/10 px-4 py-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {success === 'confirm' && (
              <div className="mt-5 rounded-[1.4rem] border border-primary/30 bg-primary/10 px-4 py-4 text-sm text-stone-100">
                {ui.auth.signUpSuccess}
              </div>
            )}

            <form className="mt-6 space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="next" value={next} />

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500"
                >
                  {ui.auth.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500"
                >
                  {ui.auth.password}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                formAction={mode === 'signup' ? signUp : signIn}
                className="w-full rounded-[1.1rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
              >
                {mode === 'signup' ? ui.auth.submitSignUp : ui.auth.submitSignIn}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
