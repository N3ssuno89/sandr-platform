import { setRequestLocale } from 'next-intl/server';
import { LiveBoard } from '@/components/live/LiveBoard';

// Pagina eventi live (rotta autenticata). La parte interattiva (filtri) vive
// nel client component LiveBoard.
export default function LivePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <LiveBoard />;
}
