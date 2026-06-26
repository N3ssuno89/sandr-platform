import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

// Pagina di login (solo presentazionale). AREA CRITICA: Supabase Auth richiede
// review umana obbligatoria (CLAUDE.md). Nessuna logica di autenticazione:
// pulsanti e input sono puramente visivi, senza handler onSubmit.
export default function LoginPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Login');
  const tc = useTranslations('Common');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#141414] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#1C1C1C] p-10">
        {/* Logo */}
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="SANDR"
            width={64}
            height={64}
            style={{ height: '64px', width: '64px', objectFit: 'contain' }}
          />
        </div>

        <h1 className="mt-6 text-center font-condensed font-extrabold uppercase text-sandr-text" style={{ fontSize: '32px' }}>
          {t('headline')}
        </h1>
        <p className="mt-2 text-center text-sm text-[#C0BDB8]">{t('subline')}</p>

        {/* Social login (visivi) */}
        <div className="mt-8 space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 font-semibold text-black"
          >
            <span className="font-condensed font-bold">G</span>
            {t('google')}
          </button>
          <button
            type="button"
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

        {/* CTA primaria */}
        <button
          type="button"
          className="mt-6 w-full rounded bg-[#F04E00] px-4 py-3 font-condensed font-bold uppercase tracking-wide text-black"
        >
          {tc('signIn')}
        </button>

        {/* Link agli abbonamenti */}
        <p className="mt-6 text-center text-sm text-sandr-muted">
          {t('noAccount')}{' '}
          <Link href="/pricing" className="text-[#F04E00] hover:text-sandr-text">
            {tc('subscribe')}
          </Link>
        </p>
      </div>
    </div>
  );
}
