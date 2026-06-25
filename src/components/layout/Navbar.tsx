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

// Navbar fissa con backdrop-blur. Wordmark a sinistra, link al centro,
// CTA a destra, menu hamburger su mobile.
export function Navbar() {
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-sandr-black/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Wordmark */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-display text-xl tracking-tight text-sandr-text"
        >
          SANDR
        </Link>

        {/* Link (desktop, centrati) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 font-condensed uppercase tracking-wide text-sandr-muted md:flex">
          {navLinks.map((l) => (
            <Link key={l.key} href={l.href} className="transition-colors hover:text-sandr-text">
              {t(l.key)}
            </Link>
          ))}
        </nav>

        {/* CTA (desktop) + hamburger (mobile) */}
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
            className="inline-flex h-10 w-10 items-center justify-center rounded text-sandr-text md:hidden"
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

      {/* Menu mobile */}
      {open ? (
        <nav className="border-t border-white/10 bg-sandr-black/95 px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-1 font-condensed uppercase tracking-wide text-sandr-muted">
            {navLinks.map((l) => (
              <li key={l.key}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 hover:text-sandr-text"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="block rounded bg-sandr-orange px-4 py-2 text-center font-semibold text-sandr-text"
              >
                {tc('subscribe')}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
