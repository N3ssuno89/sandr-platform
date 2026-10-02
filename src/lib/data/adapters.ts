// Adattatori: convertono le righe reali di Supabase nei tipi della gerarchia
// (src/types/hierarchy.ts). Funzioni pure, nessun accesso a rete: ricevono già
// la riga. I campi assenti nello schema reale vengono riempiti con default
// documentati (lo schema `events` è minimale e non ha serie/volto/qualità/GPS).

import type { AthleteFull, FederationFull } from '@/lib/reference/types';
import type { EventRow } from '@/lib/events/types';
import type { Athlete, Edition, Federation } from '@/types/hierarchy';

// Federazione reale → tipo gerarchia. `sportName` risolto a monte dalla mappa
// sports (lo schema ha solo sport_id).
export function federationFromRow(row: FederationFull, sportName: string): Federation {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name ?? row.name,
    nation: row.nation,
    sport: sportName,
    source: 'sandr', // nato su SANDR; l'import esterno valorizzerà source/externalId
    externalId: null,
  };
}

// Atleta reale → tipo gerarchia.
export function athleteFromRow(row: AthleteFull): Athlete {
  return {
    id: row.id,
    fullName: row.full_name,
    nation: row.nation,
    nationCode: row.nation_code,
    photoUrl: row.photo_url,
    ranking: row.ranking,
    clubId: null, // lo schema reale non ha ancora il club di tesseramento
    source: 'sandr',
    externalId: null,
  };
}

// Evento reale (tabella `events`) → Edizione. Lo schema reale non ha serie,
// volto, profilo qualità, GPS né regole diritti: default conservativi.
// `stage` non ha un campo corrispondente nella gerarchia e viene ignorato.
export function editionFromEventRow(row: EventRow): Edition {
  return {
    id: row.id,
    seriesId: null, // riga `events` non ancora collegata a una serie
    name: row.title,
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    location: row.location ?? '',
    nation: row.nation ?? '',
    coordinates: null,
    face: 'open',
    qualityProfile: 'medium',
    rights: { defaultAccess: 'free', visibility: 'public', geoblock: null, resultsOnly: false },
    registration: 'individual', // default conservativo: lo schema reale non lo ha
    source: 'sandr',
    externalId: null,
  };
}
