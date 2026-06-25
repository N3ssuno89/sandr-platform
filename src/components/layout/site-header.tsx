import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

// Header di navigazione principale. Placeholder: nessuna logica di auth qui.
export function SiteHeader() {
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');

  return (
    <header className="border-b border-white/10 bg-sandr-black">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-xl text-sandr-text">
          {tc('appName')}
        </Link>

        <nav className="hidden items-center gap-6 font-condensed text-sandr-muted md:flex">
          <Link href="/live" className="hover:text-sandr-text">
            {t('live')}
          </Link>
          <Link href="/vod" className="hover:text-sandr-text">
            {t('vod')}
          </Link>
          <Link href="/interviews" className="hover:text-sandr-text">
            {t('interviews')}
          </Link>
          <Link href="/pricing" className="hover:text-sandr-text">
            {t('pricing')}
          </Link>
        </nav>

        <Link
          href="/pricing"
          className="rounded bg-sandr-orange px-4 py-2 font-condensed font-semibold text-sandr-text"
        >
          {tc('signIn')}
        </Link>
      </div>
    </header>
  );
}
