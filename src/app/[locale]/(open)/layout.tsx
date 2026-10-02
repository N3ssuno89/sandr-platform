import type { ReactNode } from 'react';
import { FaceShell } from '@/components/faces/FaceShell';

// Route group del volto OPEN (tornei di club/Open, include Under 18). Applica
// tema/menu/badge/selettore alle (future) pagine dentro (open)/. Il route group
// non cambia l'URL.
export default function OpenLayout({ children }: { children: ReactNode }) {
  return <FaceShell face="open">{children}</FaceShell>;
}
