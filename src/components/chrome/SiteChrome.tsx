'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/routing';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { faceFromPathname, faceVars, isAdminPath } from './faceTheme';

// Chrome a due volti applicata a TUTTO il sito. Il volto è dedotto dal pathname:
// PRO ovunque, OPEN su /open/*. Imposta il tema (variabili CSS + sfondo) sul
// contenitore, così le pagine lo ereditano. L'area admin mantiene la sua chrome.
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Admin: nessun header/footer del sito (sidebar dedicata nel suo layout).
  if (isAdminPath(pathname)) {
    return <>{children}</>;
  }

  const face = faceFromPathname(pathname);

  return (
    <div data-face={face} style={faceVars(face)} className="flex min-h-screen flex-col font-barlow">
      <SiteHeader face={face} />
      <main className="flex-1">{children}</main>
      <SiteFooter face={face} />
    </div>
  );
}
