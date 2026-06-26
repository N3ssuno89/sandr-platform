import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

// Placeholder (demo): la Navbar variante dashboard arriva dal layout.
export default function SettingsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Account');

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-[#141414] px-4 text-center">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white md:text-4xl">
        {t('settings')}
      </h1>
      <p className="mt-3 text-sandr-muted">{t('comingSoon')}</p>
    </div>
  );
}
