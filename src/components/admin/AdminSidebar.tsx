'use client';

import { Link, usePathname } from '@/i18n/routing';

// Pannello admin: tool interno staff-facing, etichette in italiano (no i18n).
const NAV = [
  { href: '/dashboard/admin', label: 'Dashboard' },
  { href: '/dashboard/admin/videos', label: 'Video' },
  { href: '/dashboard/admin/live', label: 'Live' },
  { href: '/dashboard/admin/athletes', label: 'Atleti' },
  { href: '/dashboard/admin/users', label: 'Utenti' },
  { href: '/dashboard/admin/subscriptions', label: 'Abbonamenti' },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard/admin' ? pathname === '/dashboard/admin' : pathname.startsWith(href);

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/[0.06] bg-[#141414]">
      <div className="p-4">
        <Link href="/dashboard/home" className="inline-flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="SANDR" className="h-12 w-12 object-contain" />
        </Link>
      </div>

      <nav className="flex-1 px-2">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block border-l-[3px] px-4 py-3 font-condensed text-sm font-bold uppercase tracking-wide transition-colors ${
                active
                  ? 'border-sandr-orange bg-sandr-orange/[0.08] text-white'
                  : 'border-transparent text-sandr-muted hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-2">
        <Link
          href="/dashboard/home"
          className="block px-4 py-3 font-condensed text-sm font-bold uppercase tracking-wide text-sandr-muted hover:text-white"
        >
          ← Torna al sito
        </Link>
      </div>
    </aside>
  );
}
