'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';

// Logo centrato, riutilizzato in entrambe le varianti.
function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="SANDR"
        width={72}
        height={72}
        style={{ height: '72px', width: '72px', objectFit: 'contain' }}
      />
    </Link>
  );
}

// La Navbar è renderizzata una sola volta nel layout: la variante è derivata
// dalla rotta (tutte le pagine /dashboard usano la variante semplificata),
// con possibilità di override esplicito via prop. Niente link di navigazione.
export function Navbar({ variant }: { variant?: 'public' | 'dashboard' }) {
  const pathname = usePathname();
  // Il player live (/live/[id]) usa la navbar minimale come la dashboard.
  const resolved =
    variant ??
    (pathname.startsWith('/dashboard') || pathname.startsWith('/live/') ? 'dashboard' : 'public');

  return resolved === 'dashboard' ? <DashboardNavbar /> : <PublicNavbar />;
}

// ===== Variante public: ACCEDI · logo · ABBONATI =====
function PublicNavbar() {
  const tc = useTranslations('Common');

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-sandr-black/70 backdrop-blur">
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-3 items-center px-4">
        {/* Sinistra: ACCEDI */}
        <div className="flex justify-start">
          <Link
            href="/login"
            className="rounded border border-white/[0.15] px-3 py-2 font-condensed text-sm font-semibold uppercase tracking-wide text-white sm:px-4"
          >
            {tc('signIn')}
          </Link>
        </div>

        {/* Centro: logo */}
        <Logo />

        {/* Destra: ABBONATI */}
        <div className="flex justify-end">
          <Link
            href="/pricing"
            className="rounded bg-sandr-orange px-3 py-2 font-condensed text-sm font-semibold uppercase tracking-wide text-sandr-text sm:px-4"
          >
            {tc('subscribe')}
          </Link>
        </div>
      </div>
    </header>
  );
}

// ===== Variante dashboard: (vuoto) · logo · avatar =====
function DashboardNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-sandr-black/70 backdrop-blur">
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-3 items-center px-4">
        <div />
        <Logo href="/dashboard/home" />
        <div className="flex justify-end">
          <AvatarMenu />
        </div>
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
