import { setRequestLocale, getTranslations } from 'next-intl/server';
import { FederationContent } from '@/components/sections/FederationContent';
import type { EventView } from '@/lib/public/queries';
import {
  supabaseReadable,
  getPublicFederation,
  getSportsMap,
  getFederationVideos,
  getFederationAthletes,
  getFederationEvents,
} from '@/lib/public/queries';
import { toAthleteCard } from '@/lib/public/map';
import { getFederationById } from '@/lib/mock-federations';
import { mockContent } from '@/lib/mock-content';
import { mockAthletes } from '@/lib/mock-athletes';
import type { Athlete } from '@/types/athlete';
import type { ContentItem } from '@/types/tags';

// Pagina federazione/circuito. REAL da Supabase (federazione, video filtrati,
// atleti, calendario eventi). MOCK FALLBACK: solo se Supabase non configurato.
// AREA CRITICA (CLAUDE.md): dati Supabase pubblici.

type FedVM = {
  id: string;
  shortName: string;
  name: string;
  description: string;
  color: string;
  videos: ContentItem[];
  athletes: Athlete[];
  events: EventView[];
};

export default async function FederationPage({ params }: { params: { locale: string; id: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Federation');

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
      <section className="relative bg-[#141414]">
        <div className="absolute inset-0" style={{ backgroundColor: `${vm.color}33` }} />
        <div className="relative mx-auto flex h-[400px] max-w-6xl flex-col justify-center px-4">
          <p className="font-condensed text-[64px] font-black uppercase leading-none text-white md:text-[80px]">{vm.shortName}</p>
          <p className="mt-2 text-lg text-[#C0BDB8]">{vm.name}</p>
          {vm.description ? <p className="mt-3 max-w-2xl text-[15px] text-[#C0BDB8]">{vm.description}</p> : null}
          <button type="button" className="mt-6 w-fit rounded-lg border border-white/20 px-6 py-3 font-condensed font-bold uppercase tracking-wide text-white">
            {t('follow')}
          </button>
        </div>
      </section>

      <FederationContent fedId={vm.id} videos={vm.videos} athletes={vm.athletes} events={vm.events} />
    </div>
  );
}

async function buildVM(id: string): Promise<FedVM | null> {
  if (!supabaseReadable()) {
    // MOCK FALLBACK: shown only when Supabase is not configured (dev mode)
    const f = getFederationById(id);
    if (!f) return null;
    return {
      id: f.id,
      shortName: f.shortName,
      name: f.name,
      description: f.description,
      color: f.color,
      videos: mockContent.filter((c) => c.circuit === f.shortName),
      athletes: mockAthletes.filter((a) => a.circuit === f.shortName),
      events: [],
    };
  }

  const fed = await getPublicFederation(id);
  if (!fed) return null;

  const sportsMap = await getSportsMap();
  const sportName = sportsMap.get(fed.sport_id ?? '') ?? 'Beach Volley';
  const short = fed.short_name ?? fed.name;

  const [videos, athleteRows, events] = await Promise.all([
    getFederationVideos(fed.id, short, sportName),
    getFederationAthletes(fed.id),
    getFederationEvents(fed.id),
  ]);

  return {
    id: fed.id,
    shortName: short,
    name: fed.name,
    description: fed.description ?? '',
    color: fed.color ?? '#F04E00',
    videos,
    athletes: athleteRows.map((a) => toAthleteCard(a, sportName, short)),
    events,
  };
}
