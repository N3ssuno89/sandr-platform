import { getTranslations } from 'next-intl/server';
import { ScrollRow } from '@/components/ui/section-row';
import { AthleteCard } from '@/components/cards/AthleteCard';
import {
  supabaseReadable,
  getFeaturedAthletes,
  getPublicFederations,
  getSportsMap,
} from '@/lib/public/queries';
import { toAthleteCard } from '@/lib/public/map';
import { mockAthletes } from '@/lib/mock-athletes';
import type { Athlete } from '@/types/athlete';

// Sezione landing "Atleti in evidenza": atleti is_featured = true da Supabase.
// MOCK FALLBACK: se Supabase non è leggibile o nessun atleta è in evidenza.
export async function LandingFeaturedAthletes() {
  const tA = await getTranslations('Athlete');

  let athletes: Athlete[] = mockAthletes;
  if (supabaseReadable()) {
    const [featured, federations, sportsMap] = await Promise.all([
      getFeaturedAthletes(),
      getPublicFederations(),
      getSportsMap(),
    ]);
    if (featured.length > 0) {
      athletes = featured.map((a) =>
        toAthleteCard(
          a,
          sportsMap.get(a.sport_id ?? '') ?? 'Beach Volley',
          federations.find((f) => f.id === a.federation_id)?.short_name ?? '—',
        ),
      );
    }
  }

  return (
    <section className="bg-[#141414] px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="font-condensed font-bold uppercase tracking-[3px] text-sandr-orange" style={{ fontSize: '11px' }}>
          {tA('featuredLabel')}
        </p>
        <h2 className="mt-3 max-w-2xl font-condensed text-3xl font-extrabold text-white sm:text-4xl">
          {tA('featuredHeading')}
        </h2>
        <div className="mt-8">
          <ScrollRow>
            {athletes.map((a) => (
              <div key={a.id} className="shrink-0 snap-start">
                <AthleteCard athlete={a} cardWidth={220} />
              </div>
            ))}
          </ScrollRow>
        </div>
      </div>
    </section>
  );
}
