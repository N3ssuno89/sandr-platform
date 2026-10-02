'use client';

import { Link } from '@/i18n/routing';
import { FACES, faceMeta, type Face } from '@/config/faces';

// Selettore PRO / OPEN. Naviga alla home del volto (locale-aware via Link).
export function FaceSwitcher({ current }: { current: Face }) {
  return (
    <div
      role="group"
      aria-label="PRO / OPEN"
      className="inline-flex rounded-full border border-white/15 p-0.5"
    >
      {FACES.map((f) => {
        const active = f === current;
        return (
          <Link
            key={f}
            href={faceMeta[f].home}
            aria-current={active ? 'true' : undefined}
            className={`rounded-full px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wide transition-colors ${
              active ? 'bg-sandr-orange text-black' : 'text-sandr-muted hover:text-white'
            }`}
          >
            {faceMeta[f].label}
          </Link>
        );
      })}
    </div>
  );
}
