import { setRequestLocale } from 'next-intl/server';
import { getAthletesFull, getFederations, getSports } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';
import { AthleteManager } from '@/components/admin/AthleteManager';

// Dati sempre freschi: nessuna cache (la lista deve riflettere subito le scritture).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// REAL: athletes table (Supabase). Dati caricati lato server, ricerca/filtri
// gestiti client-side dentro AthleteManager.
export default async function AdminAthletesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);

  const [athletes, federations, sports] = await Promise.all([
    getAthletesFull(),
    getFederations(),
    getSports(),
  ]);

  return <AthleteManager athletes={athletes} federations={federations} sports={sports} />;
}
