import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { LivePreviewSection } from '@/components/sections/LivePreviewSection';
import { LandingPricing } from '@/components/sections/LandingPricing';
import { FeatureShowcase } from '@/components/sections/FeatureShowcase';
import { LandingFeaturedAthletes } from '@/components/sections/LandingFeaturedAthletes';

// Nomi propri dei circuiti (non tradotti). "Tutti" arriva da i18n.
const circuitNames = [
  'BPT Futures',
  'BPT Challenge',
  'BPT Elite',
  'AIBVC Tour',
  'FIPAV',
  'Campionato Italiano',
  'AVP',
  'Beach Pro Tour',
  'King & Queen',
  'Marathon',
  'Beach Tennis',
  'Padel',
];

type CoverageCard = { tag: string; title: string; items: string[]; desc: string; sport: string };
type WhyFeature = { title: string; desc: string; disclaimer?: string };

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Landing');
  const coverageCards = t.raw('coverage.cards') as CoverageCard[];
  const features = t.raw('why.features') as WhyFeature[];

  return (
    <>
      {/* ===== SECTION 1 — Hero ===== */}
      <section className="relative -mt-20 flex min-h-screen items-center overflow-hidden bg-[#141414]">
        {/* Atleti ritagliati, ancorati in basso a destra (nascosti su mobile) */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/athletes/6.png" alt="" className="absolute bottom-0 right-[240px] h-[70vh] w-auto object-contain object-bottom" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/athletes/3.png" alt="" className="absolute bottom-0 right-[120px] h-[80vh] w-auto object-contain object-bottom" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/athletes/1.png" alt="" className="absolute bottom-0 right-0 h-[90vh] w-auto object-contain object-bottom" />
        </div>

        {/* Overlay gradiente */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #141414 45%, rgba(20,20,20,0.6) 65%, transparent 85%)' }}
        />

        {/* Contenuto: a sinistra su desktop, centrato su mobile */}
        <div className="relative flex w-full px-6 md:px-20">
          <div className="flex w-full max-w-[560px] flex-col items-center text-center md:items-start md:text-left">
            <p className="font-condensed font-bold uppercase text-sandr-orange" style={{ fontSize: '11px', letterSpacing: '4px' }}>
              {t('hero.eyebrow')}
            </p>
            <h1 className="mt-4 font-condensed text-[56px] font-black uppercase leading-[0.9] tracking-[-2px] text-[#F8F6F3] md:text-[96px]">
              {t('hero.headline1')}
              <br />
              {t('hero.headline2')}
            </h1>
            <p className="mt-4 text-[18px] text-[#C0BDB8]">{t('hero.subline')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/pricing"
                className="rounded-lg bg-sandr-orange px-8 py-4 text-center font-condensed text-base font-bold uppercase tracking-wide text-black"
              >
                {t('hero.ctaPrimary')}
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-white/20 px-8 py-4 text-center font-condensed text-base font-bold uppercase tracking-wide text-white"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-sandr-muted">{t('hero.priceNote')}</p>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2 — Barra circuiti (sticky) ===== */}
      <div className="sticky top-20 z-40 border-b border-white/[0.08] bg-[#1C1C1C]">
        <div className="no-scrollbar mx-auto max-w-6xl overflow-x-auto px-4">
          <div className="flex gap-2 whitespace-nowrap py-3">
            <span className="shrink-0 rounded-[20px] bg-sandr-orange px-4 py-2 font-condensed text-[13px] font-bold uppercase text-black">
              {t('circuitsAll')}
            </span>
            {circuitNames.map((c) => (
              <span
                key={c}
                className="shrink-0 rounded-[20px] bg-white/[0.06] px-4 py-2 font-condensed text-[13px] font-bold uppercase text-[#C0BDB8] transition-colors hover:bg-white/10"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SECTION 3 — Cosa puoi guardare ===== */}
      <section className="bg-[#141414] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>{t('coverage.label')}</SectionLabel>
          <h2 className="mt-3 font-condensed text-4xl font-extrabold text-white sm:text-5xl">
            {t('coverage.heading')}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-[#C0BDB8]">{t('coverage.subline')}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {coverageCards.map((card) => (
              <div key={card.title} className="rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-6">
                <span className="inline-block rounded bg-sandr-orange px-2 py-1 text-xs font-bold uppercase text-black">
                  {card.tag}
                </span>
                <h3 className="mt-4 font-condensed text-lg font-bold uppercase tracking-wide text-white">
                  {card.title}
                </h3>
                <ul className="mt-3 space-y-1 text-sm text-sandr-muted">
                  {card.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-[#C0BDB8]">{card.desc}</p>
                <p className="mt-4 font-condensed text-sm font-bold uppercase tracking-wide text-sandr-orange">
                  {card.sport}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4 — Live preview + Interviste (client, click -> /login) ===== */}
      <LivePreviewSection />

      {/* ===== SECTION 4b — Atleti in evidenza (is_featured da Supabase) ===== */}
      <LandingFeaturedAthletes />

      {/* ===== SECTION 5 — Perché SANDR ===== */}
      <section className="bg-[#1C1C1C] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>{t('why.label')}</SectionLabel>
          <h2 className="mt-3 max-w-3xl font-condensed text-4xl font-extrabold text-white sm:text-5xl">
            {t('why.heading')}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-[#C0BDB8]">{t('why.subline')}</p>

          {/* Tutte le card hanno lo stesso stile: betting è una feature tra le
              altre, non enfatizzata (CLAUDE.md: niente emoji). */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/[0.06] bg-[#242424] p-6">
                <span className="mb-4 inline-block h-2.5 w-2.5 rounded-sm bg-sandr-orange" />
                <h3 className="font-condensed text-base font-bold uppercase tracking-wide text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-sandr-muted">{f.desc}</p>
                {/* Disclaimer solo sulla card betting (compliance, CLAUDE.md). */}
                {f.disclaimer ? (
                  <p className="mt-3 text-[9px] text-[#555555]">{f.disclaimer}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6 — Pricing (client) ===== */}
      <LandingPricing />

      {/* La BettingPartnerSection standalone è stata rimossa dalla landing per
          non far dominare il betting nel messaging: ora è una sola feature card
          nella sezione "Perché SANDR". Il componente resta usato nella home
          autenticata (/dashboard/home). */}

      {/* ===== SECTION 7 — Showcase tabs (client) ===== */}
      <FeatureShowcase />

      {/* ===== SECTION 8 — Final CTA ===== */}
      <section className="bg-sandr-orange px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-condensed text-[48px] font-black uppercase leading-[0.95] tracking-[-2px] text-black md:text-[72px]">
            {t('finalCta.heading')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[18px] text-black/70">{t('finalCta.subline')}</p>
          <Link
            href="/pricing"
            className="mt-8 inline-block rounded-lg bg-black px-8 py-4 font-condensed font-bold uppercase tracking-wide text-white"
          >
            {t('finalCta.cta')}
          </Link>
        </div>
      </section>
    </>
  );
}

// Eyebrow arancione riutilizzato nelle sezioni.
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-condensed font-bold uppercase tracking-[3px] text-sandr-orange" style={{ fontSize: '11px' }}>
      {children}
    </p>
  );
}
