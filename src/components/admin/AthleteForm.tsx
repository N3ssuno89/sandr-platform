'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { createAthlete, updateAthlete, deleteAthlete } from '@/lib/reference/actions';
import type { SportRef, FederationRef, AthleteFull } from '@/lib/reference/types';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { cardCls, labelCls, inputCls, orangeBtn, redBtn } from '@/components/admin/styles';

const NAZIONI = ['Italia', 'USA', 'Norvegia', 'Brasile', 'Germania', 'Francia', 'Olanda', 'Russia', 'Australia', 'Spagna', 'Polonia'];

export function AthleteForm({
  athlete,
  sports,
  federations,
}: {
  athlete?: AthleteFull;
  sports: SportRef[];
  federations: FederationRef[];
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(athlete?.full_name ?? '');
  const [nation, setNation] = useState(athlete?.nation ?? '');
  const [nationCode, setNationCode] = useState(athlete?.nation_code ?? '');
  const [sportId, setSportId] = useState(athlete?.sport_id ?? '');
  const [federationId, setFederationId] = useState(athlete?.federation_id ?? '');
  const [bio, setBio] = useState(athlete?.bio ?? '');
  const [ranking, setRanking] = useState(athlete?.ranking?.toString() ?? '');
  const [seasonPoints, setSeasonPoints] = useState(athlete?.season_points?.toString() ?? '');
  const [photoUrl, setPhotoUrl] = useState(athlete?.photo_url ?? '');
  const [isFeatured, setIsFeatured] = useState(athlete?.is_featured ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mapErr(e: string) {
    return e === 'forbidden' || e === 'unauthorized'
      ? 'Solo un admin può salvare gli atleti.'
      : e === 'not-configured'
        ? 'Supabase non configurato in questo ambiente.'
        : `Errore: ${e}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const input = {
      full_name: fullName,
      nation: nation || undefined,
      nation_code: nationCode || undefined,
      photo_url: photoUrl || undefined,
      sport_id: sportId || undefined,
      federation_id: federationId || undefined,
      bio: bio || undefined,
      ranking: ranking ? Number(ranking) : undefined,
      season_points: seasonPoints ? Number(seasonPoints) : undefined,
      is_featured: isFeatured,
    };
    const res = athlete ? await updateAthlete(athlete.id, input) : await createAthlete(input);
    if (!res.ok) {
      setError(mapErr(res.error));
      setSaving(false);
      return;
    }
    router.push('/dashboard/admin/athletes');
    router.refresh();
  }

  async function handleDelete() {
    if (!athlete) return;
    if (!window.confirm('Eliminare definitivamente questo atleta?')) return;
    const res = await deleteAthlete(athlete.id);
    if (res.ok) {
      router.push('/dashboard/admin/athletes');
      router.refresh();
    } else {
      setError(mapErr(res.error));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className={`${cardCls} space-y-4`}>
        <ImageUpload label="Foto" bucket="athlete-photos" value={photoUrl} onUploaded={setPhotoUrl} round />

        <div>
          <label className={labelCls}>Nome completo</label>
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Nazione</label>
            <select value={nation} onChange={(e) => setNation(e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {NAZIONI.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Codice nazione</label>
            <input value={nationCode} onChange={(e) => setNationCode(e.target.value)} maxLength={3} placeholder="IT, USA, NO" className={inputCls} />
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
            <label className={labelCls}>Federazione</label>
            <select value={federationId} onChange={(e) => setFederationId(e.target.value)} className={inputCls}>
              <option value="">Seleziona…</option>
              {federations.map((f) => <option key={f.id} value={f.id}>{f.short_name ?? f.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Bio</label>
          <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Ranking</label>
            <input type="number" value={ranking} onChange={(e) => setRanking(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Punti stagione</label>
            <input type="number" value={seasonPoints} onChange={(e) => setSeasonPoints(e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* In evidenza: appare nella riga "Atleti in evidenza" (home + landing) */}
        <div>
          <label className={labelCls}>In evidenza</label>
          <button
            type="button"
            onClick={() => setIsFeatured((v) => !v)}
            className={`rounded-full border px-5 py-2 font-condensed text-xs font-bold uppercase tracking-wide transition ${
              isFeatured
                ? 'border-[#F04E00]/40 bg-[#F04E00]/15 text-[#F04E00]'
                : 'border-white/[0.08] bg-[#1C1C1C] text-[#888888]'
            }`}
          >
            {isFeatured ? 'In evidenza' : 'Metti in evidenza'}
          </button>
        </div>
      </div>

      {error ? <p className="mt-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="submit" disabled={saving} className={orangeBtn}>
          {saving ? 'Salvataggio…' : athlete ? 'Salva modifiche' : 'Crea atleta'}
        </button>
        {athlete ? (
          <button type="button" onClick={handleDelete} className={redBtn}>Elimina atleta</button>
        ) : null}
      </div>
    </form>
  );
}
