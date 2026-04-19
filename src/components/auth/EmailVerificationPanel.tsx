'use client';

import { useState } from 'react';
import { LoaderCircle, MailCheck } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { getUiCopy } from '@/i18n/ui-copy';
import { localizePath } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type FeedbackState =
  | { tone: 'success' | 'error'; text: string }
  | null;

interface EmailVerificationPanelProps {
  next?: string;
  compact?: boolean;
  showSignOut?: boolean;
  className?: string;
}

export default function EmailVerificationPanel({
  next = '/library',
  compact = false,
  showSignOut = true,
  className,
}: EmailVerificationPanelProps) {
  const { locale } = useI18n();
  const ui = getUiCopy(locale);
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  async function handleResend() {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ next }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; email?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || ui.auth.resendVerificationError);
      }

      setFeedback({
        tone: 'success',
        text: payload?.email
          ? ui.auth.resendVerificationSuccess.replace('{email}', payload.email)
          : ui.auth.resendVerificationSuccessFallback,
      });
    } catch (error) {
      setFeedback({
        tone: 'error',
        text:
          error instanceof Error && error.message
            ? error.message
            : ui.auth.resendVerificationError,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'rounded-[1.4rem] border border-amber-300/20 bg-amber-500/8 p-4 text-sm text-stone-200',
          compact && 'p-3 text-xs'
        )}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-400/14 text-amber-200">
            <MailCheck size={16} />
          </span>
          <div className="space-y-2">
            <p className={cn('font-medium text-on-surface', compact && 'text-sm')}>
              {ui.auth.verifyEmailRequired}
            </p>
            <p className="leading-relaxed text-stone-300">
              {ui.auth.verifyEmailDescription}
            </p>
            {user?.email && (
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={cn(
            'rounded-[1.2rem] border px-4 py-3 text-sm',
            feedback.tone === 'success'
              ? 'border-primary/30 bg-primary/10 text-stone-100'
              : 'border-error/35 bg-error/10 text-red-200'
          )}
        >
          {feedback.text}
        </div>
      )}

      <div className={cn('flex flex-col gap-3 sm:flex-row', compact && 'sm:flex-col')}>
        <button
          type="button"
          onClick={handleResend}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <LoaderCircle size={16} className="animate-spin" />}
          {isSubmitting ? ui.auth.resendingVerification : ui.auth.resendVerification}
        </button>

        <a
          href={localizePath(locale, '/profile')}
          className="inline-flex items-center justify-center rounded-[1.1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone-200 transition hover:bg-white/[0.06]"
        >
          {ui.auth.openProfile}
        </a>

        {showSignOut && (
          <form action="/auth/signout" method="post" className="contents">
            <input type="hidden" name="next" value={localizePath(locale, '/login')} />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-[1.1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone-200 transition hover:bg-white/[0.06]"
            >
              {ui.auth.signOut}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
