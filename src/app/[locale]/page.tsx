import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { LiveEventCard } from '@/components/cards/LiveEventCard';
import { VodCard } from '@/components/cards/VodCard';
import { UpcomingCard } from '@/components/cards/UpcomingCard';
import { RowHeader, ScrollRow } from '@/components/ui/section-row';

// Circuiti gestiti (vedi CLAUDE.md). Nomi propri: non tradotti.
const circuits = [
  'BPT Futures',
  'BPT Challenge',
  'BPT Elite',
  'AIBVC Tour',
  'FIPAV',
  'Campionato Italiano',
  'Marathon',
  'King & Queen',
];

// Dati placeholder: nessun fetch reale. Da sostituire con query Supabase.
const liveEvents = [
  { id: '1', title: 'BPT Elite — Quarterfinal', teamA: 'Mol / Sørum', teamB: 'Plavins / Tocs', sport: 'Beach Volley', viewers: 12840 },
  { id: '2', title: 'AIBVC Tour — Semifinal', teamA: 'Carambula / Cottafava', teamB: 'Åhman / Hellvig', sport: 'Beach Volley', viewers: 8210 },
  { id: '3', title: 'Padel Pro — Round 2', teamA: 'Galán / Chingotto', teamB: 'Tapia / Coello', sport: 'Padel', viewers: 9450 },
];

const replays = [
  { id: '1', title: 'BPT Challenge — Final', date: '12 Jun 2026', duration: '1:42:10', access: 'premium' as const },
  { id: '2', title: 'King & Queen — Highlights', date: '08 Jun 2026', duration: '0:14:32', access: 'free' as const },
  { id: '3', title: 'Campionato Italiano — Day 2', date: '01 Jun 2026', duration: '2:05:48', access: 'premium' as const },
  { id: '4', title: 'Marathon — Semifinal', date: '25 May 2026', duration: '1:18:22', access: 'free' as const },
];

const circuitCounts = [
  { name: 'BPT Elite', count: 12 },
  { name: 'BPT Challenge', count: 8 },
  { name: 'AIBVC Tour', count: 6 },
  { name: 'FIPAV', count: 9 },
  { name: 'Campionato Italiano', count: 5 },
  { name: 'King & Queen', count: 4 },
];

const upcoming = [
  { id: '1', date: '28 Jun', time: '18:00', teamA: 'Mol / Sørum', teamB: 'Ranghieri / Carambula', circuit: 'BPT Elite' },
  { id: '2', date: '29 Jun', time: '20:30', teamA: 'Gori / Cattaneo', teamB: 'Benede / Ramos', circuit: 'AIBVC Tour' },
  { id: '3', date: '01 Jul', time: '17:15', teamA: 'Nicolai / Cottafava', teamB: 'Åhman / Hellvig', circuit: 'FIPAV' },
];

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Landing');
  const tc = useTranslations('Common');

  return (
    <>
      {/* ===== Hero (stile DAZN) ===== */}
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#141414]">
        {/* Atleti ritagliati, ancorati in basso a destra (nascosti su mobile) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[70%] md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/athletes/6.png" alt="" className="absolute bottom-0 left-[6%] h-[78%] w-auto object-contain object-bottom" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/athletes/3.png" alt="" className="absolute bottom-0 left-[34%] h-[86%] w-auto object-contain object-bottom" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/athletes/1.png" alt="" className="absolute bottom-0 right-[2%] h-[92%] w-auto object-contain object-bottom" />
        </div>

        {/* Overlay gradiente: il testo resta leggibile a sinistra */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #141414 40%, transparent 75%)' }}
        />

        {/* Testo + CTA */}
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-4 text-center md:items-start md:text-left">
          <p className="font-condensed font-bold uppercase text-[#F04E00]" style={{ fontSize: '11px', letterSpacing: '3px' }}>
            {t('eyebrow')}
          </p>
          <h1 className="mt-4 font-condensed text-5xl font-black uppercase leading-[0.95] text-white sm:text-7xl lg:text-8xl" style={{ letterSpacing: '-2px' }}>
            {t('headline1')}
            <br />
            {t('headline2')}
          </h1>
          <p className="mt-6 max-w-md text-base text-[#C0BDB8]">{t('subline')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/live"
              className="rounded bg-[#F04E00] px-7 py-3 text-center font-condensed font-bold uppercase tracking-wide text-black"
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              href="/pricing"
              className="rounded border border-[#F04E00] px-7 py-3 text-center font-condensed font-bold uppercase tracking-wide text-[#F04E00]"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Barra circuiti (scroll orizzontale) ===== */}
      <div className="border-b border-white/[0.08] bg-[#1C1C1C]">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4">
          <div className="flex gap-2 whitespace-nowrap py-3">
            {circuits.map((c, i) => (
              <span
                key={c}
                className={`shrink-0 rounded-full px-4 py-1.5 font-condensed text-sm uppercase tracking-wide ${
                  i === 0 ? 'bg-[#F04E00] text-black' : 'text-sandr-muted'
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== LIVE ORA ===== */}
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

      {/* ===== SANDR REPLAY ===== */}
      <section className="border-t border-white/[0.08] bg-sandr-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <RowHeader title={t('replay')} href="/vod" viewAll={t('viewAll')} />
          <ScrollRow>
            {replays.map((v) => (
              <div key={v.id} className="min-w-[70%] shrink-0 snap-start sm:min-w-[260px]">
                <VodCard {...v} />
              </div>
            ))}
          </ScrollRow>
        </div>
      </section>

      {/* ===== I CIRCUITI ===== */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <RowHeader title={t('circuits')} href="/live" viewAll={t('viewAll')} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {circuitCounts.map((c) => (
            <div
              key={c.name}
              className="rounded-lg border border-white/10 bg-[#1C1C1C] p-4 transition-colors hover:border-[#F04E00]/60"
            >
              <p className="font-condensed text-base uppercase tracking-wide text-sandr-text">{c.name}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-[#F04E00]">
                {c.count} {t('matches')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROSSIMI EVENTI ===== */}
      <section className="border-t border-white/[0.08] bg-sandr-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <RowHeader title={t('upcoming')} href="/live" viewAll={t('viewAll')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((u) => (
              <UpcomingCard key={u.id} {...u} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
