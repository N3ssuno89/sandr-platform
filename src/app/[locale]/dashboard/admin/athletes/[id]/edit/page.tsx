import { setRequestLocale } from 'next-intl/server';
import { AthleteForm } from '@/components/admin/AthleteForm';
import { getSports, getFederations, getAthleteById } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';

export default async function EditAthletePage({ params }: { params: { locale: string; id: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);
  const [athlete, sports, federations] = await Promise.all([
    getAthleteById(params.id),
    getSports(),
    getFederations(),
  ]);

  if (!athlete) {
    return (
      <div>
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Modifica Atleta</h1>
        <p className="mt-3 text-sm text-sandr-muted">Atleta non trovato (o Supabase non configurato).</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-condensed text-3xl font-extrabold uppercase text-white">Modifica Atleta</h1>
      <AthleteForm athlete={athlete} sports={sports} federations={federations} />
    </div>
  );
}
