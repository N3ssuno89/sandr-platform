import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

// Landing page pubblica.
export default function LandingPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations('Landing');

  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <h1 className="max-w-3xl text-5xl uppercase text-sandr-text md:text-7xl">
        {t('title')}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-sandr-muted">{t('subtitle')}</p>
      <Link
        href="/live"
        className="mt-10 inline-block rounded bg-sandr-orange px-6 py-3 font-condensed font-semibold uppercase text-sandr-text"
      >
        {t('cta')}
      </Link>
    </section>
  );
}
