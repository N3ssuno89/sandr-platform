'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

// Iniziali per l'avatar: dal nome completo (max 2), altrimenti dall'email.
function initialsOf(fullName: string | null, email: string | null): string {
  if (fullName && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'U';
  }
  if (email) return email[0]?.toUpperCase() ?? 'U';
  return 'U';
}

// Logo centrato. Se href è null, è solo display (es. sulla landing dove sei
// già): nessun link.
function Logo({ href }: { href: string | null }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="SANDR"
      width={72}
      height={72}
      style={{ height: '72px', width: '72px', objectFit: 'contain' }}
    />
  );
  if (href === null) {
    return <div className="flex items-center justify-center">{img}</div>;
  }
  return (
    <Link href={href} className="flex items-center justify-center">
      {img}
    </Link>
  );
}

// La Navbar è renderizzata una sola volta nel layout. È CONSAPEVOLE DELLA
// SESSIONE su OGNI pagina (non solo /dashboard): legge lo stato Supabase via
// getUser() iniziale + onAuthStateChange. AREA CRITICA (CLAUDE.md): Auth.
//
// - loggato     -> avatar a destra, logo verso /dashboard/home
// - non loggato -> Accedi/Abbonati, logo verso / (landing)
// - su / (landing): il logo non è cliccabile (sei già lì)
// loggedIn === null = stato ancora sconosciuto: mostriamo solo il logo per
// evitare di lampeggiare la CTA sbagliata (es. "Accedi" a un utente loggato).
export function Navbar() {
  const pathname = usePathname();
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
    const apply = (user: { id?: string; email?: string; user_metadata?: Record<string, unknown> } | null) => {
      setLoggedIn(!!user);
      setEmail(user?.email ?? null);
      setFullName((user?.user_metadata?.full_name as string | undefined) ?? null);
      // Ruolo (per mostrare "Pannello Admin"). RLS: self-read del proprio profilo.
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

  const tc = useTranslations('Common');
  const isLanding = pathname === '/';
  const logoHref = isLanding ? null : loggedIn ? '/dashboard/home' : '/';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-sandr-black/70 backdrop-blur">
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-3 items-center px-4">
        {/* Sinistra: Accedi (solo se non loggato e stato noto) */}
        <div className="flex justify-start">
          {loggedIn === false ? (
            <Link
              href="/login"
              className="rounded border border-white/[0.15] px-3 py-2 font-condensed text-sm font-semibold uppercase tracking-wide text-white sm:px-4"
            >
              {tc('signIn')}
            </Link>
          ) : null}
        </div>

        {/* Centro: logo */}
        <Logo href={logoHref} />

        {/* Destra: avatar (loggato) o Abbonati (non loggato) */}
        <div className="flex justify-end">
          {loggedIn === true ? (
            <AvatarMenu email={email} fullName={fullName} isAdmin={isAdmin} />
          ) : loggedIn === false ? (
            <Link
              href="/pricing"
              className="rounded bg-sandr-orange px-3 py-2 font-condensed text-sm font-semibold uppercase tracking-wide text-sandr-text sm:px-4"
            >
              {tc('subscribe')}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

// Avatar con dropdown account (chiude al click fuori).
// AREA CRITICA (CLAUDE.md): gestisce il logout reale (signOut Supabase).
function AvatarMenu({ email, fullName, isAdmin }: { email: string | null; fullName: string | null; isAdmin: boolean }) {
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

  // Logout reale: signOut Supabase, poi torna alla landing pubblica.
  const logout = async () => {
    setOpen(false);
    if (isSupabaseConfigured()) {
      await createClient().auth.signOut();
    }
    router.push('/');
    router.refresh();
  };

  const initials = initialsOf(fullName, email);

  // Menu account organizzato (etichette italiane).
  const links = [
    { href: '/dashboard/profile', label: 'Il mio account' },
    { href: '/dashboard/settings', label: 'Impostazioni' },
    { href: '/dashboard/subscription', label: 'Abbonamento' },
    { href: '/dashboard/watch-history', label: 'Cronologia' },
    { href: '/dashboard/reminders', label: 'Reminder' },
    { href: '/dashboard/fantasy', label: 'Fantasy' },
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
        {initials}
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 min-w-[240px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-sandr-muted">{t('myAccount')}</p>
            <p className="mt-0.5 truncate text-sm text-[#C0BDB8]">{email ?? '—'}</p>
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

          {/* Pannello Admin: solo per gli admin */}
          {isAdmin ? (
            <Link
              href="/dashboard/admin"
              onClick={() => setOpen(false)}
              className="block border-b border-white/[0.06] px-4 py-3 text-sm font-semibold text-sandr-orange hover:bg-white/[0.04]"
            >
              Pannello Admin
            </Link>
          ) : null}

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
