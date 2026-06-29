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
  // Livello/tipo per il controllo accesso server-side (free/premium/ppv).
  accessLevel: 'free' | 'premium' | 'ppv';
  type: string | null;
  ppvPrice: number | null;
};

// Atleta taggato su un video (tab "Atleti" del player). Click → /athletes/[id].
export type VideoAthlete = {
  id: string;
  name: string;
  nation: string | null;
  photo: string | null;
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

// Esito del caricamento del video da modificare: distingue i motivi del
// fallimento (Supabase non configurato / non admin / video inesistente) così
// che la pagina mostri il messaggio corretto invece di un errore generico.
export type VideoEditFailReason = 'not-configured' | 'unauthorized' | 'forbidden' | 'not-found';
export type VideoEditResult =
  | { ok: true; data: VideoEditData }
  | { ok: false; reason: VideoEditFailReason };

// Riga video per la lista "Video recenti" della dashboard admin (da Supabase).
export type AdminRecentVideo = {
  id: string;
  title: string;
  thumb: string;
  ready: boolean;
};

// Riga video per la sezione "Video in evidenza" della dashboard admin.
export type AdminFeaturedVideo = {
  id: string;
  title: string;
  circuit: string;
  thumb: string;
  featured: boolean;
};

// Dati aggregati per la dashboard admin (tutto da Supabase, source of truth).
export type AdminDashboard = {
  total: number;
  recent: AdminRecentVideo[];
  videos: AdminFeaturedVideo[];
};
