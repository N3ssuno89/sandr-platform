import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { LiveEventCard } from '@/components/cards/LiveEventCard';
import { VodCard } from '@/components/cards/VodCard';
import { UpcomingCard } from '@/components/cards/UpcomingCard';
import { RowHeader, ScrollRow } from '@/components/ui/section-row';

// Homepage autenticata (stile DAZN post-login). Rotta sotto /dashboard:
// protetta dal middleware. Dati placeholder, nessuna logica di business.
const featured = {
  id: '1',
  title: 'BPT Elite — Final',
  teamA: 'Mol / Sørum',
  teamB: 'Plavins / Tocs',
  viewers: 18420,
};

const liveEvents = [
  { id: '1', title: 'BPT Elite — Final', teamA: 'Mol / Sørum', teamB: 'Plavins / Tocs', sport: 'Beach Volley', viewers: 18420 },
  { id: '2', title: 'AIBVC Tour — Semifinal', teamA: 'Carambula / Cottafava', teamB: 'Åhman / Hellvig', sport: 'Beach Volley', viewers: 8210 },
  { id: '3', title: 'Padel Pro — Round 2', teamA: 'Galán / Chingotto', teamB: 'Tapia / Coello', sport: 'Padel', viewers: 9450 },
];

const continueWatching = [
  { id: '1', title: 'BPT Challenge — Final', date: '12 Jun 2026', duration: '1:42:10', access: 'premium' as const, progress: 0.4 },
  { id: '2', title: 'Campionato Italiano — Day 2', date: '01 Jun 2026', duration: '2:05:48', access: 'premium' as const, progress: 0.7 },
  { id: '3', title: 'Marathon — Semifinal', date: '25 May 2026', duration: '1:18:22', access: 'free' as const, progress: 0.2 },
];

const replays = [
  { id: '1', title: 'King & Queen — Highlights', date: '08 Jun 2026', duration: '0:14:32', access: 'free' as const },
  { id: '2', title: 'SANDR Beach Tennis Open — Final', date: '28 May 2026', duration: '1:12:05', access: 'premium' as const },
  { id: '3', title: 'AIBVC Tour — Quarterfinal', date: '22 May 2026', duration: '1:31:18', access: 'premium' as const },
  { id: '4', title: 'Padel Pro — Final', date: '20 May 2026', duration: '1:33:40', access: 'free' as const },
];

const sports = ['Beach Volley', 'Beach Tennis'];

const upcoming = [
  { id: '1', date: '28 Jun', time: '18:00', teamA: 'Mol / Sørum', teamB: 'Ranghieri / Carambula', circuit: 'BPT Elite' },
  { id: '2', date: '29 Jun', time: '20:30', teamA: 'Gori / Cattaneo', teamB: 'Benede / Ramos', circuit: 'AIBVC Tour' },
  { id: '3', date: '01 Jul', time: '17:15', teamA: 'Nicolai / Cottafava', teamB: 'Åhman / Hellvig', circuit: 'FIPAV' },
];

export default function AuthHomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('AuthHome');
  const tc = useTranslations('Common');

  return (
    <>
      {/* ===== Banner match in evidenza ===== */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#1C1C1C]">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #141414, transparent)' }} />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16 md:py-24">
          <span className="inline-flex items-center gap-2 rounded bg-black/60 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-sandr-text">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            Live
          </span>
          <h1 className="font-condensed text-4xl font-black uppercase leading-[0.95] text-white md:text-6xl" style={{ letterSpacing: '-1px' }}>
            {featured.title}
          </h1>
          <p className="text-lg text-[#C0BDB8]">
            <span className="text-sandr-text">{featured.teamA}</span> vs{' '}
            <span className="text-sandr-text">{featured.teamB}</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-sandr-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F04E00]" />
            {featured.viewers.toLocaleString()} {t('watching')}
          </p>
          <Link
            href={`/live/${featured.id}`}
            className="mt-2 rounded bg-[#F04E00] px-8 py-3 font-condensed font-bold uppercase tracking-wide text-black"
          >
            {t('watchNow')}
          </Link>
        </div>
      </section>

      {/* ===== IN DIRETTA ORA ===== */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <RowHeader title={t('liveNow')} href="/live" viewAll={t('viewAll')} live />
        <ScrollRow>
          {liveEvents.map((e) => (
            <div key={e.id} className="min-w-[82%] shrink-0 snap-start sm:min-w-[320px]">
              <LiveEventCard {...e} viewersLabel={t('watching')} href={`/live/${e.id}`} ctaLabel={tc('watch')} />
            </div>
          ))}
        </ScrollRow>
      </section>

      {/* ===== CONTINUA A GUARDARE ===== */}
      <section className="border-t border-white/[0.08] bg-sandr-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <RowHeader title={t('continueWatching')} href="/vod" viewAll={t('viewAll')} />
          <ScrollRow>
            {continueWatching.map((v) => (
              <div key={v.id} className="min-w-[70%] shrink-0 snap-start sm:min-w-[260px]">
                <VodCard {...v} />
              </div>
            ))}
          </ScrollRow>
        </div>
      </section>

      {/* ===== SANDR REPLAY — Recenti ===== */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <RowHeader title={t('replayRecent')} href="/vod" viewAll={t('viewAll')} />
        <ScrollRow>
          {replays.map((v) => (
            <div key={v.id} className="min-w-[70%] shrink-0 snap-start sm:min-w-[260px]">
              <VodCard {...v} />
            </div>
          ))}
        </ScrollRow>
      </section>

      {/* ===== I TUOI SPORT ===== */}
      <section className="border-t border-white/[0.08] bg-sandr-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <RowHeader title={t('yourSports')} href="/live" viewAll={t('viewAll')} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sports.map((s) => (
              <div
                key={s}
                className="flex h-28 items-end rounded-lg border border-white/10 bg-gradient-to-br from-[#F04E00]/20 to-transparent p-4"
              >
                <span className="font-condensed text-lg uppercase tracking-wide text-sandr-text">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROSSIMI EVENTI ===== */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <RowHeader title={t('upcoming')} href="/live" viewAll={t('viewAll')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((u) => (
            <UpcomingCard key={u.id} {...u} />
          ))}
        </div>
      </section>
    </>
  );
}
