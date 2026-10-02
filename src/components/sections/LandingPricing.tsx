import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { pricing } from '@/config/site';

// Sezione prezzi della landing (presentazionale). Offerta: abbonamento ANNUALE
// + PASS evento singolo. Prezzi SEGNAPOSTO da src/config/site.ts. NESSUNA logica
// Stripe: l'integrazione checkout è AREA CRITICA (CLAUDE.md).

export function LandingPricing() {
  const t = useTranslations('Landing.pricing');

  const annualFeatures = t.raw('plans.annual.features') as string[];
  const eventFeatures = t.raw('plans.eventPass.features') as string[];

  return (
    <section className="bg-[#141414] px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="font-condensed font-bold uppercase tracking-[3px] text-sandr-orange" style={{ fontSize: '11px' }}>
          {t('label')}
        </p>
        <h2 className="mt-3 max-w-2xl font-condensed text-4xl font-extrabold text-white sm:text-5xl">
          {t('heading')}
        </h2>

        {/* Due opzioni: abbonamento annuale (evidenziato) + pass evento singolo */}
        <div className="mt-10 grid items-start gap-6 md:grid-cols-2">
          <PlanCard
            name={t('plans.annual.name')}
            badge={t('plans.annual.badge')}
            price={pricing.annualPrice}
            period={t('perYear')}
            features={annualFeatures}
            cta={t('plans.annual.cta')}
            highlighted
          />
          <PlanCard
            name={t('plans.eventPass.name')}
            badge={t('plans.eventPass.badge')}
            price={pricing.eventPassPrice}
            period={t('perEvent')}
            features={eventFeatures}
            cta={t('plans.eventPass.cta')}
          />
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  name,
  badge,
  price,
  period,
  features,
  cta,
  highlighted = false,
}: {
  name: string;
  badge: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-xl bg-[#1C1C1C] p-6 ${
        highlighted ? 'border-2 border-sandr-orange' : 'border border-white/[0.08]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-condensed text-lg font-bold uppercase tracking-wide text-white">{name}</h3>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            highlighted ? 'bg-sandr-orange text-black' : 'bg-white/10 text-sandr-muted'
          }`}
        >
          {badge}
        </span>
      </div>

      <p className="mt-5 flex items-baseline gap-2">
        <span className="font-condensed text-3xl font-extrabold text-white">{price}</span>
        <span className="text-sm text-sandr-muted">{period}</span>
      </p>

      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
              <span className="h-2.5 w-1.5 rotate-45 border-b-2 border-r-2 border-sandr-orange" />
            </span>
            <span className="text-[#C0BDB8]">{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/pricing"
        className={`mt-8 block rounded-lg px-6 py-3 text-center font-condensed font-bold uppercase tracking-wide ${
          highlighted ? 'bg-sandr-orange text-black' : 'border border-white/20 text-white hover:border-white/40'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
