// "Due volti" di SANDR: PRO (grande beach volley) e OPEN (tornei di club/Open,
// include Under 18). Questo file è l'UNICA fonte di verità per i due volti:
// label, home, tagline e TEMA. Nessuna pagina qui — solo struttura.
//
// Tema: l'ACCENTO è lo stesso arancione SANDR (#F04E00) per entrambi i volti.
// Tra PRO e OPEN cambiano SOLO sfondi e superfici:
//   - PRO  = scuro  (sfondo #141414, superfici scure, testo chiaro)
//   - OPEN = chiaro (sfondo #F8F6F3, superfici bianche, testo scuro)

export type Face = 'pro' | 'open';

export const FACES: readonly Face[] = ['pro', 'open'] as const;

export interface FaceMeta {
  key: Face;
  label: string; // 'PRO' | 'OPEN'
  tagline: string;
  // Home del volto (senza prefisso locale: lo aggiunge il Link di next-intl).
  home: string;
  // true se il volto usa un tema CHIARO (testo scuro su sfondo chiaro).
  light: boolean;
  // Tema.
  bg: string; // sfondo pagina
  surface: string; // superfici (card/header)
  fg: string; // testo principale
  accent: string; // accento — SEMPRE arancione SANDR
}

export const faceMeta: Record<Face, FaceMeta> = {
  pro: {
    key: 'pro',
    label: 'PRO',
    tagline: 'Il grande beach volley',
    home: '/',
    light: false,
    bg: '#141414',
    surface: '#1C1C1C',
    fg: '#F7F5F2',
    accent: '#F04E00',
  },
  open: {
    key: 'open',
    label: 'OPEN',
    tagline: 'Tornei di club e Open',
    home: '/open',
    light: true,
    bg: '#F8F6F3',
    surface: '#FFFFFF',
    fg: '#141414',
    accent: '#F04E00',
  },
};

// Volto "opposto" (per il selettore PRO/OPEN).
export const otherFace = (f: Face): Face => (f === 'pro' ? 'open' : 'pro');
