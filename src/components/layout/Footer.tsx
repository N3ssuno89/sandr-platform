'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

// Footer: logo, griglia link, handle @sandr.tv, switcher lingua IT/EN,
// copyright 2026. Le colonne si impilano in verticale su mobile.
// L'age gate 18+ NON va mai rimosso (CLAUDE.md).
export function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const tc = useTranslations('Common');
  const pathname = usePathname();
  const locale = useLocale();

  const explore = [
    { href: '/live', label: tNav('live') },
    { href: '/vod', label: tNav('replay') },
    { href: '/#sports', label: tNav('sports') },
    { href: '/pricing', label: tNav('pricing') },
  ];

  // Link placeholder (pagine non ancora implementate): puntano a "#".
  const company = [t('about'), t('press'), t('contact')];
  const legal = [t('terms'), t('privacy'), t('ageGate')];

  return (
    <footer className="border-t border-white/10 bg-sandr-black">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Logo + tagline + handle */}
          <div>
            <Link href="/" className="inline-flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="SANDR"
                width={44}
                height={44}
                style={{ height: '44px', width: '44px', objectFit: 'contain' }}
              />
            </Link>
            <p className="mt-3 font-condensed uppercase tracking-wide text-sandr-muted">
              {tc('tagline')}
            </p>
            <p className="mt-4 text-sm text-sandr-muted">@sandr.tv</p>
          </div>

          {/* Esplora */}
          <div>
            <h3 className="font-condensed text-sm uppercase tracking-wide text-sandr-text">
              {t('exploreTitle')}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-sandr-muted">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sandr-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Azienda */}
          <div>
            <h3 className="font-condensed text-sm uppercase tracking-wide text-sandr-text">
              {t('companyTitle')}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-sandr-muted">
              {company.map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-sandr-text">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legale */}
          <div>
            <h3 className="font-condensed text-sm uppercase tracking-wide text-sandr-text">
              {t('legalTitle')}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-sandr-muted">
              {legal.map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-sandr-text">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Barra inferiore: switcher lingua + copyright */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-condensed uppercase tracking-wide">
            <Link
              href={pathname}
              locale="it"
              className={locale === 'it' ? 'text-sandr-orange' : 'text-sandr-muted hover:text-sandr-text'}
            >
              IT
            </Link>
            <span className="text-sandr-muted">/</span>
            <Link
              href={pathname}
              locale="en"
              className={locale === 'en' ? 'text-sandr-orange' : 'text-sandr-muted hover:text-sandr-text'}
            >
              EN
            </Link>
          </div>
          <p className="text-xs text-sandr-muted">© 2026 SANDR. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
