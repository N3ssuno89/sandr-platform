import type { ReactNode } from 'react';
import { FaceShell } from '@/components/faces/FaceShell';

// Route group del volto PRO. Applica tema/menu/selettore a tutte le (future)
// pagine dentro (pro)/. Il route group non cambia l'URL.
export default function ProLayout({ children }: { children: ReactNode }) {
  return <FaceShell face="pro">{children}</FaceShell>;
}
