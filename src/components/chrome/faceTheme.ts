import type { CSSProperties } from 'react';
import { faceMeta, type Face } from '@/config/faces';

// Volto in base al pathname (locale già rimosso da next-intl usePathname):
// tutte le rotte /open/* usano il volto OPEN, il resto del sito il volto PRO.
export function faceFromPathname(pathname: string): Face {
  return pathname === '/open' || pathname.startsWith('/open/') ? 'open' : 'pro';
}

// Le rotte admin mantengono la loro chrome (sidebar dedicata): niente header/footer.
export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith('/dashboard/admin');
}

// Variabili CSS del volto: impostate sul contenitore della chrome e EREDITATE
// dalle pagine. Header/footer/componenti leggono via `bg-[var(--face-surface)]` ecc.
export function faceVars(face: Face): CSSProperties {
  const m = faceMeta[face];
  return {
    backgroundColor: m.bg,
    color: m.fg,
    ['--face-bg']: m.bg,
    ['--face-surface']: m.surface,
    ['--face-border']: m.border,
    ['--face-chip']: m.chip,
    ['--face-fg']: m.fg,
    ['--face-muted']: m.muted,
    ['--face-muted2']: m.muted2,
    ['--face-accent']: m.accent,
    ['--face-accent-hover']: m.accentHover,
    ['--face-img']: m.img,
    ['--face-link']: m.link,
    ['--face-header-border']: m.headerBorder,
  } as CSSProperties;
}
