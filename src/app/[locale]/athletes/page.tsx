import { setRequestLocale } from 'next-intl/server';
import { AthletesIndex } from '@/components/sections/AthletesIndex';
import { supabaseReadable, getPublicAthletes, getPublicFederations, getSportsMap } from '@/lib/public/queries';
import { toAthleteCard } from '@/lib/public/map';
import { mockAthletes } from '@/lib/mock-athletes';
import type { Athlete } from '@/types/athlete';

// Indice atleti pubblico. REAL da Supabase; MOCK FALLBACK se non configurato/vuoto.
export default async function AthletesIndexPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  let athletes: Athlete[] = mockAthletes;
  if (supabaseReadable()) {
    const [rows, feds, sportsMap] = await Promise.all([
      getPublicAthletes(),
      getPublicFederations(),
      getSportsMap(),
    ]);
    if (rows.length > 0) {
      athletes = rows.map((a) =>
        toAthleteCard(
          a,
          sportsMap.get(a.sport_id ?? '') ?? 'Beach Volley',
          feds.find((f) => f.id === a.federation_id)?.short_name ?? '—',
        ),
      );
    }
  }

  return <AthletesIndex athletes={athletes} />;
}
