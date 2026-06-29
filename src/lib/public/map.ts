// Mapper puri: righe Supabase → tipi usati dalle card (Athlete/Federation).
// Permettono di riusare AthleteCard/FederationCard senza toccarli.
import type { Athlete } from '@/types/athlete';
import type { Federation } from '@/types/federation';
import type { AthleteFull, FederationFull } from '@/lib/reference/types';

export function toAthleteCard(a: AthleteFull, sportName: string, circuit: string): Athlete {
  return {
    id: a.id,
    name: a.full_name,
    nation: a.nation ?? '',
    nationFlag: a.nation_code ?? '',
    // Vuoto se assente: PhotoFill mostra il placeholder con iniziali.
    photo: a.photo_url ?? '',
    circuit: circuit || '—',
    sport: sportName || 'Beach Volley',
    bio: a.bio ?? '',
    stats: {
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      seasonPoints: a.season_points ?? 0,
      ranking: a.ranking ?? undefined,
      circuit: circuit || '—',
      nation: a.nation ?? '',
    },
    upcomingEvents: [],
    recentMatches: [],
  };
}

export function toFederationCard(f: FederationFull, sportName: string): Federation {
  return {
    id: f.id,
    name: f.name,
    shortName: f.short_name ?? f.name,
    nation: f.nation ?? '',
    color: f.color ?? '#F04E00',
    description: f.description ?? '',
    sport: sportName || 'Beach Volley',
    contentCount: { live: 0, replay: 0, interviews: 0, highlights: 0 },
  };
}
