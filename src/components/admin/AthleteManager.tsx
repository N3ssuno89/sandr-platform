'use client';

import { useMemo, useState } from 'react';
import { Link } from '@/i18n/routing';
import { deleteAthlete } from '@/lib/reference/actions';
import type { AthleteFull, FederationRef, SportRef } from '@/lib/reference/types';
import { ConfirmDelete } from '@/components/admin/ConfirmDelete';
import { orangeBtn, inputCls } from '@/components/admin/styles';

const COLS = 'grid grid-cols-[40px_2fr_1fr_1fr_1fr_70px_120px] items-center gap-3 px-4';

// Gestione atleti con ricerca (nome) + filtri (Nazione, Federazione, Sport).
// I dati arrivano già caricati lato server; il filtro è client-side e i criteri
// si combinano in AND. Mostra il conteggio dei risultati.
export function AthleteManager({
  athletes,
  federations,
  sports,
}: {
  athletes: AthleteFull[];
  federations: FederationRef[];
  sports: SportRef[];
}) {
  const [query, setQuery] = useState('');
  const [nation, setNation] = useState('');
  const [federationId, setFederationId] = useState('');
  const [sportId, setSportId] = useState('');

  const fedName = (id: string | null) => federations.find((f) => f.id === id)?.short_name ?? '—';
  const sportName = (id: string | null) => sports.find((s) => s.id === id)?.name ?? '—';

  // Nazioni distinte presenti tra gli atleti (per il dropdown Nazione).
  const nations = useMemo(
    () =>
      Array.from(new Set(athletes.map((a) => a.nation).filter((n): n is string => !!n))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [athletes],
  );

  // Filtri combinati in AND.
  const visible = useMemo(
    () =>
      athletes.filter((a) => {
        if (query && !a.full_name.toLowerCase().includes(query.toLowerCase())) return false;
        if (nation && a.nation !== nation) return false;
        if (federationId && a.federation_id !== federationId) return false;
        if (sportId && a.sport_id !== sportId) return false;
        return true;
      }),
    [athletes, query, nation, federationId, sportId],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Gestione Atleti</h1>
        <Link href="/dashboard/admin/athletes/new" className={orangeBtn}>Aggiungi atleta</Link>
      </div>

      {/* Ricerca + filtri */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca per nome…"
          className={inputCls}
        />
        <select value={nation} onChange={(e) => setNation(e.target.value)} className={inputCls}>
          <option value="">Tutte le nazioni</option>
          {nations.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <select value={federationId} onChange={(e) => setFederationId(e.target.value)} className={inputCls}>
          <option value="">Tutte le federazioni</option>
          {federations.map((f) => (
            <option key={f.id} value={f.id}>{f.short_name ?? f.name}</option>
          ))}
        </select>
        <select value={sportId} onChange={(e) => setSportId(e.target.value)} className={inputCls}>
          <option value="">Tutti gli sport</option>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-sm text-[#888888]">{visible.length} atleti</p>

      <div className="mt-3 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
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

          {visible.length > 0 ? (
            visible.map((a) => (
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
              Nessun atleta corrisponde ai filtri.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
