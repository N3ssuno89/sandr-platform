import { setRequestLocale } from 'next-intl/server';
import { TournamentDetail } from '@/components/tornei/TournamentDetail';

// Dettaglio torneo (volto PRO). Dati SOLO da @/lib/data.
export default function TorneoDetailPage({ params }: { params: { locale: string; id: string } }) {
  setRequestLocale(params.locale);
  return <TournamentDetail editionId={params.id} />;
}
