'use client';

import { useMemo, useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { deleteVideo } from '@/lib/videos/actions';

export type VideoRow = {
  uid: string;
  name: string;
  thumb: string;
  circuit?: string;
  type?: string;
  sport?: string;
  ready: boolean;
  date: string;
};

const COLS = 'grid grid-cols-[60px_2fr_1fr_1fr_1fr_1fr_1fr_120px] items-center gap-3 px-4';

const selectCls =
  'rounded-lg border border-white/[0.08] bg-[#1C1C1C] px-3 py-3 text-sm text-white focus:border-[#F04E00] focus:outline-none';

// Valori distinti (non vuoti, ordinati) per popolare i dropdown dei filtri.
function distinctValues(rows: VideoRow[], pick: (r: VideoRow) => string | undefined): string[] {
  return Array.from(new Set(rows.map(pick).filter((x): x is string => !!x))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function VideoManager({ videos }: { videos: VideoRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<VideoRow[]>(videos);
  const [q, setQ] = useState('');
  const [circuit, setCircuit] = useState('');
  const [type, setType] = useState('');
  const [sport, setSport] = useState('');
  const [status, setStatus] = useState(''); // '' | 'ready' | 'processing'

  // Opzioni dei filtri ricavate dai dati (valori distinti presenti).
  const circuits = useMemo(() => distinctValues(rows, (r) => r.circuit), [rows]);
  const types = useMemo(() => distinctValues(rows, (r) => r.type), [rows]);
  const sports = useMemo(() => distinctValues(rows, (r) => r.sport), [rows]);

  // Filtri combinati in AND con la ricerca per titolo.
  const visible = rows.filter((r) => {
    if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (circuit && r.circuit !== circuit) return false;
    if (type && r.type !== type) return false;
    if (sport && r.sport !== sport) return false;
    if (status === 'ready' && !r.ready) return false;
    if (status === 'processing' && r.ready) return false;
    return true;
  });

  // Elimina su Supabase (server action, verifica admin), poi aggiorna la lista.
  const remove = async (uid: string) => {
    if (!window.confirm('Eliminare definitivamente questo video?')) return;
    const res = await deleteVideo(uid);
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r.uid !== uid));
      router.refresh();
    } else {
      window.alert(
        res.error === 'forbidden' || res.error === 'unauthorized'
          ? 'Solo un admin può eliminare i video.'
          : `Errore: ${res.error}`,
      );
    }
  };

  return (
    <div>
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Gestione Video</h1>

      {/* Top bar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca video…"
          className="flex-1 rounded-lg border border-white/[0.08] bg-[#1C1C1C] px-4 py-3 text-sm text-white placeholder:text-sandr-muted focus:border-[#F04E00] focus:outline-none"
        />
        <Link
          href="/dashboard/admin/videos/add"
          className="rounded-lg bg-sandr-orange px-5 py-3 text-center font-condensed font-bold uppercase tracking-wide text-black"
        >
          Aggiungi video
        </Link>
      </div>

      {/* Filtri (combinano in AND con la ricerca) */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select value={circuit} onChange={(e) => setCircuit(e.target.value)} className={selectCls}>
          <option value="">Tutti i circuiti</option>
          {circuits.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
          <option value="">Tutti i tipi</option>
          {types.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
        </select>
        <select value={sport} onChange={(e) => setSport(e.target.value)} className={selectCls}>
          <option value="">Tutti gli sport</option>
          {sports.map((sp) => <option key={sp} value={sp}>{sp}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
          <option value="">Tutti gli stati</option>
          <option value="ready">Pronto</option>
          <option value="processing">In elaborazione</option>
        </select>
      </div>

      <p className="mt-3 text-sm text-[#888888]">{visible.length} video</p>

      {visible.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
          <div className="min-w-[900px]">
            {/* Header */}
            <div className={`${COLS} border-b border-white/[0.06] py-3 font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]`}>
              <span>Thumb</span>
              <span>Titolo</span>
              <span>Circuito</span>
              <span>Tipo</span>
              <span>Sport</span>
              <span>Stato</span>
              <span>Data</span>
              <span className="text-right">Azioni</span>
            </div>

            {/* Rows */}
            {visible.map((r) => (
              <div key={r.uid} className={`${COLS} border-b border-white/[0.06] py-3 text-sm last:border-0`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.thumb} alt="" className="h-9 w-[60px] rounded object-cover" />
                <span className="truncate text-white">{r.name}</span>
                <Pill value={r.circuit} />
                <Pill value={r.type} />
                <Pill value={r.sport} />
                <span>
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase ${
                      r.ready ? 'bg-emerald-500/15 text-emerald-400' : 'bg-yellow-500/15 text-yellow-400'
                    }`}
                  >
                    {r.ready ? 'Pronto' : 'Processing'}
                  </span>
                </span>
                <span className="text-[#888888]">{r.date}</span>
                <div className="flex justify-end gap-2">
                  <Link href={`/dashboard/admin/videos/${r.uid}/edit`} className="text-[12px] font-semibold uppercase text-sandr-orange hover:text-white">
                    Modifica
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(r.uid)}
                    className="text-[12px] font-semibold uppercase text-red-400 hover:text-red-300"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-10 text-center text-sandr-muted">Nessun video caricato</p>
      )}
    </div>
  );
}

function Pill({ value }: { value?: string }) {
  if (!value) return <span className="text-[#555555]">—</span>;
  return (
    <span className="w-fit rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sandr-text">
      {value}
    </span>
  );
}
