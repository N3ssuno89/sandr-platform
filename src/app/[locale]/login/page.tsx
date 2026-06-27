import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AuthForm } from '@/components/auth/AuthForm';

// Pagina di login. AREA CRITICA (CLAUDE.md): Supabase Auth richiede review
// umana obbligatoria. L'autenticazione reale (email/password con conferma
// email) vive nel client component AuthForm.
export default function LoginPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Login');
  const tc = useTranslations('Common');

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#141414] px-4 py-12">
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

        {/* Form (client): Supabase Auth reale (login/registrazione).
            Suspense richiesto da useSearchParams nella pagina statica. */}
        <Suspense>
          <AuthForm />
        </Suspense>

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
