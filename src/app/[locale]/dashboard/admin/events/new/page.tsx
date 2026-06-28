import { setRequestLocale } from 'next-intl/server';
import { EventForm } from '@/components/admin/EventForm';
import { getSports, getFederations } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';

export default async function NewEventPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);
  const [sports, federations] = await Promise.all([getSports(), getFederations()]);
  return (
    <div>
      <h1 className="mb-6 font-condensed text-3xl font-extrabold uppercase text-white">Nuovo Evento</h1>
      <EventForm sports={sports} federations={federations} />
    </div>
  );
}
