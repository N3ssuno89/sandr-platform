import { setRequestLocale } from 'next-intl/server';
import { PricingBoard } from '@/components/pricing/PricingBoard';

// Pagina abbonamenti pubblica. La parte interattiva (toggle annuale, FAQ)
// vive nel client component PricingBoard. Nessuna logica Stripe qui
// (AREA CRITICA — review umana obbligatoria, vedi CLAUDE.md).
export default function PricingPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <PricingBoard />;
}
