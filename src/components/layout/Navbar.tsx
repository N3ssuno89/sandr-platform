'use client';

import { useState } from 'react';
import Image from 'next/image';
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
// destra. Su mobile: hamburger che apre un overlay full-screen.
export function Navbar() {
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-sandr-black/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo (file caricato manualmente in /public/logo.png) */}
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
          <Image
            src="/logo.png"
            alt="SANDR"
            width={128}
            height={32}
            priority
            className="h-8 w-auto"
          />
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
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 inline-flex h-10 w-10 items-center justify-center rounded text-sandr-text md:hidden"
          >
            {/* Icona hamburger/chiudi in CSS (niente emoji) */}
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform ${
                  open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-current transition-opacity ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform ${
                  open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Overlay menu mobile full-screen: si chiude al click su un link */}
      {open ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-sandr-black md:hidden">
          <nav className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
            {navLinks.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl uppercase text-sandr-text"
              >
                {t(l.key)}
              </Link>
            ))}
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="mt-4 rounded bg-sandr-orange px-8 py-3 font-condensed text-lg font-semibold uppercase tracking-wide text-sandr-text"
            >
              {tc('subscribe')}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
