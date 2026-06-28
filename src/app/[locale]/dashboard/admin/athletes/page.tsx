import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAthletesFull, getFederations, getSports, deleteAthlete } from '@/lib/reference/actions';
import { requireAdminPage } from '@/lib/supabase/guard';
import { ConfirmDelete } from '@/components/admin/ConfirmDelete';
import { orangeBtn } from '@/components/admin/styles';

const COLS = 'grid grid-cols-[40px_2fr_1fr_1fr_1fr_70px_120px] items-center gap-3 px-4';

// REAL: athletes table (Supabase).
export default async function AdminAthletesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);

  const [athletes, federations, sports] = await Promise.all([
    getAthletesFull(),
    getFederations(),
    getSports(),
  ]);
  const fedName = (id: string | null) => federations.find((f) => f.id === id)?.short_name ?? '—';
  const sportName = (id: string | null) => sports.find((s) => s.id === id)?.name ?? '—';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Gestione Atleti</h1>
        <Link href="/dashboard/admin/athletes/new" className={orangeBtn}>Aggiungi atleta</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
        <div className="min-w-[760px]">
          <div className={`${COLS} border-b border-white/[0.06] py-3 font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]`}>
            <span>Foto</span>
            <span>Nome</span>
            <span>Sport</span>
            <span>Federazione</span>
            <span>Nazione</span>
            <span>Ranking</span>
            <span className="text-right">Azioni</span>
          </div>

          {athletes.length > 0 ? (
            athletes.map((a) => (
              <div key={a.id} className={`${COLS} border-b border-white/[0.06] py-3 text-sm last:border-0`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.photo_url ?? '/logo.png'} alt="" className="h-10 w-10 rounded-full object-cover" />
                <span className="truncate text-white">{a.full_name}</span>
                <span className="text-[#888888]">{sportName(a.sport_id)}</span>
                <span className="text-[#888888]">{fedName(a.federation_id)}</span>
                <span className="text-[#888888]">{a.nation ?? '—'}</span>
                <span className="text-[#888888]">{a.ranking ?? '—'}</span>
                <div className="flex justify-end gap-3">
                  <Link href={`/dashboard/admin/athletes/${a.id}/edit`} className="text-[12px] font-semibold uppercase text-sandr-orange hover:text-white">
                    Modifica
                  </Link>
                  <ConfirmDelete action={deleteAthlete} id={a.id} message="Eliminare questo atleta?" />
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-10 text-center text-sm text-[#888888]">
              Nessun atleta. Aggiungine uno (oppure esegui il seed 0003).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
