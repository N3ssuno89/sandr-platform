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

    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === 'signup') {
        // signUp con conferma email: redirect alla callback locale-aware.
        // La riga in `profiles` è creata dal trigger DB handle_new_user()
        // (nessuna creazione duplicata lato app).
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email')}
          autoComplete="email"
          className={inputCls}
        />
        {/* Password con toggle mostra/nascondi (testuale, no emoji). */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password')}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            className={`${inputCls} pr-24`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? t('hide') : t('show')}
            className="absolute right-3 top-1/2 -translate-y-1/2 font-condensed text-[11px] uppercase tracking-wide text-[#888888] hover:text-white"
          >
            {showPassword ? t('hide') : t('show')}
          </button>
        </div>

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
