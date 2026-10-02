'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { faceMeta, type Face } from '@/config/faces';

// Footer coerente con il volto: scuro in PRO, chiaro in OPEN. Usa i token del
// volto (ereditati via variabili CSS dal contenitore della chrome).
export function SiteFooter({ face }: { face: Face }) {
  const tc = useTranslations('Common');
  const tf = useTranslations('Footer');
  const pathname = usePathname();
  const locale = useLocale();
  const meta = faceMeta[face];

  return (
    <footer
      className="border-t"
      style={{ backgroundColor: meta.surface, borderColor: 'var(--face-header-border)' }}
    >
      <div className="mx-auto flex max-w-[1360px] flex-col gap-6 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-10">
        {/* Blocco sinistro */}
        <div>
          <span className="font-display text-xl uppercase tracking-tight text-[color:var(--face-fg)]">
            SANDR
          </span>
          <p className="mt-2 font-barlow text-[13px] text-[color:var(--face-muted)]">{tc('tagline')}</p>
          <p className="font-barlow text-[12px] text-[color:var(--face-muted)]">@sandr.tv</p>

          {/* Link legali */}
          <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-barlow text-[12px]">
            <Link href="/privacy" className="text-[color:var(--face-muted)] hover:text-[color:var(--face-link)]">
              {tf('privacy')}
            </Link>
            <Link href="/terms" className="text-[color:var(--face-muted)] hover:text-[color:var(--face-link)]">
              {tf('terms')}
            </Link>
            <Link href="/cookie-policy" className="text-[color:var(--face-muted)] hover:text-[color:var(--face-link)]">
              {tf('cookie')}
            </Link>
          </nav>
        </div>

        {/* Blocco destro */}
        <div className="flex items-center gap-6">
          {/* Switcher lingua IT / EN */}
          <div className="flex items-center gap-2 font-barlow text-[12px] font-bold uppercase">
            <Link
              href={pathname}
              locale="it"
              className={locale === 'it' ? 'text-[color:var(--face-accent)]' : 'text-[color:var(--face-muted)] hover:text-[color:var(--face-fg)]'}
            >
              IT
            </Link>
            <span className="text-[color:var(--face-muted)]">/</span>
            <Link
              href={pathname}
              locale="en"
              className={locale === 'en' ? 'text-[color:var(--face-accent)]' : 'text-[color:var(--face-muted)] hover:text-[color:var(--face-fg)]'}
            >
              EN
            </Link>
          </div>

          {/* Copyright */}
          <p className="font-barlow text-[11px] text-[color:var(--face-muted)]">
            © 2026 SANDR. {tf('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
