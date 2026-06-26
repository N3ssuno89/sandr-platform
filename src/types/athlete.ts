// Tipi per i profili atleta SANDR.

export interface AthleteStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  seasonPoints: number;
  ranking?: number;
  circuit: string;
  nation: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  circuit: string;
  date: string;
  location: string;
}

export interface Athlete {
  id: string;
  name: string;
  nation: string;
  // Codice nazione testuale (niente emoji, vedi CLAUDE.md): es. "IT", "USA".
  nationFlag: string;
  photo: string;
  circuit: string;
  sport: string;
  stats: AthleteStats;
  upcomingEvents: UpcomingEvent[];
  recentMatches: { id: string; title: string; result: 'W' | 'L'; date: string }[];
  bio: string;
}
