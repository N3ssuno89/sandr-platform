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

// Esito generico delle server action (niente throw verso il client).
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };
