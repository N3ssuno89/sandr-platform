import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getFederationsFull, getSports, deleteFederation } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';
import { ConfirmDelete } from '@/components/admin/ConfirmDelete';
import { orangeBtn } from '@/components/admin/styles';

const COLS = 'grid grid-cols-[40px_2fr_1fr_1fr_1fr_120px] items-center gap-3 px-4';

// REAL: federations table (Supabase).
export default async function AdminFederationsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);

  const [federations, sports] = await Promise.all([getFederationsFull(), getSports()]);
  const sportName = (id: string | null) => sports.find((s) => s.id === id)?.name ?? '—';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Gestione Federazioni</h1>
        <Link href="/dashboard/admin/federations/new" className={orangeBtn}>Aggiungi federazione</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
        <div className="min-w-[680px]">
          <div className={`${COLS} border-b border-white/[0.06] py-3 font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]`}>
            <span>Colore</span>
            <span>Nome</span>
            <span>Short</span>
            <span>Sport</span>
            <span>Nazione</span>
            <span className="text-right">Azioni</span>
          </div>

          {federations.length > 0 ? (
            federations.map((f) => (
              <div key={f.id} className={`${COLS} border-b border-white/[0.06] py-3 text-sm last:border-0`}>
                <span className="h-6 w-6 rounded" style={{ background: f.color ?? '#333' }} />
                <span className="truncate text-white">{f.name}</span>
                <span className="text-[#888888]">{f.short_name ?? '—'}</span>
                <span className="text-[#888888]">{sportName(f.sport_id)}</span>
                <span className="text-[#888888]">{f.nation ?? '—'}</span>
                <div className="flex justify-end gap-3">
                  <Link href={`/dashboard/admin/federations/${f.id}/edit`} className="text-[12px] font-semibold uppercase text-sandr-orange hover:text-white">
                    Modifica
                  </Link>
                  <ConfirmDelete action={deleteFederation} id={f.id} message="Eliminare questa federazione?" />
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-10 text-center text-sm text-[#888888]">
              Nessuna federazione. Aggiungine una (oppure esegui il seed 0003).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
