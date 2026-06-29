import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getEvents, deleteEvent } from '@/lib/events/actions';
import { getFederations, getSports } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';
import { ConfirmDelete } from '@/components/admin/ConfirmDelete';
import { orangeBtn } from '@/components/admin/styles';

const COLS = 'grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_120px] items-center gap-3 px-4';

// Dati sempre freschi: nessuna cache (la lista deve riflettere subito le scritture).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// REAL: events table (Supabase).
export default async function AdminEventsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);

  const [events, federations, sports] = await Promise.all([getEvents(), getFederations(), getSports()]);
  const fedName = (id: string | null) => federations.find((f) => f.id === id)?.short_name ?? '—';
  const sportName = (id: string | null) => sports.find((s) => s.id === id)?.name ?? '—';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Gestione Eventi</h1>
        <Link href="/dashboard/admin/events/new" className={orangeBtn}>Aggiungi evento</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
        <div className="min-w-[820px]">
          <div className={`${COLS} border-b border-white/[0.06] py-3 font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]`}>
            <span>Titolo</span>
            <span>Federazione</span>
            <span>Sport</span>
            <span>Location</span>
            <span>Date</span>
            <span>Stage</span>
            <span className="text-right">Azioni</span>
          </div>

          {events.length > 0 ? (
            events.map((e) => (
              <div key={e.id} className={`${COLS} border-b border-white/[0.06] py-3 text-sm last:border-0`}>
                <span className="truncate text-white">{e.title}</span>
                <span className="text-[#888888]">{fedName(e.federation_id)}</span>
                <span className="text-[#888888]">{sportName(e.sport_id)}</span>
                <span className="truncate text-[#888888]">{e.location ?? '—'}</span>
                <span className="text-[#888888]">{e.start_date ?? '—'}</span>
                <span className="text-[#888888]">{e.stage ?? '—'}</span>
                <div className="flex justify-end gap-3">
                  <Link href={`/dashboard/admin/events/${e.id}/edit`} className="text-[12px] font-semibold uppercase text-sandr-orange hover:text-white">
                    Modifica
                  </Link>
                  <ConfirmDelete action={deleteEvent} id={e.id} message="Eliminare questo evento?" />
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-10 text-center text-sm text-[#888888]">Nessun evento. Aggiungine uno.</p>
          )}
        </div>
      </div>
    </div>
  );
}
