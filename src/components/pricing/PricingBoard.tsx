'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

// Pannello abbonamenti (presentazionale). NESSUNA logica Stripe qui:
// l'integrazione checkout è AREA CRITICA e richiede review umana (CLAUDE.md).
export function PricingBoard() {
  const t = useTranslations('Pricing.page');
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const freeFeatures = t.raw('plans.free.features') as string[];
  const premiumFeatures = t.raw('plans.premium.features') as string[];
  const ppvFeatures = t.raw('plans.ppv.features') as string[];
  const faqs = t.raw('faq') as { q: string; a: string }[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl uppercase text-sandr-text md:text-5xl">{t('heroTitle')}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sandr-muted">{t('heroSubtitle')}</p>
      </div>

      {/* Toggle mensile / annuale */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <div className="inline-flex rounded-full border border-white/15 p-1 font-condensed text-sm uppercase tracking-wide">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              !annual ? 'bg-sandr-orange text-sandr-text' : 'text-sandr-muted hover:text-sandr-text'
            }`}
          >
            {t('monthly')}
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              annual ? 'bg-sandr-orange text-sandr-text' : 'text-sandr-muted hover:text-sandr-text'
            }`}
          >
            {t('annual')}
          </button>
        </div>
        <span className="hidden text-xs uppercase tracking-wide text-sandr-orange sm:inline">
          {t('annualBadge')}
        </span>
      </div>

      {/* Cards: impilate su mobile, affiancate su desktop */}
      <div className="mt-10 grid items-start gap-6 md:grid-cols-3">
        {/* Free */}
        <PlanCard
          name={t('plans.free.name')}
          price={`€${t('plans.free.price')}`}
          period={t('perMonth')}
          features={freeFeatures}
          cta={t('ctaFree')}
        />

        {/* Premium (evidenziato) */}
        <PlanCard
          name={t('plans.premium.name')}
          price={`€${annual ? t('plans.premium.priceAnnual') : t('plans.premium.priceMonthly')}`}
          period={annual ? t('perYear') : t('perMonth')}
          note={annual ? t('save') : undefined}
          features={premiumFeatures}
          cta={t('ctaPremium')}
          badge={t('mostChosen')}
          highlighted
        />

        {/* PPV */}
        <PlanCard
          name={t('plans.ppv.name')}
          price={`€${t('plans.ppv.price')}`}
          period={t('perEvent')}
          features={ppvFeatures}
          cta={t('ctaPpv')}
        />
      </div>

      {/* FAQ accordion */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-3xl uppercase text-sandr-text md:text-4xl">
          {t('faqTitle')}
        </h2>
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-condensed text-lg uppercase tracking-wide text-sandr-text">
                    {item.q}
                  </span>
                  <span className={`text-sandr-orange transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {isOpen ? <p className="pb-5 text-sm text-sandr-muted">{item.a}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Card singolo piano.
function PlanCard({
  name,
  price,
  period,
  note,
  features,
  cta,
  badge,
  highlighted = false,
}: {
  name: string;
  price: string;
  period: string;
  note?: string;
  features: string[];
  cta: string;
  badge?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-lg border bg-sandr-surface p-6 ${
        highlighted ? 'border-sandr-orange' : 'border-white/10'
      }`}
    >
      {badge ? (
        <span className="absolute -top-3 left-6 rounded-full bg-sandr-orange px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sandr-text">
          {badge}
        </span>
      ) : null}

      <h3 className="font-condensed text-2xl uppercase tracking-wide text-sandr-text">{name}</h3>
      <p className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl text-sandr-text">{price}</span>
        <span className="text-sm text-sandr-muted">{period}</span>
      </p>
      {note ? <p className="mt-1 text-xs uppercase tracking-wide text-sandr-orange">{note}</p> : null}

      <ul className="mt-6 flex-1 space-y-3 text-sm text-sandr-muted">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sandr-orange" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/login"
        className={`mt-8 block rounded px-4 py-3 text-center font-condensed font-semibold uppercase tracking-wide ${
          highlighted
            ? 'bg-sandr-orange text-sandr-text'
            : 'border border-white/20 text-sandr-text hover:border-white/40'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
