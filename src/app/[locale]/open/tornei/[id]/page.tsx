import { setRequestLocale } from 'next-intl/server';
import { TournamentDetail } from '@/components/tornei/TournamentDetail';

// Dettaglio torneo (volto OPEN). Dati SOLO da @/lib/data.
export default function OpenTorneoDetailPage({ params }: { params: { locale: string; id: string } }) {
  setRequestLocale(params.locale);
  return <TournamentDetail editionId={params.id} />;
}
