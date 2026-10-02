import type { ReactNode } from 'react';
import { faceMeta } from '@/config/faces';
import { OpenBadge } from './OpenBadge';
import { FaceSwitcher } from './FaceSwitcher';

// Guscio chiaro del volto OPEN per le pagine interne (diretta, profilo).
// Applica tema (sfondo chiaro + testo scuro + accento), badge OPEN e selettore.
export function OpenThemeShell({ children }: { children: ReactNode }) {
  const meta = faceMeta.open;
  return (
    <div
      data-face="open"
      style={{ backgroundColor: meta.bg, color: meta.fg, ['--face-accent']: meta.accent } as React.CSSProperties}
      className="min-h-screen"
    >
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 flex items-center gap-3">
          <OpenBadge />
          <div className="ml-auto">
            <FaceSwitcher current="open" />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
