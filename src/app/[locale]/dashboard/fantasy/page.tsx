import { setRequestLocale } from 'next-intl/server';
import { getMyFantasyTeams } from '@/lib/user/actions';
import { DemoPill } from '@/components/account/DemoPill';

// REAL: fantasy_teams. MOCK: team creation flow pending
export default async function FantasyPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const teams = await getMyFantasyTeams();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Fantasy</h1>

      {teams.length > 0 ? (
        <div className="mt-6 space-y-3">
          {teams.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#1C1C1C] px-4 py-4">
              <div className="min-w-0">
                <p className="truncate font-condensed text-lg font-bold uppercase text-white">{t.name ?? 'Squadra'}</p>
                <p className="text-xs text-[#888888]">{t.eventTitle ?? 'Evento —'}</p>
              </div>
              <span className="shrink-0 font-condensed text-2xl font-black text-sandr-orange">{t.totalPoints} pt</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-10 text-center">
          <p className="text-sm text-[#888888]">Non hai ancora creato una squadra fantasy</p>
          {/* MOCK: team creation flow pending */}
          <button
            type="button"
            disabled
            title="Disponibile a breve"
            className="mt-4 inline-flex cursor-not-allowed items-center rounded-lg bg-sandr-orange px-5 py-3 font-condensed font-bold uppercase tracking-wide text-black opacity-60"
          >
            Crea squadra <DemoPill />
          </button>
        </div>
      )}
    </div>
  );
}
