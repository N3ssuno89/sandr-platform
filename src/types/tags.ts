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
  circuit: CircuitTag;
  sport: SportTag;
  type: ContentType;
  nations: NationTag[];
  event?: EventTag;
  thumbnail?: string;
  // Copertina dedicata "in evidenza" (21:9), usata nell'hero carousel.
  thumbnailFeatured?: string;
  duration?: string;
  viewerCount?: number;
  isLive?: boolean;
  isPremium?: boolean;
  date?: string;
  tags: string[]; // flat array for filtering
}
