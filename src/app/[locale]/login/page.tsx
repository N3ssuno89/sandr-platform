import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LoginForm } from '@/components/sections/LoginForm';

// Pagina di login (solo presentazionale / demo). AREA CRITICA: Supabase Auth
// richiede review umana obbligatoria (CLAUDE.md). L'interazione (redirect
// simulato) vive nel client component LoginForm.
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

        {/* Form (client): social, input, CTA — redirect demo */}
        <LoginForm />

        {/* Nota demo */}
        <p className="mt-4 text-center text-xs text-sandr-muted">{t('demoNote')}</p>

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
