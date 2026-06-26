'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

// Form di login (solo demo). NESSUNA autenticazione reale: i pulsanti
// simulano un login andato a buon fine reindirizzando alla home post-login.
// AREA CRITICA: l'auth vera (Supabase) richiede review umana (CLAUDE.md).
export function LoginForm() {
  const t = useTranslations('Login');
  const tc = useTranslations('Common');
  const router = useRouter();

  // Simula login: porta alla home autenticata (resa pubblica in demo).
  const login = () => router.push('/dashboard/home');

  return (
    <>
      {/* Social login (demo) */}
      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={login}
          className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 font-semibold text-black"
        >
          <span className="font-condensed font-bold">G</span>
          {t('google')}
        </button>
        <button
          type="button"
          onClick={login}
          className="flex w-full items-center justify-center gap-2 rounded bg-black px-4 py-3 font-semibold text-white"
        >
          <span aria-hidden></span>
          {t('apple')}
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wide text-sandr-muted">{t('or')}</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      {/* Email + Password (visivi) */}
      <div className="space-y-3">
        <input
          type="email"
          placeholder={t('email')}
          className="w-full rounded border border-white/[0.08] bg-[#242424] px-4 py-3 text-sandr-text placeholder:text-sandr-muted focus:border-[#F04E00] focus:outline-none"
        />
        <input
          type="password"
          placeholder={t('password')}
          className="w-full rounded border border-white/[0.08] bg-[#242424] px-4 py-3 text-sandr-text placeholder:text-sandr-muted focus:border-[#F04E00] focus:outline-none"
        />
      </div>

      {/* CTA primaria (demo) */}
      <button
        type="button"
        onClick={login}
        className="mt-6 w-full rounded bg-[#F04E00] px-4 py-3 font-condensed font-bold uppercase tracking-wide text-black"
      >
        {tc('signIn')}
      </button>
    </>
  );
}
