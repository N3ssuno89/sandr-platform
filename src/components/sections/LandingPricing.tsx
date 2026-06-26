'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

// Sezione prezzi della landing (presentazionale). Toggle mensile/annuale lato
// client. NESSUNA logica Stripe: l'integrazione checkout è AREA CRITICA (CLAUDE.md).
type Feature = { ok: boolean; text: string };

export function LandingPricing() {
  const t = useTranslations('Landing.pricing');
  const [annual, setAnnual] = useState(false);

  const freeFeatures = t.raw('plans.free.features') as Feature[];
  const premiumFeatures = t.raw('plans.premium.features') as Feature[];
  const ppvFeatures = t.raw('plans.ppv.features') as Feature[];

  return (
    <section className="bg-[#141414] px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="font-condensed font-bold uppercase tracking-[3px] text-sandr-orange" style={{ fontSize: '11px' }}>
          {t('label')}
        </p>
        <h2 className="mt-3 max-w-2xl font-condensed text-4xl font-extrabold text-white sm:text-5xl">
          {t('heading')}
        </h2>

        {/* Toggle mensile / annuale */}
        <div className="mt-8 inline-flex rounded-full border border-white/15 p-1 font-condensed text-sm font-bold uppercase tracking-wide">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              !annual ? 'bg-sandr-orange text-black' : 'text-sandr-muted hover:text-white'
            }`}
          >
            {t('monthly')}
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              annual ? 'bg-sandr-orange text-black' : 'text-sandr-muted hover:text-white'
            }`}
          >
            {t('annual')} · {t('annualSave')}
          </button>
        </div>

        {/* Cards */}
        <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
          <PlanCard
            name={t('plans.free.name')}
            badge={t('plans.free.badge')}
            badgeTone="green"
            price={`€${t('plans.free.price')}`}
            period={t('perMonth')}
            features={freeFeatures}
            cta={t('plans.free.cta')}
            href="/login"
          />

          <PlanCard
            name={t('plans.premium.name')}
            badge={t('plans.premium.badge')}
            badgeTone="orange"
            price={`€${annual ? t('plans.premium.priceAnnual') : t('plans.premium.priceMonthly')}`}
            oldPrice={annual ? `€${t('plans.premium.priceMonthly')}` : undefined}
            period={t('perMonth')}
            features={premiumFeatures}
            cta={t('plans.premium.cta')}
            href="/pricing"
            highlighted
          />

          <PlanCard
            name={t('plans.ppv.name')}
            badge={t('plans.ppv.badge')}
            badgeTone="neutral"
            price={`€${t('plans.ppv.price')}`}
            period={t('perEvent')}
            features={ppvFeatures}
            cta={t('plans.ppv.cta')}
            href="/pricing"
          />
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  name,
  badge,
  badgeTone,
  price,
  oldPrice,
  period,
  features,
  cta,
  href,
  highlighted = false,
}: {
  name: string;
  badge: string;
  badgeTone: 'green' | 'orange' | 'neutral';
  price: string;
  oldPrice?: string;
  period: string;
  features: Feature[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  const badgeClass =
    badgeTone === 'green'
      ? 'bg-emerald-500/15 text-emerald-400'
      : badgeTone === 'orange'
        ? 'bg-sandr-orange text-black'
        : 'bg-white/10 text-sandr-muted';

  return (
    <div
      className={`relative flex flex-col rounded-xl bg-[#1C1C1C] p-6 ${
        highlighted ? 'border-2 border-sandr-orange lg:-mt-4 lg:pb-10' : 'border border-white/[0.08]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-condensed text-lg font-bold uppercase tracking-wide text-white">{name}</h3>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}>
          {badge}
        </span>
      </div>

      <p className="mt-5 flex items-baseline gap-2">
        {oldPrice ? <span className="text-lg text-sandr-muted line-through">{oldPrice}</span> : null}
        <span className="font-condensed text-4xl font-extrabold text-white">{price}</span>
        <span className="text-sm text-sandr-muted">{period}</span>
      </p>

      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f.text} className="flex items-start gap-3">
            <Mark ok={f.ok} />
            <span className={f.ok ? 'text-[#C0BDB8]' : 'text-sandr-muted line-through'}>{f.text}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`mt-8 block rounded-lg px-6 py-3 text-center font-condensed font-bold uppercase tracking-wide ${
          highlighted
            ? 'bg-sandr-orange text-black'
            : 'border border-white/20 text-white hover:border-white/40'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

// Marker incluso (check arancione in CSS) / escluso (trattino) — niente emoji.
function Mark({ ok }: { ok: boolean }) {
  return (
    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
      {ok ? (
        <span className="h-2.5 w-1.5 rotate-45 border-b-2 border-r-2 border-sandr-orange" />
      ) : (
        <span className="h-0.5 w-2.5 bg-white/25" />
      )}
    </span>
  );
}
