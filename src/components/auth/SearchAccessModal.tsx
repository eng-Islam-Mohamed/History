'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { MailCheck, ShieldCheck } from 'lucide-react';
import EmailVerificationPanel from '@/components/auth/EmailVerificationPanel';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getUiCopy } from '@/i18n/ui-copy';
import { localizePath } from '@/i18n/navigation';

interface SearchAccessModalProps {
  mode: 'guest' | 'unverified' | null;
  next: string;
  onClose: () => void;
}

export default function SearchAccessModal({
  mode,
  next,
  onClose,
}: SearchAccessModalProps) {
  const { locale } = useI18n();
  const ui = getUiCopy(locale);
  const isOpen = Boolean(mode);
  const loginHref = `${localizePath(locale, '/login')}?mode=signin&next=${encodeURIComponent(next)}`;
  const signUpHref = `${localizePath(locale, '/login')}?mode=signup&next=${encodeURIComponent(next)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            aria-label={ui.auth.closeDialog}
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 z-[80] mx-auto w-full max-w-xl -translate-y-1/2"
            role="dialog"
            aria-modal="true"
          >
            <div className="vault-frame rounded-[2rem] p-6 md:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  {mode === 'guest' ? <ShieldCheck size={22} /> : <MailCheck size={22} />}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-primary/80">
                    {mode === 'guest' ? ui.search.authGateEyebrow : ui.search.verifyGateEyebrow}
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-headline)] text-3xl text-on-surface md:text-4xl">
                    {mode === 'guest'
                      ? ui.search.authGateTitle
                      : ui.search.verifyGateTitle}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-stone-400">
                    {mode === 'guest'
                      ? ui.search.authGateBody
                      : ui.search.verifyGateBody}
                  </p>
                </div>
              </div>

              {mode === 'guest' ? (
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Link
                    href={signUpHref}
                    className="inline-flex items-center justify-center rounded-[1.2rem] bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
                  >
                    {ui.auth.createAccount}
                  </Link>
                  <Link
                    href={loginHref}
                    className="inline-flex items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-stone-200 transition hover:bg-white/[0.06]"
                  >
                    {ui.auth.signIn}
                  </Link>
                </div>
              ) : (
                <div className="mt-8">
                  <EmailVerificationPanel next={next} compact />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
