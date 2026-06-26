'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';

// Link di navigazione principali (Sports è un'ancora alla sezione homepage).
const navLinks = [
  { href: '/live', key: 'live' },
  { href: '/vod', key: 'replay' },
  { href: '/#sports', key: 'sports' },
  { href: '/pricing', key: 'pricing' },
] as const;

// Logo riutilizzato in entrambe le varianti.
function Logo({ href = '/', onClick }: { href?: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="SANDR"
        width={112}
        height={112}
        style={{ height: '112px', width: '112px', objectFit: 'contain' }}
      />
    </Link>
  );
}

// La Navbar è renderizzata una sola volta nel layout: la variante è derivata
// dalla rotta (tutte le pagine /dashboard usano la variante semplificata),
// con possibilità di override esplicito via prop.
export function Navbar({ variant }: { variant?: 'public' | 'dashboard' }) {
  const pathname = usePathname();
  const resolved = variant ?? (pathname.startsWith('/dashboard') ? 'dashboard' : 'public');

  return resolved === 'dashboard' ? <DashboardNavbar /> : <PublicNavbar />;
}

// ===== Variante dashboard: solo logo + avatar =====
function DashboardNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-sandr-black/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo href="/dashboard/home" />
        <AvatarMenu />
      </div>
    </header>
  );
}

// Avatar con dropdown account (chiude al click fuori).
function AvatarMenu() {
  const t = useTranslations('Account');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // Logout simulato: torna alla landing pubblica.
  const logout = () => {
    setOpen(false);
    router.push('/');
  };

  const links = [
    { href: '/dashboard/subscription', label: t('subscription') },
    { href: '/dashboard/payment', label: t('payment') },
    { href: '/dashboard/ppv-history', label: t('ppvHistory') },
    { href: '/dashboard/settings', label: t('settings') },
  ] as const;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Account"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-[#242424] font-condensed font-bold text-white"
      >
        E
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 min-w-[240px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
          {/* Il mio account */}
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-sandr-muted">{t('myAccount')}</p>
            <p className="mt-0.5 text-sm text-[#C0BDB8]">utente@sandr.tv</p>
          </div>

          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/[0.06] px-4 py-3 text-sm text-[#C0BDB8] hover:bg-white/[0.04]"
            >
              {l.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={logout}
            className="block w-full px-4 py-3 text-left text-sm text-[#C0BDB8] hover:bg-white/[0.04]"
          >
            {t('logout')}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ===== Variante public: navbar completa =====
function PublicNavbar() {
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-sandr-black/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo onClick={() => setOpen(false)} />

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
              href="/login"
              className="hidden rounded border border-white/[0.15] px-4 py-2 font-condensed font-semibold uppercase tracking-wide text-white md:inline-block"
            >
              {tc('signIn')}
            </Link>
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
              <span className="relative block h-4 w-6">
                <span className="absolute left-0 top-0 block h-0.5 w-6 bg-current" />
                <span className="absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-current" />
                <span className="absolute bottom-0 left-0 block h-0.5 w-6 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay menu mobile: full-screen, sfondo opaco #141414, z-50. */}
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#141414] md:hidden">
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

          <div className="flex flex-col gap-3 px-6 pb-10">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block rounded border border-white/[0.15] px-8 py-3 text-center font-condensed text-lg font-bold uppercase tracking-wide text-white"
            >
              {tc('signIn')}
            </Link>
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
