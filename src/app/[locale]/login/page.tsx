import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/i18n/dictionaries';
import { getUiCopy } from '@/i18n/ui-copy';
import { localizePath } from '@/i18n/navigation';
import { Locale, isLocale } from '@/i18n/config';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import EmailVerificationPanel from '@/components/auth/EmailVerificationPanel';
import { getCurrentAuthState } from '@/lib/researches/server';
import { resendVerificationCode, signIn, signUp, verifyEmailCode } from './actions';

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
  const message = typeof query.message === 'string' ? query.message : null;
  const success = typeof query.success === 'string' ? query.success : null;
  const verified = typeof query.verified === 'string' ? query.verified : null;
  const pendingEmail = typeof query.email === 'string' ? query.email : '';
  const { user } = await getCurrentAuthState();
  const isLoggedInButUnverified = Boolean(user && !user.emailVerified);
  const isPendingCodeVerification = success === 'verify-code' && Boolean(pendingEmail);

  if (user?.emailVerified) {
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

            {message && (
              <div className="mt-5 rounded-[1.4rem] border border-primary/30 bg-primary/10 px-4 py-4 text-sm text-stone-100">
                {message}
              </div>
            )}

            {verified === 'success' && (
              <div className="mt-5 rounded-[1.4rem] border border-primary/30 bg-primary/10 px-4 py-4 text-sm text-stone-100">
                {ui.auth.emailVerifiedSuccess}
              </div>
            )}

            {verified === 'error' && (
              <div className="mt-5 rounded-[1.4rem] border border-error/40 bg-error/10 px-4 py-4 text-sm text-red-200">
                {ui.auth.emailVerificationFailed}
              </div>
            )}

            {isLoggedInButUnverified ? (
              <div className="mt-6">
                <EmailVerificationPanel next={next} />
              </div>
            ) : isPendingCodeVerification ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
                    {ui.auth.verificationCode}
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                    {ui.auth.verifyCodeTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-stone-300">
                    {ui.auth.verifyCodeDescription}
                  </p>
                  <p className="mt-4 rounded-[1.1rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-200">
                    {pendingEmail}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-stone-400">
                    {ui.auth.verifyCodeHelp}
                  </p>
                </div>

                <form className="space-y-4">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="next" value={next} />
                  <input type="hidden" name="email" value={pendingEmail} />

                  <div>
                    <label
                      htmlFor="code"
                      className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500"
                    >
                      {ui.auth.verificationCode}
                    </label>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                      placeholder={ui.auth.verificationCodePlaceholder}
                    />
                  </div>

                  <button
                    formAction={verifyEmailCode}
                    className="w-full rounded-[1.1rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
                  >
                    {ui.auth.verifyCodeAction}
                  </button>
                </form>

                <form>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="next" value={next} />
                  <input type="hidden" name="email" value={pendingEmail} />
                  <button
                    formAction={resendVerificationCode}
                    className="w-full rounded-[1.1rem] border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-stone-200 transition hover:border-primary/30 hover:text-primary"
                  >
                    {ui.auth.resendCode}
                  </button>
                </form>
              </div>
            ) : (
              <form className="mt-6 space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="next" value={next} />

                {mode === 'signup' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500"
                      >
                        {ui.auth.firstName}
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                        placeholder={ui.auth.firstNamePlaceholder}
                        autoComplete="given-name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone-500"
                      >
                        {ui.auth.lastName}
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                        placeholder={ui.auth.lastNamePlaceholder}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                )}

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
                    autoComplete="email"
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
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-on-surface placeholder:text-stone-500 focus:border-primary/40 focus:outline-none"
                    placeholder="********"
                  />
                </div>

                <button
                  formAction={mode === 'signup' ? signUp : signIn}
                  className="w-full rounded-[1.1rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
                >
                  {mode === 'signup' ? ui.auth.submitSignUp : ui.auth.submitSignIn}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

