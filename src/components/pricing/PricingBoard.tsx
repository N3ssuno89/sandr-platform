'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { pricing } from '@/config/site';

// Pannello abbonamenti (presentazionale). Offerta: abbonamento ANNUALE + PASS
// evento singolo. Prezzi SEGNAPOSTO da src/config/site.ts. NESSUNA logica Stripe:
// l'integrazione checkout è AREA CRITICA e richiede review umana (CLAUDE.md).
export function PricingBoard() {
  const t = useTranslations('Pricing.page');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const annualFeatures = t.raw('plans.annual.features') as string[];
  const eventFeatures = t.raw('plans.eventPass.features') as string[];
  const faqs = t.raw('faq') as { q: string; a: string }[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl uppercase text-sandr-text md:text-5xl">{t('heroTitle')}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sandr-muted">{t('heroSubtitle')}</p>
      </div>

      {/* Due opzioni: abbonamento annuale + pass evento singolo */}
      <div className="mx-auto mt-10 grid max-w-3xl items-start gap-6 md:grid-cols-2">
        <PlanCard
          name={t('plans.annual.name')}
          price={pricing.annualPrice}
          period={t('perYear')}
          features={annualFeatures}
          cta={t('ctaAnnual')}
          badge={t('mostChosen')}
          highlighted
        />
        <PlanCard
          name={t('plans.eventPass.name')}
          price={pricing.eventPassPrice}
          period={t('perEvent')}
          features={eventFeatures}
          cta={t('ctaEvent')}
        />
      </div>

      {/* FAQ accordion */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-3xl uppercase text-sandr-text md:text-4xl">{t('faqTitle')}</h2>
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
                  <span className="font-condensed text-lg uppercase tracking-wide text-sandr-text">{item.q}</span>
                  <span className={`text-sandr-orange transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
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
  features,
  cta,
  badge,
  highlighted = false,
}: {
  name: string;
  price: string;
  period: string;
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
        <span className="absolute -top-3 left-6 rounded-full bg-sandr-orange px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
          {badge}
        </span>
      ) : null}

      <h3 className="font-condensed text-2xl uppercase tracking-wide text-sandr-text">{name}</h3>
      <p className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl text-sandr-text">{price}</span>
        <span className="text-sm text-sandr-muted">{period}</span>
      </p>

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
          highlighted ? 'bg-sandr-orange text-black' : 'border border-white/20 text-sandr-text hover:border-white/40'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
