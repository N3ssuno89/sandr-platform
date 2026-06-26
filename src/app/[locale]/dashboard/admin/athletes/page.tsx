import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { mockAthletes } from '@/lib/mock-athletes';

const COLS = 'grid grid-cols-[40px_2fr_1fr_1fr_1fr_80px_120px] items-center gap-3 px-4';

export default function AdminAthletesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Gestione Atleti</h1>
        <Link
          href="/dashboard/admin/athletes/new"
          className="rounded-lg bg-sandr-orange px-5 py-3 font-condensed font-bold uppercase tracking-wide text-black"
        >
          Aggiungi atleta
        </Link>
      </div>

      {/* Nota: dati mock finché non c'è il database (CLAUDE.md: Supabase). */}
      <p className="mt-2 text-sm text-[#888888]">
        Gli atleti saranno gestiti tramite database nella prossima versione
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
        <div className="min-w-[760px]">
          {/* Header */}
          <div className={`${COLS} border-b border-white/[0.06] py-3 font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]`}>
            <span>Foto</span>
            <span>Nome</span>
            <span>Sport</span>
            <span>Circuito</span>
            <span>Nazione</span>
            <span>Win rate</span>
            <span className="text-right">Azioni</span>
          </div>

          {/* Rows */}
          {mockAthletes.map((a) => (
            <div key={a.id} className={`${COLS} border-b border-white/[0.06] py-3 text-sm last:border-0`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
              <span className="truncate text-white">{a.name}</span>
              <span className="text-[#888888]">{a.sport}</span>
              <span className="text-[#888888]">{a.circuit}</span>
              <span className="text-[#888888]">{a.nation}</span>
              <span className="font-semibold text-emerald-400">{a.stats.winRate}%</span>
              <div className="flex justify-end">
                <Link
                  href="/dashboard/admin/athletes/new"
                  className="text-[12px] font-semibold uppercase text-sandr-orange hover:text-white"
                >
                  Modifica
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
