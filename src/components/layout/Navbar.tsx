'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

// Link di navigazione principali (Sports è un'ancora alla sezione homepage).
const navLinks = [
  { href: '/live', key: 'live' },
  { href: '/vod', key: 'replay' },
  { href: '/#sports', key: 'sports' },
  { href: '/pricing', key: 'pricing' },
] as const;

// Navbar fissa con backdrop-blur. Logo a sinistra, link al centro, CTA a
// destra. Su mobile: hamburger che apre un overlay full-screen opaco.
export function Navbar() {
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-sandr-black/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo — file caricato manualmente in /public/logo.png */}
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SANDR" className="h-9 w-auto" />
          </Link>

          {/* Link desktop, centrati */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 font-condensed uppercase tracking-wide text-sandr-muted md:flex">
            {navLinks.map((l) => (
              <Link key={l.key} href={l.href} className="transition-colors hover:text-sandr-text">
                {t(l.key)}
              </Link>
            ))}
          </nav>

          {/* CTA desktop + hamburger mobile */}
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="hidden rounded bg-sandr-orange px-4 py-2 font-condensed font-semibold uppercase tracking-wide text-sandr-text md:inline-block"
            >
              {tc('subscribe')}
            </Link>

            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded text-sandr-text md:hidden"
            >
              {/* Icona hamburger (niente emoji) */}
              <span className="relative block h-4 w-6">
                <span className="absolute left-0 top-0 block h-0.5 w-6 bg-current" />
                <span className="absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-current" />
                <span className="absolute bottom-0 left-0 block h-0.5 w-6 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay menu mobile: full-screen, sfondo opaco #141414, z-50.
          Si chiude con la X o al click su un link. */}
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#141414] md:hidden">
          {/* Pulsante di chiusura (X) in alto a destra, arancione */}
          <div className="flex h-16 items-center justify-end px-4">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="relative inline-flex h-10 w-10 items-center justify-center text-sandr-orange"
            >
              <span className="absolute h-0.5 w-6 rotate-45 bg-current" />
              <span className="absolute h-0.5 w-6 -rotate-45 bg-current" />
            </button>
          </div>

          {/* Voci di menu centrate (Barlow Condensed 700, 24px) */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-condensed text-2xl font-bold uppercase tracking-wide text-sandr-text"
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          {/* CTA arancione in fondo */}
          <div className="px-6 pb-10">
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="block rounded bg-sandr-orange px-8 py-3 text-center font-condensed text-lg font-bold uppercase tracking-wide text-sandr-text"
            >
              {tc('subscribe')}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
