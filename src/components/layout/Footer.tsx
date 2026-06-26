'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

// Footer minimale. L'age gate 18+ NON va mai rimosso (CLAUDE.md): resta un
// piccolo indicatore accanto al copyright.
export function Footer() {
  const tc = useTranslations('Common');
  const tf = useTranslations('Footer');
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <footer className="border-t border-white/[0.06] bg-[#141414] px-8 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        {/* Blocco sinistro */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="SANDR"
            width={48}
            height={48}
            style={{ height: '48px', width: '48px', objectFit: 'contain' }}
          />
          <p className="mt-2 text-[13px] text-[#888888]">{tc('tagline')}</p>
          <p className="text-[12px] text-[#888888]">@sandr.tv</p>
        </div>

        {/* Blocco destro */}
        <div className="flex items-center gap-6">
          {/* Switcher lingua IT / EN */}
          <div className="flex items-center gap-2 font-condensed text-[12px] font-bold uppercase">
            <Link
              href={pathname}
              locale="it"
              className={locale === 'it' ? 'text-sandr-orange' : 'text-[#888888] hover:text-sandr-text'}
            >
              IT
            </Link>
            <span className="text-[#888888]">/</span>
            <Link
              href={pathname}
              locale="en"
              className={locale === 'en' ? 'text-sandr-orange' : 'text-[#888888] hover:text-sandr-text'}
            >
              EN
            </Link>
          </div>

          {/* Copyright + age gate 18+ (minimo, non rimuovibile) */}
          <p className="flex items-center gap-2 text-[11px] text-[#888888]">
            <span>© 2026 SANDR. {tf('rights')}</span>
            <span className="rounded border border-white/15 px-1 text-[10px]">18+</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
