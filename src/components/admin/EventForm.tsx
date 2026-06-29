'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { createEvent, updateEvent, deleteEvent } from '@/lib/events/actions';
import type { EventRow } from '@/lib/events/types';
import type { SportRef, FederationRef } from '@/lib/reference/types';
import { cardCls, labelCls, inputCls, orangeBtn, redBtn } from '@/components/admin/styles';

const STAGES = [
  'Qualifica 1',
  'Qualifica 2',
  'Pool',
  'Pool Vincenti',
  'Pool Perdenti',
  'Round of 12',
  'Ottavi',
  'Quarti',
  'Semifinale',
  'Finale',
  'Regular Season',
  'Wild Card',
];
const NAZIONI = ['Italia', 'USA', 'Norvegia', 'International', 'Europe', 'Brasile', 'Germania', 'Francia', 'Spagna'];

export function EventForm({
  event,
  sports,
  federations,
}: {
  event?: EventRow;
  sports: SportRef[];
  federations: FederationRef[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(event?.title ?? '');
  const [federationId, setFederationId] = useState(event?.federation_id ?? '');
  const [sportId, setSportId] = useState(event?.sport_id ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [nation, setNation] = useState(event?.nation ?? '');
  const [startDate, setStartDate] = useState(event?.start_date ?? '');
  const [endDate, setEndDate] = useState(event?.end_date ?? '');
  const [stage, setStage] = useState(event?.stage ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mapErr(e: string) {
    return e === 'forbidden' || e === 'unauthorized'
      ? 'Solo un admin può salvare gli eventi.'
      : e === 'not-configured'
        ? 'Supabase non configurato in questo ambiente.'
        : `Errore: ${e}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const input = {
      title,
      federation_id: federationId || undefined,
      sport_id: sportId || undefined,
      location: location || undefined,
      nation: nation || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      stage: stage || undefined,
    };
    const res = event ? await updateEvent(event.id, input) : await createEvent(input);
    if (!res.ok) {
      setError(mapErr(res.error));
      setSaving(false);
      return;
    }
    router.push('/dashboard/admin/events');
    router.refresh();
  }

  async function handleDelete() {
    if (!event) return;
    if (!window.confirm('Eliminare questo evento?')) return;
    const res = await deleteEvent(event.id);
    if (res.ok) {
      router.push('/dashboard/admin/events');
      router.refresh();
    } else setError(mapErr(res.error));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className={`${cardCls} space-y-4`}>
        <div>
          <label className={labelCls}>Titolo</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Federazione</label>
            <select value={federationId} onChange={(e) => setFederationId(e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {federations.map((f) => <option key={f.id} value={f.id}>{f.short_name ?? f.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sport</label>
            <select value={sportId} onChange={(e) => setSportId(e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nazione</label>
            <select value={nation} onChange={(e) => setNation(e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {NAZIONI.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Data inizio</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Data fine</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Stage</label>
            <select value={stage} onChange={(e) => setStage(e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {error ? <p className="mt-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="submit" disabled={saving} className={orangeBtn}>
          {saving ? 'Salvataggio…' : event ? 'Salva modifiche' : 'Crea evento'}
        </button>
        {event ? <button type="button" onClick={handleDelete} className={redBtn}>Elimina evento</button> : null}
      </div>
    </form>
  );
}
