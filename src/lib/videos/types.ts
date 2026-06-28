// Payload del form video → server action (createVideo/updateVideo).
export type VideoFormPayload = {
  id?: string; // presente in modifica
  cloudflareUid: string;
  title: string;
  description?: string;
  type?: string; // valore enum content_type (es. 'live', 'replay', ...)
  sportId?: string;
  federationId?: string;
  eventId?: string;
  thumbnailCardUrl?: string;
  thumbnailFeaturedUrl?: string;
  durationSeconds?: number;
  accessLevel: 'free' | 'premium' | 'ppv';
  ppvPrice?: number;
  isFeatured: boolean;
  isLive: boolean;
  athleteIds: string[];
  tags: string[];
};

// Riga per la pagina player /vod/[id] (legge per id Supabase, espone uid CF).
export type PlayerVideo = {
  id: string;
  cloudflareUid: string | null;
  title: string;
  description: string | null;
  durationSeconds: number | null;
  publishedAt: string | null;
  createdAt: string;
  thumbnailCardUrl: string | null;
};

// Riga per la lista del pannello admin.
export type AdminVideoRow = {
  uid: string; // id Supabase (usato da Modifica/Elimina)
  name: string;
  thumb: string;
  circuit?: string;
  type?: string;
  sport?: string;
  ready: boolean;
  date: string;
};

// Dati per pre-compilare il form in modifica.
export type VideoEditData = {
  id: string;
  cloudflareUid: string | null;
  title: string;
  description: string | null;
  type: string | null;
  sportId: string | null;
  federationId: string | null;
  thumbnailCardUrl: string | null;
  thumbnailFeaturedUrl: string | null;
  accessLevel: string;
  isFeatured: boolean;
  isLive: boolean;
  athleteIds: string[];
  tags: string[];
};
