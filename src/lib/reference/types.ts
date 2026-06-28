// Tipi dati di riferimento (sport, federazioni, atleti) per i dropdown admin.
export type SportRef = { id: string; name: string; slug: string };

export type FederationRef = {
  id: string;
  name: string;
  short_name: string | null;
  slug: string;
  sport_id: string | null;
  nation: string | null;
  color: string | null;
};

export type AthleteRef = {
  id: string;
  full_name: string;
  nation: string | null;
  sport_id: string | null;
  federation_id: string | null;
};

// Riga atleta completa (gestione admin).
export type AthleteFull = {
  id: string;
  full_name: string;
  nation: string | null;
  nation_code: string | null;
  photo_url: string | null;
  sport_id: string | null;
  federation_id: string | null;
  bio: string | null;
  ranking: number | null;
  season_points: number | null;
};

export type AthleteInput = {
  full_name: string;
  nation?: string;
  nation_code?: string;
  photo_url?: string;
  sport_id?: string;
  federation_id?: string;
  bio?: string;
  ranking?: number;
  season_points?: number;
};

// Riga federazione completa (gestione admin).
export type FederationFull = {
  id: string;
  name: string;
  short_name: string | null;
  slug: string;
  sport_id: string | null;
  nation: string | null;
  color: string | null;
  logo_url: string | null;
  description: string | null;
};

export type FederationInput = {
  name: string;
  short_name?: string;
  sport_id?: string;
  nation?: string;
  color?: string;
  description?: string;
  logo_url?: string;
};

// Esito generico delle server action (niente throw verso il client).
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };
export type DeleteResult = { ok: true } | { ok: false; error: string };
