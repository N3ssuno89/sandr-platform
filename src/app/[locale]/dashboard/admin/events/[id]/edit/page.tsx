import { setRequestLocale } from 'next-intl/server';
import { EventForm } from '@/components/admin/EventForm';
import { getEventById } from '@/lib/events/actions';
import { getSports, getFederations } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';

export default async function EditEventPage({ params }: { params: { locale: string; id: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);
  const [event, sports, federations] = await Promise.all([
    getEventById(params.id),
    getSports(),
    getFederations(),
  ]);

  if (!event) {
    return (
      <div>
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Modifica Evento</h1>
        <p className="mt-3 text-sm text-sandr-muted">Evento non trovato (o Supabase non configurato).</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-condensed text-3xl font-extrabold uppercase text-white">Modifica Evento</h1>
      <EventForm event={event} sports={sports} federations={federations} />
    </div>
  );
}
