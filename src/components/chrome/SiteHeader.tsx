'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { faceMeta, type Face } from '@/config/faces';
import { features } from '@/config/features';

// Iniziali per l'avatar: dal nome completo (max 2), altrimenti dall'email.
function initialsOf(fullName: string | null, email: string | null): string {
  if (fullName && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'U';
  }
  if (email) return email[0]?.toUpperCase() ?? 'U';
  return 'U';
}

type NavItem = { href: string; label: string };

// Hook sessione Supabase (AREA CRITICA, CLAUDE.md: Auth). Condiviso da header
// desktop e pannello mobile. loggedIn === null = stato ancora sconosciuto.
function useSession() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoggedIn(false);
      return;
    }
    const supabase = createClient();
    const apply = (
      user: { id?: string; email?: string; user_metadata?: Record<string, unknown> } | null,
    ) => {
      setLoggedIn(!!user);
      setEmail(user?.email ?? null);
      setFullName((user?.user_metadata?.full_name as string | undefined) ?? null);
      if (user?.id) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()
          .then(({ data }) => setIsAdmin(data?.role === 'admin'));
      } else {
        setIsAdmin(false);
      }
    };
    supabase.auth.getUser().then(({ data }) => apply(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      apply(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { loggedIn, email, fullName, isAdmin };
}

// Header a due volti. PRO su tutto il sito, OPEN su /open/*. Stile dalla demo.
export function SiteHeader({ face }: { face: Face }) {
  const t = useTranslations('Nav');
  const meta = faceMeta[face];
  const session = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Chiudi il pannello mobile a ogni cambio pagina.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const nav: NavItem[] =
    face === 'pro'
      ? [
          { href: meta.home, label: t('home') },
          { href: '/live', label: t('dirette') },
          { href: '/tornei', label: t('tornei') },
          { href: '/athletes', label: t('atleti') },
          // FantaBeach dietro feature flag (pagina non ancora implementata).
          ...(features.fantabeach ? [{ href: '/fantabeach', label: t('fantabeach') }] : []),
        ]
      : [
          // Il menu OPEN resta dentro il volto OPEN: solo rotte /open/*.
          { href: '/open/tornei', label: t('tornei') },
          { href: '/open/vicino', label: t('near') },
          { href: '/open/profilo', label: t('myMatches') },
          { href: '/open/organizza', label: t('organize') },
        ];

  // Header: PRO su sfondo pagina, OPEN su superficie bianca.
  const headerBg = meta.light ? 'var(--face-surface)' : 'var(--face-bg)';

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: headerBg, borderColor: 'var(--face-header-border)' }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1360px] items-center gap-4 px-4 md:px-10">
        {/* Logo (+ badge OPEN) */}
        <Link href={meta.home} className="flex shrink-0 items-center gap-2">
          <span className="font-display text-xl uppercase tracking-tight text-[color:var(--face-fg)]">
            SANDR
          </span>
          {face === 'open' ? (
            <span className="rounded bg-[color:var(--face-accent)] px-1.5 py-0.5 font-barlow text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              OPEN
            </span>
          ) : null}
        </Link>

        {/* Menu desktop */}
        <nav className="ml-6 hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link
              key={`${n.href}-${n.label}`}
              href={n.href}
              className="font-barlow text-[15px] font-semibold text-[color:var(--face-muted)] transition-colors hover:text-[color:var(--face-fg)]"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Cerca (solo PRO): pulsante rotondo 44px → /search */}
          {face === 'pro' ? (
            <Link
              href="/search"
              aria-label={t('search')}
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors hover:border-[color:var(--face-accent)] sm:flex"
              style={{ borderColor: 'var(--face-border)', color: 'var(--face-muted)' }}
            >
              <SearchIcon />
            </Link>
          ) : null}

          {/* Selettore volto — sempre visibile (anche su telefono) */}
          <FaceToggle face={face} />

          {/* Lingua IT/EN */}
          <LanguageToggle className="hidden sm:flex" />

          {/* Account (desktop) */}
          <div className="hidden md:block">
            {session.loggedIn === true ? (
              <AvatarMenu
                email={session.email}
                fullName={session.fullName}
                isAdmin={session.isAdmin}
              />
            ) : session.loggedIn === false ? (
              <SignInButton />
            ) : null}
          </div>

          {/* Hamburger (mobile) */}
          <button
            type="button"
            aria-label={t('menu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border md:hidden"
            style={{ borderColor: 'var(--face-border)', color: 'var(--face-fg)' }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Pannello mobile a scomparsa */}
      {menuOpen ? (
        <MobilePanel face={face} nav={nav} session={session} onClose={() => setMenuOpen(false)} />
      ) : null}
    </header>
  );
}

