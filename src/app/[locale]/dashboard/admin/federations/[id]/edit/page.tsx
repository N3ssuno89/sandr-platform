import { setRequestLocale } from 'next-intl/server';
import { FederationForm } from '@/components/admin/FederationForm';
import { getSports, getFederationById } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';

export default async function EditFederationPage({ params }: { params: { locale: string; id: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);
  const [federation, sports] = await Promise.all([getFederationById(params.id), getSports()]);

  if (!federation) {
    return (
      <div>
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Modifica Federazione</h1>
        <p className="mt-3 text-sm text-sandr-muted">Federazione non trovata (o Supabase non configurato).</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-condensed text-3xl font-extrabold uppercase text-white">Modifica Federazione</h1>
      <FederationForm federation={federation} sports={sports} />
    </div>
  );
}
