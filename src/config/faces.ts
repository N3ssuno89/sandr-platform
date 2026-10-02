// "Due volti" di SANDR: PRO (grande beach volley) e OPEN (tornei di club/Open,
// include Under 18). Questo file è l'UNICA fonte di verità per i due volti:
// label, home, tagline e TEMA completo (palette). Nessuna pagina qui.
//
// Tema: l'ACCENTO è lo stesso arancione SANDR (#F04E00) per entrambi i volti.
// Tra PRO e OPEN cambiano sfondi, superfici, bordi e testi:
//   - PRO  = scuro  (sfondo #141414, superfici scure, testo chiaro)
//   - OPEN = chiaro (sfondo #F8F6F3, superfici bianche, testo scuro)
// I valori qui replicano esattamente la demo di riferimento.

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

  // ---- Palette del volto ----
  bg: string; // sfondo pagina
  surface: string; // superfici (card/header)
  border: string; // bordi card/superfici
  chip: string; // sfondo chip/filtri/pillole
  fg: string; // testo principale
  muted: string; // testo secondario
  muted2: string; // testo secondario alternativo (più chiaro)
  accent: string; // accento — SEMPRE arancione SANDR
  accentHover: string; // accento in hover
  img: string; // segnaposto immagini
  link: string; // link testuali (serve contrasto su sfondo chiaro)
  headerBorder: string; // bordo inferiore dell'header del volto
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
    border: '#2A2A2A',
    chip: '#242424',
    fg: '#F8F6F3',
    muted: '#A8A39C',
    muted2: '#C9C4BC',
    accent: '#F04E00',
    accentHover: '#FF7A3D',
    img: '#262019',
    link: '#F04E00',
    headerBorder: '#262626',
  },
  open: {
    key: 'open',
    label: 'OPEN',
    tagline: 'Tornei di club e Open',
    home: '/open',
    light: true,
    bg: '#F8F6F3',
    surface: '#FFFFFF',
    border: '#E3DDD3',
    chip: '#EAE5DD',
    fg: '#1C1C1C',
    muted: '#5E584F',
    muted2: '#5E584F',
    accent: '#F04E00',
    accentHover: '#FF7A3D',
    img: '#E6D7C1',
    link: '#B83C00',
    headerBorder: '#E3DDD3',
  },
};

// Volto "opposto" (per il selettore PRO/OPEN).
export const otherFace = (f: Face): Face => (f === 'pro' ? 'open' : 'pro');
