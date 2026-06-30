// Sistema di tag per i contenuti SANDR.

export type CircuitTag =
  | 'FIPAV'
  | 'AIBVC'
  | 'AVP'
  | 'BPT'
  | 'CEV'
  | 'FIVB'
  | 'King & Queen'
  | 'Marathon'
  | 'Beach Pro Tour';

export type SportTag = 'Beach Volley' | 'Beach Tennis' | 'Padel' | 'Snow Volley';

export type ContentType = 'live' | 'replay' | 'interview' | 'highlights' | 'behind-the-scenes';

export type NationTag = 'Italia' | 'USA' | 'Brasile' | 'Germania' | 'Francia' | 'Olanda' | 'Norvegia';

export type EventTag = 'Finale' | 'Semifinale' | 'Quarti' | 'Regular Season' | 'Wild Card';

export interface ContentTags {
  circuits: CircuitTag[];
  sport: SportTag;
  type: ContentType;
  nations: NationTag[];
  event?: EventTag;
}

export interface ContentItem {
  id: string;
  title: string;
  teams?: string;
  // Opzionale: i video reali possono non avere un circuito assegnato. In quel
  // caso finiscono nella riga "Novità" invece di essere forzati su un circuito.
  circuit?: CircuitTag;
  sport: SportTag;
  type: ContentType;
  nations: NationTag[];
  event?: EventTag;
  thumbnail?: string;
  // Copertina dedicata "in evidenza" (16:9 desktop), usata nell'hero carousel.
  thumbnailFeatured?: string;
  // Copertina hero per MOBILE (4:5 verticale). Fallback a thumbnailFeatured.
  thumbnailMobile?: string;
  duration?: string;
  viewerCount?: number;
  isLive?: boolean;
  isPremium?: boolean;
  // Livello di accesso reale del contenuto (per badge FREE/PREMIUM/PPV e gating).
  access?: 'free' | 'premium' | 'ppv';
  date?: string;
  tags: string[]; // flat array for filtering
}
