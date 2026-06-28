import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ScrollRow } from '@/components/ui/section-row';
import { AthleteCard } from '@/components/cards/AthleteCard';
import { ReminderButton } from '@/components/sections/ReminderButton';
import { getAthleteById, mockAthletes } from '@/lib/mock-athletes';
import {
  supabaseReadable,
  getPublicAthlete,
  getOtherAthletes,
  getPublicFederations,
  getSportsMap,
  getAthleteUpcomingEvents,
  getAthleteRecentMatches,
} from '@/lib/public/queries';
import { toAthleteCard } from '@/lib/public/map';
import type { Athlete } from '@/types/athlete';

// Pagina profilo atleta. REAL da Supabase (atleti, eventi via federazione,
// match completati). MOCK FALLBACK: solo se Supabase non è configurato (dev).
// AREA CRITICA (CLAUDE.md): dati Supabase pubblici.

type UpcomingVM = { id: string; title: string; circuit: string; dateLabel: string; location: string };
type MatchVM = { id: string; label: string; result: 'W' | 'L'; date: string; videoId: string | null };
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
  matchesPlayed: number;
  wins: number;
  winRate: number;
  seasonPoints: number;
  upcoming: UpcomingVM[];
  matches: MatchVM[];
  others: Athlete[];
};

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

  const statBoxes = [
    { label: t('stats.matches'), value: String(vm.matchesPlayed) },
    { label: t('stats.wins'), value: String(vm.wins) },
    { label: t('stats.winRate'), value: `${vm.winRate}%` },
    { label: t('stats.seasonPoints'), value: vm.seasonPoints.toLocaleString() },
  ];

  return (
    <div className="bg-[#141414]">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        {/* ===== Hero ===== */}
        <section className="flex flex-col gap-8 md:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vm.photo} alt={vm.name} className="h-[300px] w-[300px] shrink-0 rounded-xl object-cover" />

          <div className="flex-1">
            {vm.ranking ? (
              <span className="inline-block rounded-full border border-[#F0A800]/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#F0A800]">
                {t('ranking')} #{vm.ranking}
              </span>
            ) : null}

            <h1 className="mt-3 font-condensed text-5xl font-black uppercase leading-none text-white md:text-6xl">{vm.name}</h1>
            <p className="mt-2 text-sm text-[#888888]">{vm.nationFlag} · {vm.nation}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sandr-text">{vm.sport}</span>
              <span className="rounded-full bg-sandr-orange px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">{vm.circuit}</span>
            </div>
            {vm.bio ? <p className="mt-4 max-w-2xl text-[15px] text-[#C0BDB8]">{vm.bio}</p> : null}

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statBoxes.map((s) => (
                <div key={s.label} className="rounded-lg bg-[#1C1C1C] p-4 text-center">
                  <p className="font-condensed text-[11px] uppercase tracking-wide text-[#888888]">{s.label}</p>
                  <p className="mt-1 font-condensed text-[28px] font-extrabold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Eventi + Match ===== */}
        <section className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Prossimi eventi (REAL via federazione) */}
          <div>
            <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">{t('upcoming')}</h2>
            {vm.upcoming.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {vm.upcoming.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-[#1C1C1C] p-4">
                    <div>
                      {e.dateLabel ? (
                        <span className="inline-block rounded bg-sandr-orange px-2 py-0.5 text-[11px] font-bold uppercase text-black">{e.dateLabel}</span>
                      ) : null}
                      <p className="mt-2 font-condensed text-[15px] font-bold uppercase tracking-wide text-white">{e.title}</p>
                      <p className="text-[13px] text-[#888888]">{e.circuit} · {e.location}</p>
                    </div>
                    <ReminderButton />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-[#888888]">Nessun evento in programma</p>
            )}
          </div>

          {/* Match recenti (REAL completati) */}
          <div>
            <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">{t('recent')}</h2>
            {vm.matches.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {vm.matches.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-[#1C1C1C] p-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${m.result === 'W' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {m.result}
                      </span>
                      <div>
                        <p className="font-condensed text-[15px] font-bold uppercase tracking-wide text-white">{m.label}</p>
                        <p className="text-[13px] text-[#888888]">{m.date}</p>
                      </div>
                    </div>
                    {m.videoId ? (
                      <Link href={`/vod/${m.videoId}`} className="shrink-0 text-[13px] font-semibold uppercase tracking-wide text-sandr-orange hover:text-sandr-text">
                        {t('watchReplay')}
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-[#888888]">Nessun match recente</p>
            )}
          </div>
        </section>

        {/* ===== Altri atleti ===== */}
        {vm.others.length > 0 ? (
          <section className="mt-12">
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
      matchesPlayed: a.stats.matchesPlayed,
      wins: a.stats.wins,
      winRate: a.stats.winRate,
      seasonPoints: a.stats.seasonPoints,
      upcoming: a.upcomingEvents.map((e) => ({ id: e.id, title: e.title, circuit: e.circuit, dateLabel: e.date, location: e.location })),
      matches: a.recentMatches.map((m) => ({ id: m.id, label: m.title, result: m.result, date: m.date, videoId: m.id })),
      others: mockAthletes.filter((x) => x.id !== a.id).slice(0, 4),
    };
  }

  const athlete = await getPublicAthlete(id);
  if (!athlete) return null;

  const [federations, sportsMap, upcoming, matches, otherRows] = await Promise.all([
    getPublicFederations(),
    getSportsMap(),
    getAthleteUpcomingEvents(athlete.federation_id),
    getAthleteRecentMatches(athlete.id),
    getOtherAthletes(athlete.id, 6),
  ]);

  const fedShort = (fid: string | null) => federations.find((f) => f.id === fid)?.short_name ?? '—';
  const sportName = (sid: string | null) => sportsMap.get(sid ?? '') ?? 'Beach Volley';
  const circuit = fedShort(athlete.federation_id);

  const wins = matches.filter((m) => m.result === 'W').length;
  const played = matches.length;

  return {
    id: athlete.id,
    name: athlete.full_name,
    nation: athlete.nation ?? '',
    nationFlag: athlete.nation_code ?? '',
    photo: athlete.photo_url ?? '/logo.png',
    circuit,
    sport: sportName(athlete.sport_id),
    bio: athlete.bio ?? '',
    ranking: athlete.ranking ?? undefined,
    matchesPlayed: played,
    wins,
    winRate: played > 0 ? Math.round((wins / played) * 100) : 0,
    seasonPoints: athlete.season_points ?? 0,
    upcoming: upcoming.map((e) => ({ id: e.id, title: e.title, circuit, dateLabel: e.dateRange, location: e.location })),
    matches: matches.map((m) => ({ id: m.id, label: `${m.teamA} vs ${m.teamB}`, result: m.result, date: m.date, videoId: m.videoId })),
    others: otherRows.map((o) => toAthleteCard(o, sportName(o.sport_id), fedShort(o.federation_id))),
  };
}
