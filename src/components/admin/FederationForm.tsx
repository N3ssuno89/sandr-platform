'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { createFederation, updateFederation, deleteFederation } from '@/lib/reference/actions';
import type { SportRef, FederationFull } from '@/lib/reference/types';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { cardCls, labelCls, inputCls, orangeBtn, redBtn } from '@/components/admin/styles';

const NAZIONI = ['Italia', 'USA', 'Norvegia', 'International', 'Europe', 'Brasile', 'Germania', 'Francia', 'Spagna'];

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function FederationForm({ federation, sports }: { federation?: FederationFull; sports: SportRef[] }) {
  const router = useRouter();
  const [name, setName] = useState(federation?.name ?? '');
  const [shortName, setShortName] = useState(federation?.short_name ?? '');
  const [sportId, setSportId] = useState(federation?.sport_id ?? '');
  const [nation, setNation] = useState(federation?.nation ?? '');
  const [color, setColor] = useState(federation?.color ?? '#F04E00');
  const [description, setDescription] = useState(federation?.description ?? '');
  const [logoUrl, setLogoUrl] = useState(federation?.logo_url ?? '');
  const [logoBusy, setLogoBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mapErr(e: string) {
    return e === 'forbidden' || e === 'unauthorized'
      ? 'Solo un admin può salvare le federazioni.'
      : e === 'not-configured'
        ? 'Supabase non configurato in questo ambiente.'
        : `Errore: ${e}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Non salvare mentre il logo è ancora in upload: l'URL non è ancora pronto.
    if (logoBusy) {
      setError('Attendi il completamento del caricamento del logo.');
      return;
    }
    setSaving(true);
    setError(null);
    const input = {
      name,
      short_name: shortName || undefined,
      sport_id: sportId || undefined,
      nation: nation || undefined,
      color: color || undefined,
      description: description || undefined,
      logo_url: logoUrl || undefined,
    };
    const res = federation ? await updateFederation(federation.id, input) : await createFederation(input);
    if (!res.ok) {
      setError(mapErr(res.error));
      setSaving(false);
      return;
    }
    router.push('/dashboard/admin/federations');
    router.refresh();
  }

  async function handleDelete() {
    if (!federation) return;
    if (!window.confirm('Eliminare questa federazione?')) return;
    const res = await deleteFederation(federation.id);
    if (res.ok) {
      router.push('/dashboard/admin/federations');
      router.refresh();
    } else setError(mapErr(res.error));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className={`${cardCls} space-y-4`}>
        <ImageUpload label="Logo" bucket="federation-logos" value={logoUrl} onUploaded={setLogoUrl} onBusyChange={setLogoBusy} />

        <div>
          <label className={labelCls}>Nome</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Short name</label>
            <input value={shortName} onChange={(e) => setShortName(e.target.value)} placeholder="es. FIPAV" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Slug (auto)</label>
            <input value={slugify(shortName || name)} readOnly className={`${inputCls} opacity-60`} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Sport</label>
            <select value={sportId} onChange={(e) => setSportId(e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Nazione</label>
            <select value={nation} onChange={(e) => setNation(e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {NAZIONI.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Colore</label>
          <div className="flex items-center gap-3">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 rounded bg-[#1C1C1C]" />
            <span className="text-sm text-[#888888]">{color}</span>
          </div>
        </div>

        <div>
          <label className={labelCls}>Descrizione</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
        </div>
      </div>

      {error ? <p className="mt-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="submit" disabled={saving || logoBusy} className={orangeBtn}>
          {logoBusy ? 'Caricamento logo…' : saving ? 'Salvataggio…' : federation ? 'Salva modifiche' : 'Crea federazione'}
        </button>
        {federation ? <button type="button" onClick={handleDelete} className={redBtn}>Elimina federazione</button> : null}
      </div>
    </form>
  );
}
