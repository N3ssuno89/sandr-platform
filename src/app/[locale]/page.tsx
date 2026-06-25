import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { LiveEventCard } from '@/components/cards/LiveEventCard';
import { VodCard } from '@/components/cards/VodCard';

// Dati placeholder: nessun fetch reale. Da sostituire con query Supabase.
const liveEvents = [
  {
    id: '1',
    title: 'BPT Elite — Quarterfinal',
    teamA: 'Mol / Sørum',
    teamB: 'Plavins / Tocs',
    sport: 'Beach Volley',
    viewers: 12840,
  },
  {
    id: '2',
    title: 'AIBVC Tour — Semifinal',
    teamA: 'Carambula / Cottafava',
    teamB: 'Åhman / Hellvig',
    sport: 'Beach Volley',
    viewers: 8210,
  },
  {
    id: '3',
    title: 'FIPAV — Round of 16',
    teamA: 'Nicolai / Cottafava',
    teamB: 'Ranghieri / Carambula',
    sport: 'Beach Volley',
    viewers: 5430,
  },
];

const replays = [
  { id: '1', title: 'BPT Challenge — Final', date: '12 Jun 2026', duration: '1:42:10', access: 'premium' as const },
  { id: '2', title: 'King & Queen — Highlights', date: '08 Jun 2026', duration: '0:14:32', access: 'free' as const },
  { id: '3', title: 'Campionato Italiano — Day 2', date: '01 Jun 2026', duration: '2:05:48', access: 'premium' as const },
  { id: '4', title: 'Marathon — Semifinal', date: '25 May 2026', duration: '1:18:22', access: 'free' as const },
];

// Circuiti gestiti (vedi CLAUDE.md).
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

const featureKeys = ['streaming', 'stats', 'multilang'] as const;
const pricingTiers = ['free', 'premium', 'ppv'] as const;

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Home');
  const tc = useTranslations('Common');
  const tp = useTranslations('Pricing');

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sandr-surface to-sandr-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,80,10,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-36">
          <p className="font-condensed text-sm uppercase tracking-[0.3em] text-sandr-orange">
            {t('hero.eyebrow')}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl uppercase leading-tight text-sandr-text sm:text-5xl md:text-7xl md:leading-none">
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-xl text-base text-sandr-muted sm:text-lg">{t('hero.subtitle')}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/live"
              className="rounded bg-sandr-orange px-6 py-3 text-center font-condensed font-semibold uppercase tracking-wide text-sandr-text"
            >
              {t('hero.ctaPrimary')}
            </Link>
            <Link
              href="/pricing"
              className="rounded border border-white/20 px-6 py-3 text-center font-condensed font-semibold uppercase tracking-wide text-sandr-text hover:border-white/40"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Live ora */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl uppercase text-sandr-text md:text-4xl">{t('liveNow.title')}</h2>
            <p className="mt-2 text-sandr-muted">{t('liveNow.subtitle')}</p>
          </div>
          <Link href="/live" className="hidden font-condensed uppercase tracking-wide text-sandr-orange hover:text-sandr-text sm:block">
            {tc('watchLive')}
          </Link>
        </div>
        {/* Scroll orizzontale su mobile, griglia su desktop */}
        <div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
          {liveEvents.map((e) => (
            <div key={e.id} className="min-w-[85%] shrink-0 snap-start sm:min-w-0 sm:shrink">
              <LiveEventCard
                {...e}
                viewersLabel={t('liveNow.watching')}
                href={`/live/${e.id}`}
                ctaLabel={tc('watch')}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Replay / VOD */}
      <section className="border-t border-white/10 bg-sandr-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl uppercase text-sandr-text md:text-4xl">{t('replays.title')}</h2>
              <p className="mt-2 text-sandr-muted">{t('replays.subtitle')}</p>
            </div>
            <Link href="/vod" className="hidden font-condensed uppercase tracking-wide text-sandr-orange hover:text-sandr-text sm:block">
              {t('replays.viewAll')}
            </Link>
          </div>
          {/* Scroll orizzontale su mobile, griglia su desktop */}
          <div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {replays.map((v) => (
              <div key={v.id} className="min-w-[70%] shrink-0 snap-start sm:min-w-0 sm:shrink">
                <VodCard {...v} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sport / Circuiti */}
      <section id="sports" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl uppercase text-sandr-text md:text-4xl">{t('sports.title')}</h2>
        <p className="mt-2 text-sandr-muted">{t('sports.subtitle')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {circuits.map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/10 bg-sandr-surface px-4 py-2 font-condensed uppercase tracking-wide text-sandr-muted"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* 5. Perché SANDR / Features */}
      <section className="border-y border-white/10 bg-sandr-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="max-w-2xl text-3xl uppercase text-sandr-text md:text-4xl">{t('features.title')}</h2>
          <p className="mt-2 max-w-xl text-sandr-muted">{t('features.subtitle')}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featureKeys.map((k) => (
              <div key={k} className="rounded-lg border border-white/10 bg-sandr-black p-6">
                <h3 className="text-xl text-sandr-text">{t(`features.items.${k}.title`)}</h3>
                <p className="mt-2 text-sm text-sandr-muted">{t(`features.items.${k}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Anteprima abbonamenti */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl uppercase text-sandr-text md:text-4xl">{t('pricing.title')}</h2>
        <p className="mt-2 text-sandr-muted">{t('pricing.subtitle')}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div key={tier} className="rounded-lg border border-white/10 bg-sandr-surface p-6">
              <h3 className="text-2xl text-sandr-text">{tp(tier)}</h3>
              <Link
                href="/pricing"
                className="mt-6 inline-block font-condensed uppercase tracking-wide text-sandr-orange hover:text-sandr-text"
              >
                {t('pricing.cta')}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA finale / Join */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h2 className="text-4xl uppercase text-sandr-text md:text-5xl">{t('join.title')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sandr-muted">{t('join.subtitle')}</p>
          <Link
            href="/pricing"
            className="mt-8 inline-block rounded bg-sandr-orange px-8 py-3 font-condensed font-semibold uppercase tracking-wide text-sandr-text"
          >
            {t('join.cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
