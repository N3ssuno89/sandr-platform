'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { faceMeta, type Face } from '@/config/faces';
import { FaceSwitcher } from './FaceSwitcher';
import { OpenBadge } from './OpenBadge';

// Guscio di un volto (PRO/OPEN): applica tema (data-face + --face-accent + sfondo),
// intestazione con menu, badge OPEN e selettore PRO/OPEN. Avvolge le pagine del
// volto (che arriveranno dopo). I dati delle pagine verranno letti SOLO da
// @/lib/data.
export function FaceShell({ face, children }: { face: Face; children: ReactNode }) {
  const t = useTranslations('Nav');
  const meta = faceMeta[face];

  const nav = [
    { href: meta.home, label: t('home') },
    { href: '/live', label: t('live') },
    { href: '/vod', label: t('replay') },
    { href: '/pricing', label: t('pricing') },
  ];

  // Classi dipendenti dal tema (chiaro per OPEN, scuro per PRO).
  const borderCls = meta.light ? 'border-black/10' : 'border-white/10';
  const mutedCls = meta.light
    ? 'text-black/60 hover:text-black'
    : 'text-sandr-muted hover:text-white';

  return (
    <div
      data-face={face}
      style={{ backgroundColor: meta.bg, color: meta.fg, ['--face-accent']: meta.accent } as React.CSSProperties}
      className="min-h-screen"
    >
      <header className={`flex items-center gap-4 border-b px-4 py-3 ${borderCls}`}>
        <Link href={meta.home} className="font-condensed text-lg font-black uppercase tracking-wide text-current">
          SANDR
        </Link>
        {face === 'open' ? <OpenBadge /> : null}

        <nav className="ml-4 hidden gap-4 md:flex">
          {nav.map((n) => (
            <Link
              key={`${n.href}-${n.label}`}
              href={n.href}
              className={`font-condensed text-sm font-bold uppercase tracking-wide ${mutedCls}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto">
          <FaceSwitcher current={face} />
        </div>
      </header>

      {children}
    </div>
  );
}
