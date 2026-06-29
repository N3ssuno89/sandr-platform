import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ScrollRow } from '@/components/ui/section-row';
import { AthleteCard } from '@/components/cards/AthleteCard';
import { PhotoFill } from '@/components/ui/PhotoFill';
import { AthleteVideoRows } from '@/components/sections/AthleteVideoRows';
import { getAthleteById, mockAthletes } from '@/lib/mock-athletes';
import {
  supabaseReadable,
  getPublicAthlete,
  getOtherAthletes,
  getPublicFederations,
  getSportsMap,
} from '@/lib/public/queries';
import { getAthleteVideos } from '@/lib/videos/actions';
import { toAthleteCard } from '@/lib/public/map';
import type { Athlete } from '@/types/athlete';
import type { ContentItem } from '@/types/tags';

// Profilo atleta v2: info utili e CERTE (niente stats di competizione inventate)
// + i video in cui è taggato, in righe per tipo come la home. REAL da Supabase;
// MOCK FALLBACK solo se Supabase non è configurato (dev mode).

type AthleteVM = {
  id: string;
  name: string;
  nation: string;
  nationFlag: string;
  photo: string;
  circuit: string;
  sport: string;
  bio: string;
  ranking?: number;
  age: number | null;
  videos: ContentItem[];
  others: Athlete[];
};

// Età dagli anni compiuti a partire da birth_date ('YYYY-MM-DD'). null se assente.
function calcAge(birth: string | null): number | null {
  if (!birth) return null;
  const b = new Date(birth);
  if (Number.isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
  return age >= 0 && age < 120 ? age : null;
}

export default async function AthletePage({ params }: { params: { locale: string; id: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Athlete');

  const vm = await buildVM(params.id);
  if (!vm) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#141414] px-4 text-center">
        <p className="font-condensed text-2xl uppercase text-sandr-muted">{t('notFound')}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414]">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        {/* ===== Hero ===== */}
        <section className="flex flex-col gap-8 md:flex-row">
          <div className="relative h-[300px] w-[300px] shrink-0 overflow-hidden rounded-xl">
            <PhotoFill src={vm.photo} name={vm.name} />
          </div>

          <div className="flex-1">
            {/* Ranking mondiale (solo se valorizzato) — oro */}
            {vm.ranking ? (
              <span className="inline-block rounded-full border border-[#F0A800]/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#F0A800]">
                {t('worldRanking')} #{vm.ranking}
              </span>
            ) : null}

            <h1 className="mt-3 font-condensed text-5xl font-black uppercase leading-none text-white md:text-6xl">
              {vm.name}
            </h1>

            {/* Nazione + età */}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#C0BDB8]">
              {vm.nation ? (
                <span>
                  {vm.nationFlag ? <span className="font-bold text-white">{vm.nationFlag}</span> : null}
                  {vm.nationFlag ? ' · ' : ''}
                  {vm.nation}
                </span>
              ) : null}
              {vm.age !== null ? (
                <>
                  {vm.nation ? <span className="text-[#555555]">•</span> : null}
                  <span>{t('age', { age: vm.age })}</span>
                </>
              ) : null}
            </div>

            {/* Sport + federazione */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sandr-text">
                {vm.sport}
              </span>
              {vm.circuit && vm.circuit !== '—' ? (
                <span className="rounded-full bg-sandr-orange px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
                  {vm.circuit}
                </span>
              ) : null}
            </div>

            {vm.bio ? <p className="mt-4 max-w-2xl text-[15px] text-[#C0BDB8]">{vm.bio}</p> : null}
          </div>
        </section>

        {/* ===== Video taggati (righe per tipo, come la home) ===== */}
        <section className="mt-14">
          <AthleteVideoRows videos={vm.videos} />
        </section>

        {/* ===== Altri atleti ===== */}
        {vm.others.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">{t('others')}</h2>
            <ScrollRow>
              {vm.others.map((a) => (
                <div key={a.id} className="mt-4 shrink-0 snap-start">
                  <AthleteCard athlete={a} cardWidth={220} />
                </div>
              ))}
            </ScrollRow>
          </section>
        ) : null}
      </div>
    </div>
  );
}

// Costruisce il view model da Supabase, con fallback ai dati mock (dev mode).
async function buildVM(id: string): Promise<AthleteVM | null> {
  if (!supabaseReadable()) {
    // MOCK FALLBACK: shown only when Supabase is not configured (dev mode)
    const a = getAthleteById(id);
    if (!a) return null;
    return {
      id: a.id,
      name: a.name,
      nation: a.nation,
      nationFlag: a.nationFlag,
      photo: a.photo,
      circuit: a.circuit,
      sport: a.sport,
      bio: a.bio,
      ranking: a.stats.ranking,
      age: null,
      videos: [],
      others: mockAthletes.filter((x) => x.id !== a.id).slice(0, 4),
    };
  }

  const athlete = await getPublicAthlete(id);
  if (!athlete) return null;

  const [federations, sportsMap, videos, otherRows] = await Promise.all([
    getPublicFederations(),
    getSportsMap(),
    getAthleteVideos(athlete.id),
    getOtherAthletes(athlete.id, 6),
  ]);

  const fedShort = (fid: string | null) => federations.find((f) => f.id === fid)?.short_name ?? '—';
  const sportName = (sid: string | null) => sportsMap.get(sid ?? '') ?? 'Beach Volley';
  const circuit = fedShort(athlete.federation_id);

  return {
    id: athlete.id,
    name: athlete.full_name,
    nation: athlete.nation ?? '',
    nationFlag: athlete.nation_code ?? '',
    photo: athlete.photo_url ?? '',
    circuit,
    sport: sportName(athlete.sport_id),
    bio: athlete.bio ?? '',
    ranking: athlete.ranking ?? undefined,
    age: calcAge(athlete.birth_date),
    videos,
    others: otherRows.map((o) => toAthleteCard(o, sportName(o.sport_id), fedShort(o.federation_id))),
  };
}
