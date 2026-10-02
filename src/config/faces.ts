// "Due volti" di SANDR: PRO (grande beach volley) e OPEN (tornei di club/Open,
// include Under 18). Questo file è l'UNICA fonte di verità per i due volti:
// label, home, tagline e TEMA. Nessuna pagina qui — solo struttura.
//
// Tema: per ora i valori usano SOLO colori già nella palette SANDR (CLAUDE.md:
// "Non modificare la palette colori"). L'accento resta l'arancione SANDR per
// entrambi; l'eventuale accento distinto del volto OPEN va validato dal founder.

export type Face = 'pro' | 'open';

export const FACES: readonly Face[] = ['pro', 'open'] as const;

export interface FaceMeta {
  key: Face;
  label: string; // 'PRO' | 'OPEN'
  tagline: string;
  // Home del volto (senza prefisso locale: lo aggiunge il Link di next-intl).
  home: string;
  // Tema — solo valori già in palette (sandr-black / sandr-surface / sandr-orange).
  bg: string;
  accent: string;
}

export const faceMeta: Record<Face, FaceMeta> = {
  pro: {
    key: 'pro',
    label: 'PRO',
    tagline: 'Il grande beach volley',
    home: '/',
    bg: '#0C0C0C', // sandr-black
    accent: '#F04E00', // sandr-orange
  },
  open: {
    key: 'open',
    label: 'OPEN',
    tagline: 'Tornei di club e Open',
    home: '/open',
    bg: '#1A1A1A', // sandr-surface (tono distinto, stessa palette)
    accent: '#F04E00', // segnaposto: accento OPEN da validare col founder
  },
};

// Volto "opposto" (per il selettore PRO/OPEN).
export const otherFace = (f: Face): Face => (f === 'pro' ? 'open' : 'pro');
