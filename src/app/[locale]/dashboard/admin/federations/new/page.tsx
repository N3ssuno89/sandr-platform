import { setRequestLocale } from 'next-intl/server';
import { FederationForm } from '@/components/admin/FederationForm';
import { getSports } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';

export default async function NewFederationPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);
  const sports = await getSports();
  return (
    <div>
      <h1 className="mb-6 font-condensed text-3xl font-extrabold uppercase text-white">Nuova Federazione</h1>
      <FederationForm sports={sports} />
    </div>
  );
}
