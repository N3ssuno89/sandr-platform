'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

// Form di autenticazione reale (Supabase Auth: email/password con conferma
// email). AREA CRITICA (CLAUDE.md): Supabase Auth richiede review umana.
// La conferma email è OBBLIGATORIA: il login fallisce finché l'utente non
// conferma (errore "Email not confirmed" gestito sotto).
type Mode = 'login' | 'signup';

const inputCls =
  'w-full rounded border border-white/[0.08] bg-[#242424] px-4 py-3 text-sandr-text placeholder:text-sandr-muted focus:border-[#F04E00] focus:outline-none';

export function AuthForm() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'auth' ? t('errCallback') : null,
  );
  const [confirmSent, setConfirmSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Consensi (signup). Privacy+Termini OBBLIGATORI; gli altri opzionali.
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentProfiling, setConsentProfiling] = useState(false);
  const [consentThirdParty, setConsentThirdParty] = useState(false);

  // Mappa i messaggi di errore Supabase su copy in italiano/inglese.
  function mapError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('invalid login credentials')) return t('errInvalid');
    if (m.includes('email not confirmed')) return t('errNotConfirmed');
    return t('errGeneric');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(t('notConfigured'));
      return;
    }

    // Consenso obbligatorio Privacy + Termini: blocca la registrazione.
    if (mode === 'signup' && !acceptTerms) {
      setError(t('consentRequiredError'));
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === 'signup') {
        // signUp con conferma email: redirect alla callback locale-aware.
        // La riga in `profiles` è creata dal trigger DB handle_new_user(), che
        // persiste anche i consensi passati qui nei metadata (+ timestamp).
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              consent_privacy: acceptTerms,
              terms_accepted: acceptTerms,
              consent_marketing: consentMarketing,
              consent_profiling: consentProfiling,
              consent_third_party: consentThirdParty,
            },
            emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
          },
        });
        if (signUpError) {
          setError(mapError(signUpError.message));
        } else {
          setConfirmSent(true);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(mapError(signInError.message));
        } else {
          // Sessione impostata: vai alla home autenticata (refresh per far
          // leggere i cookie al middleware/server).
          router.push('/dashboard/home');
          router.refresh();
          return;
        }
      }
    } catch {
      setError(t('errGeneric'));
    } finally {
      setLoading(false);
    }
  }

  // Dopo la registrazione: messaggio di conferma email.
  if (confirmSent) {
    return (
      <div className="mt-8 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
        <p className="text-sm font-semibold text-emerald-300">{t('confirmSent')}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Toggle Accedi / Registrati */}
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-white/[0.08] bg-[#242424] p-1">
        {(['login', 'signup'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-md py-2 font-condensed text-sm font-bold uppercase tracking-wide transition ${
              mode === m ? 'bg-sandr-orange text-black' : 'text-sandr-muted hover:text-white'
            }`}
          >
            {m === 'login' ? t('loginTab') : t('signupTab')}
          </button>
        ))}
      </div>

      {/* Social (placeholder, disabilitati) */}
      <div className="space-y-3">
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded bg-white/80 px-4 py-3 font-semibold text-black opacity-60"
        >
          <span className="font-condensed font-bold">G</span>
          {t('google')}
          <span className="ml-1 text-[11px] font-normal uppercase tracking-wide text-black/50">
            · {t('comingSoon')}
          </span>
        </button>
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded bg-black/80 px-4 py-3 font-semibold text-white opacity-60"
        >
          {t('apple')}
          <span className="ml-1 text-[11px] font-normal uppercase tracking-wide text-white/50">
            · {t('comingSoon')}
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wide text-sandr-muted">{t('or')}</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' ? (
          <input
            type="text"
            required
            name="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t('fullName')}
            autoComplete="name"
            className={inputCls}
          />
        ) : null}
        <input
          type="email"
          required
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email')}
          autoComplete="email"
          className={inputCls}
        />
        {/* Password con toggle mostra/nascondi (icona occhio, no testo). */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password')}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            className={`${inputCls} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] transition-colors hover:text-[#F04E00]"
          >
            <EyeIcon open={!showPassword} />
          </button>
        </div>

        {/* Consensi (solo registrazione) */}
        {mode === 'signup' ? (
          <div className="space-y-2.5 pt-1">
            <ConsentCheckbox checked={acceptTerms} onChange={setAcceptTerms}>
              {t.rich('consentRequired', {
                privacy: (chunks) => (
                  <a href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer" className="text-[#F04E00] hover:underline">
                    {chunks}
                  </a>
                ),
                terms: (chunks) => (
                  <a href={`/${locale}/terms`} target="_blank" rel="noopener noreferrer" className="text-[#F04E00] hover:underline">
                    {chunks}
                  </a>
                ),
              })}
            </ConsentCheckbox>
            <ConsentCheckbox checked={consentMarketing} onChange={setConsentMarketing}>
              {t('consentMarketing')}
            </ConsentCheckbox>
            <ConsentCheckbox checked={consentProfiling} onChange={setConsentProfiling}>
              {t('consentProfiling')}
            </ConsentCheckbox>
            <ConsentCheckbox checked={consentThirdParty} onChange={setConsentThirdParty}>
              {t('consentThirdParty')}
            </ConsentCheckbox>
          </div>
        ) : null}

        {error ? (
          <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full rounded bg-[#F04E00] px-4 py-3 font-condensed font-bold uppercase tracking-wide text-black disabled:opacity-60"
        >
          {loading
            ? mode === 'signup'
              ? t('signupLoading')
              : t('loginLoading')
            : mode === 'signup'
              ? t('signupCta')
              : t('loginCta')}
        </button>
      </form>
    </div>
  );
}

// Checkbox di consenso: piccola, label Barlow 400 12px #C0BDB8 (link arancioni).
function ConsentCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#F04E00]"
      />
      <span className="font-condensed text-[12px] font-normal leading-snug text-[#C0BDB8]">
        {children}
      </span>
    </label>
  );
}

// Icona occhio inline (18px, stroke ereditato dal colore del bottone).
// open = true: occhio aperto (password nascosta, click per mostrare).
// open = false: occhio sbarrato (password visibile, click per nascondere).
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