// Selettore PRO/OPEN. PRO: pillola con PRO attivo (accento) + OPEN (link).
// OPEN: pillola scura "Vai a SANDR Pro ›".
function FaceToggle({ face }: { face: Face }) {
  const t = useTranslations('Nav');
  if (face === 'open') {
    return (
      <Link
        href="/"
        className="inline-flex items-center gap-1 rounded-full px-4 py-2 font-barlow text-sm font-bold text-[#F8F6F3]"
        style={{ backgroundColor: '#141414' }}
      >
        {t('goToPro')} <span aria-hidden>›</span>
      </Link>
    );
  }
  return (
    <div
      role="group"
      aria-label="PRO / OPEN"
      className="inline-flex shrink-0 rounded-full p-1"
      style={{ backgroundColor: 'var(--face-chip)' }}
    >
      <span
        aria-current="true"
        className="rounded-full bg-[color:var(--face-accent)] px-3.5 py-1.5 font-barlow text-xs font-bold uppercase tracking-wide text-white"
      >
        PRO
      </span>
      <Link
        href="/open"
        className="rounded-full px-3.5 py-1.5 font-barlow text-xs font-bold uppercase tracking-wide text-[color:var(--face-muted)] transition-colors hover:text-[color:var(--face-fg)]"
      >
        OPEN
      </Link>
    </div>
  );
}

