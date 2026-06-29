'use client';

import { useEffect, useState } from 'react';
import { VideoMetadataForm } from '@/components/admin/VideoMetadataForm';
import type { SportRef, FederationRef, AthleteRef } from '@/lib/reference/types';
import { orangeBtn, inputCls } from '@/components/admin/styles';

type CloudflareVideo = {
  uid: string;
  name: string;
  thumbnail: string;
  duration: number;
  ready: boolean;
  isLinked: boolean;
};

function fmtDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Flusso "Aggiungi video": i video sono caricati ESTERNAMENTE su Cloudflare
// Stream; qui si linka un UID esistente e si compilano i metadata su Supabase.
export function AddVideoFlow({
  sports,
  federations,
  athletes,
  existingTags,
}: {
  sports: SportRef[];
  federations: FederationRef[];
  athletes: AthleteRef[];
  existingTags: string[];
}) {
  const [videos, setVideos] = useState<CloudflareVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [manualUid, setManualUid] = useState('');
  const [selected, setSelected] = useState<{ uid: string; name: string } | null>(null);

  useEffect(() => {
    fetch('/api/stream/list-with-status')
      .then((r) => r.json())
      .then((d) => setVideos(d.videos ?? []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  // Step 2 — form metadata per il video selezionato.
  if (selected) {
    return (
      <div className="max-w-3xl">
        <button type="button" onClick={() => setSelected(null)} className="mb-4 text-sm font-semibold text-sandr-orange hover:text-white">
          ← Torna alla lista
        </button>
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Aggiungi video</h1>
        <p className="mt-1 text-sm text-[#888888]">UID Cloudflare: <span className="font-mono">{selected.uid}</span></p>
        <div className="mt-6">
          <VideoMetadataForm
            cloudflareUid={selected.uid}
            defaultValues={{
              id: '',
              cloudflareUid: selected.uid,
              title: selected.name,
              description: null,
              type: null,
              sportId: null,
              federationId: null,
              thumbnailCardUrl: null,
              thumbnailFeaturedUrl: null,
              accessLevel: 'free',
              isFeatured: false,
              isLive: false,
              athleteIds: [],
              tags: [],
            }}
            sports={sports}
            federations={federations}
            athletes={athletes}
            existingTags={existingTags}
          />
        </div>
      </div>
    );
  }

  // Step 1 — selezione del video da Cloudflare.
  return (
    <div className="max-w-4xl">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Aggiungi video</h1>
      <p className="mt-2 rounded-lg border border-[#F04E00]/30 bg-[#F04E00]/10 px-4 py-2 text-[13px] text-[#F04E00]">
        Carica prima il video su Cloudflare Stream, poi aggiungilo qui compilando i metadata.
      </p>

      {/* Sezione 1 — griglia video Cloudflare */}
      <h2 className="mt-8 font-condensed text-xl font-bold uppercase text-white">Seleziona video da Cloudflare</h2>
      {loading ? (
        <p className="mt-4 text-sm text-[#888888]">Caricamento…</p>
      ) : videos.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <div key={v.uid} className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumbnail} alt="" className="aspect-video w-full object-cover" />
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-white">{v.name}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="text-[#888888]">{fmtDuration(v.duration)}</span>
                  <span className={`rounded px-1.5 py-0.5 font-bold uppercase ${v.ready ? 'bg-emerald-500/15 text-emerald-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                    {v.ready ? 'Pronto' : 'Processing'}
                  </span>
                </div>
                {v.isLinked ? (
                  <button type="button" disabled className="mt-3 w-full cursor-not-allowed rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-bold uppercase text-[#888888] opacity-60">
                    Già aggiunto
                  </button>
                ) : (
                  <button type="button" onClick={() => setSelected({ uid: v.uid, name: v.name })} className="mt-3 w-full rounded-lg bg-sandr-orange px-3 py-2 text-xs font-bold uppercase text-black">
                    Seleziona
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[#888888]">
          Nessun video trovato su Cloudflare (o credenziali non configurate). Usa l&apos;inserimento manuale qui sotto.
        </p>
      )}

      {/* Sezione 2 — UID manuale */}
      <h2 className="mt-10 font-condensed text-xl font-bold uppercase text-white">Oppure incolla un UID</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={manualUid}
          onChange={(e) => setManualUid(e.target.value)}
          placeholder="Cloudflare Video UID"
          className={`${inputCls} flex-1`}
        />
        <button
          type="button"
          disabled={!manualUid.trim()}
          onClick={() => setSelected({ uid: manualUid.trim(), name: '' })}
          className={`${orangeBtn} disabled:opacity-50`}
        >
          Carica metadata
        </button>
      </div>
    </div>
  );
}
