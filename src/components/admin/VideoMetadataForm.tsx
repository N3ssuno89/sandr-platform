'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';

// Tool interno staff-facing: etichette in italiano (no i18n, scelta deliberata).

const CIRCUITI = ['FIPAV', 'AIBVC', 'AVP', 'BPT', 'CEV', 'FIVB', 'King & Queen', 'Marathon', 'Beach Pro Tour'];
const TIPI = ['Live Recording', 'Replay', 'Intervista', 'Highlights', 'Dietro le quinte', 'Documentario'];
const SPORT = ['Beach Volley', 'Beach Tennis', 'Padel', 'Snow Volley'];
const EVENTI = ['Finale', 'Semifinale', 'Quarti di finale', 'Regular Season', 'Wild Card', 'Amichevole'];
const NAZIONI = ['Italia', 'USA', 'Norvegia', 'Brasile', 'Germania', 'Francia', 'Olanda', 'Russia', 'Australia'];

type AccessLevel = 'free' | 'premium' | 'ppv';

export type VideoMeta = {
  name?: string;
  circuit?: string;
  type?: string;
  sport?: string;
  event?: string;
  athletes?: string;
  country?: string;
  eventDate?: string;
  access?: string;
  description?: string;
  tags?: string;
};

const labelCls = 'mb-2 block font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]';
const inputCls =
  'w-full rounded-lg border border-white/[0.08] bg-[#1C1C1C] px-4 py-3 text-sm text-white placeholder:text-sandr-muted focus:border-[#F04E00] focus:outline-none';
const sectionCls = 'mb-4 rounded-xl bg-[#141414] p-6';

const ACCESS: { value: AccessLevel; label: string; cls: string }[] = [
  { value: 'free', label: 'FREE', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' },
  { value: 'premium', label: 'PREMIUM', cls: 'bg-[#F04E00]/15 text-[#F04E00] border-[#F04E00]/40' },
  { value: 'ppv', label: 'PPV', cls: 'bg-amber-400/15 text-amber-400 border-amber-400/40' },
];

export function VideoMetadataForm({ uid, initial }: { uid: string; initial?: VideoMeta }) {
  const router = useRouter();
  const [meta, setMeta] = useState<VideoMeta>({
    name: initial?.name ?? '',
    circuit: initial?.circuit ?? '',
    type: initial?.type ?? '',
    sport: initial?.sport ?? '',
    event: initial?.event ?? '',
    athletes: initial?.athletes ?? '',
    country: initial?.country ?? '',
    eventDate: initial?.eventDate ?? '',
    access: initial?.access ?? 'free',
    description: initial?.description ?? '',
    tags: initial?.tags ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  const set = (k: keyof VideoMeta, v: string) => setMeta((m) => ({ ...m, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/stream/update-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, meta }),
      });
      setToast(true);
      setTimeout(() => {
        setToast(false);
        router.push('/dashboard/admin/videos');
      }, 3000);
    } catch {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={sectionCls}>
        {/* Row 1 — Titolo */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="name">Titolo</label>
          <input
            id="name"
            value={meta.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Es. Finale BPT Elite — Roma 2026"
            className={inputCls}
          />
        </div>

        {/* Row 2 — Circuito + Tipo */}
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="circuit">Circuito</label>
            <select id="circuit" value={meta.circuit} onChange={(e) => set('circuit', e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {CIRCUITI.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="type">Tipo</label>
            <select id="type" value={meta.type} onChange={(e) => set('type', e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {TIPI.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Row 3 — Sport + Evento */}
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="sport">Sport</label>
            <select id="sport" value={meta.sport} onChange={(e) => set('sport', e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {SPORT.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="event">Evento</label>
            <select id="event" value={meta.event} onChange={(e) => set('event', e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {EVENTI.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
            </select>
          </div>
        </div>

        {/* Row 4 — Atleti coinvolti */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="athletes">Atleti coinvolti</label>
          <input
            id="athletes"
            value={meta.athletes}
            onChange={(e) => set('athletes', e.target.value)}
            placeholder="Nomi separati da virgola"
            className={inputCls}
          />
        </div>

        {/* Row 5 — Nazione + Data evento */}
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="country">Nazione</label>
            <select id="country" value={meta.country} onChange={(e) => set('country', e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {NAZIONI.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="eventDate">Data evento</label>
            <input
              id="eventDate"
              type="date"
              value={meta.eventDate}
              onChange={(e) => set('eventDate', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Row 6 — Access level */}
        <div className="mb-4">
          <label className={labelCls}>Livello di accesso</label>
          <div className="flex gap-3">
            {ACCESS.map((a) => {
              const active = meta.access === a.value;
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => set('access', a.value)}
                  className={`rounded-full border px-5 py-2 font-condensed text-xs font-bold uppercase tracking-wide transition ${
                    active ? a.cls : 'border-white/[0.08] bg-[#1C1C1C] text-[#888888]'
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 7 — Descrizione */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="description">Descrizione</label>
          <textarea
            id="description"
            rows={4}
            value={meta.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Descrizione del contenuto…"
            className={inputCls}
          />
        </div>

        {/* Row 8 — Tag aggiuntivi */}
        <div>
          <label className={labelCls} htmlFor="tags">Tag aggiuntivi</label>
          <input
            id="tags"
            value={meta.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="Tag separati da virgola"
            className={inputCls}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-sandr-orange px-5 py-3 font-condensed font-bold uppercase tracking-wide text-black disabled:opacity-60"
      >
        {saving ? 'Salvataggio…' : 'Salva metadata'}
      </button>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-bold text-black shadow-lg">
          Metadata salvati con successo
        </div>
      )}
    </form>
  );
}