function LanguageToggle({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const base =
    'font-barlow text-xs font-bold uppercase tracking-wide transition-colors';
  const activeCls = 'text-[color:var(--face-accent)]';
  const idleCls = 'text-[color:var(--face-muted)] hover:text-[color:var(--face-fg)]';
  return (
    <div className={`items-center gap-1 ${className}`}>
      <Link href={pathname} locale="it" className={`${base} ${locale === 'it' ? activeCls : idleCls}`}>
        IT
      </Link>
      <span className="text-[color:var(--face-muted)]">/</span>
      <Link href={pathname} locale="en" className={`${base} ${locale === 'en' ? activeCls : idleCls}`}>
        EN
      </Link>
    </div>
  );
}

function SignInButton() {
  const tc = useTranslations('Common');
  return (
    <Link
      href="/login"
      className="rounded-[10px] border px-5 py-2.5 font-barlow text-sm font-bold uppercase tracking-wide text-[color:var(--face-fg)] transition-colors hover:border-[color:var(--face-accent)]"
      style={{ borderColor: 'var(--face-border)' }}
    >
      {tc('signIn')}
    </Link>
  );
}

// Avatar con dropdown account. AREA CRITICA (CLAUDE.md): logout reale Supabase.
function AvatarMenu({
  email,
  fullName,
  isAdmin,
}: {
  email: string | null;
  fullName: string | null;
  isAdmin: boolean;
}) {
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

  const logout = async () => {
    setOpen(false);
    if (isSupabaseConfigured()) {
      await createClient().auth.signOut();
    }
    router.push('/');
    router.refresh();
  };

  const initials = initialsOf(fullName, email);

  const links = [
    { href: '/dashboard/profile', label: 'Il mio account' },
    { href: '/dashboard/settings', label: 'Impostazioni' },
    { href: '/dashboard/subscription', label: 'Abbonamento' },
    { href: '/dashboard/watch-history', label: 'Cronologia' },
    { href: '/dashboard/reminders', label: 'Reminder' },
  ] as const;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Account"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full border font-barlow font-bold text-[color:var(--face-fg)]"
        style={{ borderColor: 'var(--face-border)', backgroundColor: 'var(--face-chip)' }}
      >
        {initials}
      </button>

      {open ? (
        <div
          className="absolute right-0 mt-2 min-w-[240px] overflow-hidden rounded-xl border"
          style={{ backgroundColor: 'var(--face-surface)', borderColor: 'var(--face-border)' }}
        >
          <div className="border-b px-4 py-3" style={{ borderColor: 'var(--face-border)' }}>
            <p className="font-barlow text-xs uppercase tracking-wide text-[color:var(--face-muted)]">
              {t('myAccount')}
            </p>
            <p className="mt-0.5 truncate font-barlow text-sm text-[color:var(--face-muted2)]">
              {email ?? '—'}
            </p>
          </div>

          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b px-4 py-3 font-barlow text-sm text-[color:var(--face-muted2)] hover:bg-[color:var(--face-chip)]"
              style={{ borderColor: 'var(--face-border)' }}
            >
              {l.label}
            </Link>
          ))}

          {isAdmin ? (
            <Link
              href="/dashboard/admin"
              onClick={() => setOpen(false)}
              className="block border-b px-4 py-3 font-barlow text-sm font-semibold text-[color:var(--face-accent)] hover:bg-[color:var(--face-chip)]"
              style={{ borderColor: 'var(--face-border)' }}
            >
              Pannello Admin
            </Link>
          ) : null}

          <button
            type="button"
            onClick={logout}
            className="block w-full px-4 py-3 text-left font-barlow text-sm text-[color:var(--face-muted2)] hover:bg-[color:var(--face-chip)]"
          >
            {t('logout')}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MobilePanel({
  face,
  nav,
  session,
  onClose,
}: {
  face: Face;
  nav: NavItem[];
  session: ReturnType<typeof useSession>;
  onClose: () => void;
}) {
  const t = useTranslations('Account');
  const tc = useTranslations('Common');
  const router = useRouter();

  const logout = async () => {
    onClose();
    if (isSupabaseConfigured()) {
      await createClient().auth.signOut();
    }
    router.push('/');
    router.refresh();
  };

  return (
    <div
      className="border-t md:hidden"
      style={{ backgroundColor: faceMeta[face].surface, borderColor: 'var(--face-header-border)' }}
    >
      <nav className="mx-auto flex max-w-[1360px] flex-col px-4 py-2">
        {nav.map((n) => (
          <Link
            key={`${n.href}-${n.label}`}
            href={n.href}
            onClick={onClose}
            className="border-b py-3 font-barlow text-base font-semibold text-[color:var(--face-fg)]"
            style={{ borderColor: 'var(--face-border)' }}
          >
            {n.label}
          </Link>
        ))}

        <div className="flex items-center justify-between py-4">
          <LanguageToggle className="flex" />
          {session.loggedIn === false ? (
            <Link
              href="/login"
              onClick={onClose}
              className="rounded-[10px] bg-[color:var(--face-accent)] px-5 py-2.5 font-barlow text-sm font-bold uppercase tracking-wide text-white"
            >
              {tc('signIn')}
            </Link>
          ) : null}
        </div>

        {session.loggedIn === true ? (
          <div className="flex flex-col border-t py-2" style={{ borderColor: 'var(--face-border)' }}>
            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className="py-3 font-barlow text-sm text-[color:var(--face-muted2)]"
            >
              {t('myAccount')}
            </Link>
            {session.isAdmin ? (
              <Link
                href="/dashboard/admin"
                onClick={onClose}
                className="py-3 font-barlow text-sm font-semibold text-[color:var(--face-accent)]"
              >
                Pannello Admin
              </Link>
            ) : null}
            <button
              type="button"
              onClick={logout}
              className="py-3 text-left font-barlow text-sm text-[color:var(--face-muted2)]"
            >
              {t('logout')}
            </button>
          </div>
        ) : null}
      </nav>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
