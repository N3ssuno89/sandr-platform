'use client';

import { useState } from 'react';
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

export function VideoManager({ videos }: { videos: VideoRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<VideoRow[]>(videos);
  const [q, setQ] = useState('');

  const visible = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));

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
