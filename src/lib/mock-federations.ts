import type { Federation } from '@/types/federation';

// Federazioni/circuiti mock (placeholder). shortName combacia con il valore
// "circuit" dei contenuti/atleti mock per consentire il filtraggio.
export const mockFederations: Federation[] = [
  {
    id: 'fipav',
    name: 'Federazione Italiana Pallavolo',
    shortName: 'FIPAV',
    nation: 'Italia',
    color: '#0066CC',
    description: 'Il beach volley italiano: campionati nazionali, tappe e finali tricolori.',
    sport: 'Beach Volley',
    contentCount: { live: 4, replay: 18, interviews: 6, highlights: 9 },
  },
  {
    id: 'aibvc',
    name: 'AIBVC Italian Tour',
    shortName: 'AIBVC',
    nation: 'Italia',
    color: '#F04E00',
    description: 'Il circuito professionistico italiano di beach volley.',
    sport: 'Beach Volley',
    contentCount: { live: 3, replay: 12, interviews: 4, highlights: 7 },
  },
  {
    id: 'avp',
    name: 'Association of Volleyball Professionals',
    shortName: 'AVP',
    nation: 'USA',
    color: '#C8102E',
    description: 'Il principale circuito americano di beach volley.',
    sport: 'Beach Volley',
    contentCount: { live: 5, replay: 22, interviews: 8, highlights: 11 },
  },
  {
    id: 'bpt',
    name: 'Beach Pro Tour (FIVB)',
    shortName: 'BPT',
    nation: 'International',
    color: '#00A651',
    description: 'Il circuito internazionale FIVB: le tappe che contano nel mondo.',
    sport: 'Beach Volley',
    contentCount: { live: 6, replay: 28, interviews: 10, highlights: 14 },
  },
  {
    id: 'cev',
    name: 'Confédération Européenne de Volleyball',
    shortName: 'CEV',
    nation: 'Europe',
    color: '#003087',
    description: 'La confederazione europea: Europei e tappe continentali.',
    sport: 'Beach Volley',
    contentCount: { live: 2, replay: 14, interviews: 5, highlights: 8 },
  },
  {
    id: 'king-queen',
    name: 'King & Queen of the Court',
    shortName: 'King & Queen',
    nation: 'Italia',
    color: '#F0A800',
    description: 'Il circuito premium e spettacolare del beach volley italiano.',
    sport: 'Beach Volley',
    contentCount: { live: 1, replay: 8, interviews: 3, highlights: 5 },
  },
  {
    id: 'marathon',
    name: 'Marathon Beach Tour',
    shortName: 'Marathon',
    nation: 'Italia',
    color: '#7B2D8B',
    description: 'Il tour itinerante lungo le spiagge italiane.',
    sport: 'Beach Volley',
    contentCount: { live: 2, replay: 10, interviews: 2, highlights: 6 },
  },
  {
    id: 'beach-tennis-italy',
    name: 'Beach Tennis Italy',
    shortName: 'BT Italy',
    nation: 'Italia',
    color: '#1DB954',
    description: 'Il meglio del beach tennis italiano e internazionale.',
    sport: 'Beach Tennis',
    contentCount: { live: 2, replay: 9, interviews: 3, highlights: 4 },
  },
];

export function getFederationById(id: string): Federation | undefined {
  return mockFederations.find((f) => f.id === id);
}
