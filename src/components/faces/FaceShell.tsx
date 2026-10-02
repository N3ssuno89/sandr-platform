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

  return (
    <div
      data-face={face}
      style={{ backgroundColor: meta.bg, ['--face-accent']: meta.accent } as React.CSSProperties}
      className="min-h-screen"
    >
      <header className="flex items-center gap-4 border-b border-white/[0.08] px-4 py-3">
        <Link href={meta.home} className="font-condensed text-lg font-black uppercase tracking-wide text-white">
          SANDR
        </Link>
        {face === 'open' ? <OpenBadge /> : null}

        <nav className="ml-4 hidden gap-4 md:flex">
          {nav.map((n) => (
            <Link
              key={`${n.href}-${n.label}`}
              href={n.href}
              className="font-condensed text-sm font-bold uppercase tracking-wide text-sandr-muted hover:text-white"
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
