import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';
import type { AccessType } from '@/types';

// Pagina abbonamenti pubblica. I piani sono placeholder: nessuna logica Stripe qui
// (AREA CRITICA — review umana obbligatoria, vedi CLAUDE.md).
const plans: { key: AccessType; titleKey: 'free' | 'premium' | 'ppv' }[] = [
  { key: 'free', titleKey: 'free' },
  { key: 'premium', titleKey: 'premium' },
  { key: 'ppv', titleKey: 'ppv' },
];

export default function PricingPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Pricing');

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className="rounded-lg border border-white/10 bg-sandr-surface p-6"
          >
            <h2 className="text-2xl text-sandr-text">{t(plan.titleKey)}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
