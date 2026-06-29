'use client';

import { useRef, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { saveVideo } from '@/lib/videos/actions';
import {
  createFederation,
  createAthlete,
  createSport,
  addContentTypeEnum,
} from '@/lib/reference/actions';
import { uploadToBucket } from '@/lib/storage/actions';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from '@/lib/storage/limits';
import type { SportRef, FederationRef, AthleteRef } from '@/lib/reference/types';
import type { VideoEditData } from '@/lib/videos/types';

// Tool interno staff-facing: etichette in italiano (no i18n, scelta deliberata).
// Campi strutturati = dropdown (no free typing, niente typo). Tag liberi = testo
// con suggerimenti. Fonte dati: Supabase (non più meta Cloudflare).

const CONTENT_TYPE_BASE = [
  { value: 'live', label: 'Live' },
  { value: 'replay', label: 'Replay' },
  { value: 'interview', label: 'Intervista' },
  { value: 'highlights', label: 'Highlights' },
  { value: 'behind_scenes', label: 'Dietro le quinte' },
  { value: 'documentary', label: 'Documentario' },
];

const NAZIONI = ['Italia', 'USA', 'Norvegia', 'Brasile', 'Germania', 'Francia', 'Olanda', 'Russia', 'Australia'];

type AccessLevel = 'free' | 'premium' | 'ppv';

const labelCls = 'mb-2 block font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]';
const inputCls =
  'w-full rounded-lg border border-white/[0.08] bg-[#1C1C1C] px-4 py-3 text-sm text-white placeholder:text-sandr-muted focus:border-[#F04E00] focus:outline-none';
const sectionCls = 'mb-4 rounded-xl bg-[#141414] p-6';
const addLinkCls = 'mt-2 inline-block text-xs font-semibold text-[#F04E00] hover:text-white';

const ACCESS: { value: AccessLevel; label: string; cls: string }[] = [
  { value: 'free', label: 'FREE', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' },
  { value: 'premium', label: 'PREMIUM', cls: 'bg-[#F04E00]/15 text-[#F04E00] border-[#F04E00]/40' },
  { value: 'ppv', label: 'PPV', cls: 'bg-amber-400/15 text-amber-400 border-amber-400/40' },
];

export function VideoMetadataForm({
  cloudflareUid,
  defaultValues,
  sports: sportsProp,
  federations: federationsProp,
  athletes: athletesProp,
  existingTags,
}: {
  cloudflareUid: string;
  defaultValues?: VideoEditData;
  sports: SportRef[];
  federations: FederationRef[];
  athletes: AthleteRef[];
  existingTags: string[];
}) {
  const router = useRouter();

  // Liste di riferimento (mutabili: "aggiungi nuovo" le estende).
  const [sports, setSports] = useState<SportRef[]>(sportsProp);
  const [federations, setFederations] = useState<FederationRef[]>(federationsProp);
  const [athletes, setAthletes] = useState<AthleteRef[]>(athletesProp);
  const [contentTypes, setContentTypes] = useState(CONTENT_TYPE_BASE);

  // Campi del form.
  const [title, setTitle] = useState(defaultValues?.title ?? '');
  const [description, setDescription] = useState(defaultValues?.description ?? '');
  const [federationId, setFederationId] = useState(defaultValues?.federationId ?? '');
  const [sportId, setSportId] = useState(defaultValues?.sportId ?? '');
  const [type, setType] = useState(defaultValues?.type ?? '');
  const [access, setAccess] = useState<AccessLevel>((defaultValues?.accessLevel as AccessLevel) ?? 'free');
  const [isFeatured, setIsFeatured] = useState(defaultValues?.isFeatured ?? false);
  const [isLive, setIsLive] = useState(defaultValues?.isLive ?? false);
  const [thumbCard, setThumbCard] = useState(defaultValues?.thumbnailCardUrl ?? '');
  const [thumbFeatured, setThumbFeatured] = useState(defaultValues?.thumbnailFeaturedUrl ?? '');
  const [athleteIds, setAthleteIds] = useState<string[]>(defaultValues?.athleteIds ?? []);
  const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await saveVideo({
      id: defaultValues?.id,
      cloudflareUid,
      title,
      description,
      type: type || undefined,
      sportId: sportId || undefined,
      federationId: federationId || undefined,
      thumbnailCardUrl: thumbCard || undefined,
      thumbnailFeaturedUrl: thumbFeatured || undefined,
      accessLevel: access,
      isFeatured,
      isLive,
      athleteIds,
      tags,
    });
    if (!res.ok) {
      setError(
        res.error === 'forbidden' || res.error === 'unauthorized'
          ? 'Solo un admin può salvare i video.'
          : res.error === 'not-configured'
            ? 'Supabase non configurato in questo ambiente.'
            : `Errore: ${res.error}`,
      );
      setSaving(false);
      return;
    }
    setToast(true);
    setTimeout(() => {
      router.push('/dashboard/admin/videos');
      router.refresh();
    }, 1200);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={sectionCls}>
        {/* Titolo */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="title">Titolo</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Es. Finale BPT Elite — Roma 2026"
            className={inputCls}
          />
        </div>

        {/* Copertine → Supabase Storage */}
        <div className="mb-4 flex flex-wrap gap-6">
          <ThumbnailUpload label="Copertina card" hint="righe a scorrimento (16:9)" width={160} height={90} kind="card" value={thumbCard} onUploaded={setThumbCard} />
          <ThumbnailUpload label="Copertina in evidenza" hint="hero (21:9)" width={320} height={137} kind="featured" value={thumbFeatured} onUploaded={setThumbFeatured} />
        </div>

        {/* LIVELLO 1 — Federazione + Sport (dropdown con "aggiungi nuovo") */}
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <FederationField
            federations={federations}
            sports={sports}
            value={federationId}
            onChange={setFederationId}
            onCreated={(f) => {
              setFederations((prev) => [...prev, f]);
              setFederationId(f.id);
            }}
          />
          <SportField
            sports={sports}
            value={sportId}
            onChange={setSportId}
            onCreated={(s) => {
              setSports((prev) => [...prev, s]);
              setSportId(s.id);
            }}
          />
        </div>

        {/* LIVELLO 2 — Tipo (enum) */}
        <div className="mb-4">
          <ContentTypeField
            types={contentTypes}
            value={type}
            onChange={setType}
            onCreated={(v) => {
              setContentTypes((prev) => [...prev, { value: v, label: v }]);
              setType(v);
            }}
          />
        </div>

        {/* LIVELLO 3 — Atleti (autocomplete + aggiungi nuovo) */}
        <div className="mb-4">
          <label className={labelCls}>Atleti coinvolti</label>
          <AthleteField
            athletes={athletes}
            sports={sports}
            federations={federations}
            selectedIds={athleteIds}
            onChange={setAthleteIds}
            onCreated={(a) => {
              setAthletes((prev) => [...prev, a]);
              setAthleteIds((prev) => [...prev, a.id]);
            }}
          />
        </div>

        {/* Access */}
        <div className="mb-4">
          <label className={labelCls}>Livello di accesso</label>
          <div className="flex gap-3">
            {ACCESS.map((a) => {
              const active = access === a.value;
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setAccess(a.value)}
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

        {/* Flag */}
        <div className="mb-4 flex gap-3">
          <button
            type="button"
            onClick={() => setIsFeatured((v) => !v)}
            className={`rounded-full border px-5 py-2 font-condensed text-xs font-bold uppercase tracking-wide transition ${
              isFeatured ? 'border-[#F04E00]/40 bg-[#F04E00]/15 text-[#F04E00]' : 'border-white/[0.08] bg-[#1C1C1C] text-[#888888]'
            }`}
          >
            {isFeatured ? 'In evidenza' : 'Metti in evidenza'}
          </button>
          <button
            type="button"
            onClick={() => setIsLive((v) => !v)}
            className={`rounded-full border px-5 py-2 font-condensed text-xs font-bold uppercase tracking-wide transition ${
              isLive ? 'border-red-500/40 bg-red-500/15 text-red-400' : 'border-white/[0.08] bg-[#1C1C1C] text-[#888888]'
            }`}
          >
            {isLive ? 'Live' : 'Segna come live'}
          </button>
        </div>

        {/* Descrizione */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="desc">Descrizione</label>
          <textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrizione del contenuto…" className={inputCls} />
        </div>

        {/* LIVELLO 4 — Tag liberi con suggerimenti */}
        <div>
          <label className={labelCls}>Tag editoriali</label>
          <TagField suggestions={existingTags} tags={tags} onChange={setTags} />
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-sandr-orange px-5 py-3 font-condensed font-bold uppercase tracking-wide text-black disabled:opacity-60"
      >
        {saving ? 'Salvataggio…' : 'Salva su Supabase'}
      </button>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-bold text-black shadow-lg">
          Salvato con successo
        </div>
      )}
    </form>
  );
}

// ---------------------------------------------------------------------------
// Upload copertina → Supabase Storage (route server-side).
function ThumbnailUpload({
  label,
  hint,
  width,
  height,
  kind,
  value,
  onUploaded,
}: {
  label: string;
  hint: string;
  width: number;
  height: number;
  kind: 'card' | 'featured';
  value?: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setErr(null);
    // Guard lato client: oltre il limite il POST verrebbe rifiutato con 500
    // PRIMA di raggiungere la server action.
    if (file.size > MAX_UPLOAD_BYTES) {
      setErr(`File troppo grande (max ${MAX_UPLOAD_MB}MB). Comprimi o ridimensiona l'immagine.`);
      return;
    }
    setPreview(URL.createObjectURL(file));
    setBusy(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('bucket', 'video-thumbnails');
      body.append('prefix', kind);
      const res = await uploadToBucket(body);
      if (res.ok) {
        setPreview(res.data.url);
        onUploaded(res.data.url);
      } else {
        // Errore non più silenzioso.
        setErr(
          res.error === 'forbidden' || res.error === 'unauthorized'
            ? 'Solo un admin può caricare le copertine.'
            : res.error === 'not-configured'
              ? 'Supabase non configurato in questo ambiente.'
              : res.error === 'file-too-large'
                ? `File troppo grande (max ${MAX_UPLOAD_MB}MB). Comprimi o ridimensiona l'immagine.`
                : `Errore: ${res.error}`,
        );
        setPreview(value || null);
      }
    } catch (e) {
      setErr(`Errore: ${e instanceof Error ? e.message : 'sconosciuto'}`);
      setPreview(value || null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        style={{ width, height }}
        className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#F04E00]/30 bg-[#F04E00]/[0.04] text-center"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-[11px] text-[#888888]">{busy ? 'Caricamento…' : 'Trascina o clicca'}</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
      <p className="mt-1 max-w-[320px] text-[10px] text-[#555555]">{hint}</p>
      {err ? (
        <p className="mt-1 max-w-[320px] rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] text-red-300">
          {err}
        </p>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LIVELLO 1 — Federazione (dropdown + mini-form "aggiungi").
function FederationField({
  federations,
  sports,
  value,
  onChange,
  onCreated,
}: {
  federations: FederationRef[];
  sports: SportRef[];
  value: string;
  onChange: (v: string) => void;
  onCreated: (f: FederationRef) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [sportId, setSportId] = useState('');
  const [nation, setNation] = useState('');
  const [color, setColor] = useState('#F04E00');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    if (!name.trim()) return;
    setBusy(true);
    setErr(null);
    const res = await createFederation({ name, short_name: shortName, sport_id: sportId, nation, color });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    onCreated(res.data);
    setAdding(false);
    setName('');
    setShortName('');
  }

  return (
    <div>
      <label className={labelCls}>Federazione</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="">Seleziona…</option>
        {federations.map((f) => (
          <option key={f.id} value={f.id}>{f.short_name ? `${f.short_name} — ${f.name}` : f.name}</option>
        ))}
      </select>
      {!adding ? (
        <button type="button" className={addLinkCls} onClick={() => setAdding(true)}>+ Aggiungi federazione</button>
      ) : (
        <div className="mt-2 rounded-lg border border-white/[0.08] bg-[#1C1C1C] p-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome federazione" className={`${inputCls} mb-2`} />
          <input value={shortName} onChange={(e) => setShortName(e.target.value)} placeholder="Sigla (es. FIPAV)" className={`${inputCls} mb-2`} />
          <select value={sportId} onChange={(e) => setSportId(e.target.value)} className={`${inputCls} mb-2`}>
            <option value="">Sport…</option>
            {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={nation} onChange={(e) => setNation(e.target.value)} className={`${inputCls} mb-2`}>
            <option value="">Nazione…</option>
            {NAZIONI.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mb-2 h-9 w-full rounded bg-[#1C1C1C]" />
          {err ? <p className="mb-2 text-xs text-red-400">{err}</p> : null}
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={submit} className="rounded bg-sandr-orange px-3 py-2 text-xs font-bold uppercase text-black disabled:opacity-60">Salva</button>
            <button type="button" onClick={() => setAdding(false)} className="rounded border border-white/[0.15] px-3 py-2 text-xs uppercase text-white">Annulla</button>
          </div>
        </div>
      )}
    </div>
  );
}

// LIVELLO 1 — Sport (tabella: "aggiungi" inserisce una riga).
function SportField({
  sports,
  value,
  onChange,
  onCreated,
}: {
  sports: SportRef[];
  value: string;
  onChange: (v: string) => void;
  onCreated: (s: SportRef) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    if (!name.trim()) return;
    setBusy(true);
    setErr(null);
    const res = await createSport({ name });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    onCreated(res.data);
    setAdding(false);
    setName('');
  }

  return (
    <div>
      <label className={labelCls}>Sport</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="">Seleziona…</option>
        {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      {!adding ? (
        <button type="button" className={addLinkCls} onClick={() => setAdding(true)}>+ Aggiungi sport</button>
      ) : (
        <div className="mt-2 rounded-lg border border-white/[0.08] bg-[#1C1C1C] p-3">
          <p className="mb-2 text-[10px] text-[#888888]">Gli sport sono righe in tabella (nessuna modifica di schema).</p>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome sport" className={`${inputCls} mb-2`} />
          {err ? <p className="mb-2 text-xs text-red-400">{err}</p> : null}
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={submit} className="rounded bg-sandr-orange px-3 py-2 text-xs font-bold uppercase text-black disabled:opacity-60">Salva</button>
            <button type="button" onClick={() => setAdding(false)} className="rounded border border-white/[0.15] px-3 py-2 text-xs uppercase text-white">Annulla</button>
          </div>
        </div>
      )}
    </div>
  );
}

// LIVELLO 2 — Tipo contenuto (enum). "Aggiungi" MODIFICA lo schema → warning.
function ContentTypeField({
  types,
  value,
  onChange,
  onCreated,
}: {
  types: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  onCreated: (v: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    const v = newType.trim().toLowerCase().replace(/\s+/g, '_');
    if (!v) return;
    if (!window.confirm('Aggiungere un tipo modifica la struttura del database (enum content_type). Continuare?')) return;
    setBusy(true);
    setErr(null);
    const res = await addContentTypeEnum(v);
    setBusy(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    onCreated(v);
    setAdding(false);
    setNewType('');
  }

  return (
    <div>
      <label className={labelCls}>Tipo contenuto</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="">Seleziona…</option>
        {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
      {!adding ? (
        <button type="button" className={addLinkCls} onClick={() => setAdding(true)}>+ Aggiungi tipo</button>
      ) : (
        <div className="mt-2 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-3">
          <p className="mb-2 text-[10px] text-amber-300">⚠ Modifica lo schema (enum). Operazione irreversibile.</p>
          <input value={newType} onChange={(e) => setNewType(e.target.value)} placeholder="es. documentario_breve" className={`${inputCls} mb-2`} />
          {err ? <p className="mb-2 text-xs text-red-400">{err}</p> : null}
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={submit} className="rounded bg-amber-400 px-3 py-2 text-xs font-bold uppercase text-black disabled:opacity-60">Aggiungi</button>
            <button type="button" onClick={() => setAdding(false)} className="rounded border border-white/[0.15] px-3 py-2 text-xs uppercase text-white">Annulla</button>
          </div>
        </div>
      )}
    </div>
  );
}

// LIVELLO 3 — Atleti (autocomplete da DB + aggiungi nuovo).
function AthleteField({
  athletes,
  sports,
  federations,
  selectedIds,
  onChange,
  onCreated,
}: {
  athletes: AthleteRef[];
  sports: SportRef[];
  federations: FederationRef[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onCreated: (a: AthleteRef) => void;
}) {
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [nation, setNation] = useState('');
  const [sportId, setSportId] = useState('');
  const [federationId, setFederationId] = useState('');
  const [busy, setBusy] = useState(false);

  const matches = query
    ? athletes
        .filter((a) => a.full_name.toLowerCase().includes(query.toLowerCase()) && !selectedIds.includes(a.id))
        .slice(0, 5)
    : [];
  const exactMatch = athletes.some((a) => a.full_name.toLowerCase() === query.trim().toLowerCase());

  async function addNew() {
    if (!query.trim()) return;
    setBusy(true);
    const res = await createAthlete({ full_name: query.trim(), nation, sport_id: sportId, federation_id: federationId });
    setBusy(false);
    if (res.ok) {
      onCreated(res.data);
      setQuery('');
      setAdding(false);
      setNation('');
      setSportId('');
      setFederationId('');
    }
  }

  const byId = (id: string) => athletes.find((a) => a.id === id);

  return (
    <div>
      <div className="relative">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca atleta per nome…" className={inputCls} />
        {matches.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#1C1C1C] shadow-lg">
            {matches.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange([...selectedIds, a.id]);
                    setQuery('');
                  }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm text-white hover:bg-white/[0.06]"
                >
                  <span>{a.full_name}</span>
                  <span className="text-[11px] uppercase tracking-wide text-[#888888]">{a.nation ?? ''}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Aggiungi nuovo se nessun match esatto */}
      {query.trim() && !exactMatch ? (
        !adding ? (
          <button type="button" className={addLinkCls} onClick={() => setAdding(true)}>
            + Aggiungi “{query.trim()}” come nuovo atleta
          </button>
        ) : (
          <div className="mt-2 rounded-lg border border-white/[0.08] bg-[#1C1C1C] p-3">
            <select value={nation} onChange={(e) => setNation(e.target.value)} className={`${inputCls} mb-2`}>
              <option value="">Nazione…</option>
              {NAZIONI.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={sportId} onChange={(e) => setSportId(e.target.value)} className={`${inputCls} mb-2`}>
              <option value="">Sport…</option>
              {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={federationId} onChange={(e) => setFederationId(e.target.value)} className={`${inputCls} mb-2`}>
              <option value="">Federazione…</option>
              {federations.map((f) => <option key={f.id} value={f.id}>{f.short_name ?? f.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button type="button" disabled={busy} onClick={addNew} className="rounded bg-sandr-orange px-3 py-2 text-xs font-bold uppercase text-black disabled:opacity-60">Crea atleta</button>
              <button type="button" onClick={() => setAdding(false)} className="rounded border border-white/[0.15] px-3 py-2 text-xs uppercase text-white">Annulla</button>
            </div>
          </div>
        )
      ) : null}

      {selectedIds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const a = byId(id);
            return (
              <span key={id} className="inline-flex items-center gap-2 rounded-full bg-[#F04E00]/15 px-3 py-1 text-xs font-semibold text-[#F04E00]">
                {a?.full_name ?? id}
                <button type="button" onClick={() => onChange(selectedIds.filter((x) => x !== id))} className="text-[#F04E00] hover:text-white" aria-label="Rimuovi">×</button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// LIVELLO 4 — Tag liberi con suggerimenti (previene duplicati roma/Roma/ROMA).
function TagField({
  suggestions,
  tags,
  onChange,
}: {
  suggestions: string[];
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [query, setQuery] = useState('');

  const matches = query
    ? suggestions
        .filter((s) => s.toLowerCase().includes(query.toLowerCase()) && !tags.includes(s))
        .slice(0, 6)
    : [];

  const add = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    // Evita duplicati case-insensitive: se esiste un suggerimento equivalente, usalo.
    const existing = suggestions.find((s) => s.toLowerCase() === t.toLowerCase());
    const value = existing ?? t;
    if (!tags.some((x) => x.toLowerCase() === value.toLowerCase())) {
      onChange([...tags, value]);
    }
    setQuery('');
  };

  return (
    <div>
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(query);
            }
          }}
          placeholder="Aggiungi tag e premi Invio…"
          className={inputCls}
        />
        {matches.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#1C1C1C] shadow-lg">
            {matches.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => add(s)} className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-white/[0.06]">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sandr-text">
              {t}
              <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="text-[#888888] hover:text-white" aria-label="Rimuovi">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
