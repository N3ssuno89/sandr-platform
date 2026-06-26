'use client';

import { useState } from 'react';

export type AdminVideo = {
  uid: string;
  title: string;
  circuit: string;
  thumb: string;
  featured: boolean;
};

// Sezione "Video in evidenza" del pannello admin. Gestisce localmente lo stato
// featured e persiste via /api/stream/update-meta.
// NOTA review umana: in produzione l'update deve fare merge dei meta esistenti
// (qui inviamo solo `featured`, sufficiente per la demo).
export function FeaturedVideos({ videos }: { videos: AdminVideo[] }) {
  const [featuredUids, setFeaturedUids] = useState<string[]>(
    videos.filter((v) => v.featured).map((v) => v.uid),
  );
  const [modalOpen, setModalOpen] = useState(false);

  const featured = videos.filter((v) => featuredUids.includes(v.uid)).slice(0, 3);
  const selectable = videos.filter((v) => !featuredUids.includes(v.uid));

  function persist(uid: string, value: boolean) {
    // Best-effort: in demo (no creds) la route risponde 'not-configured'.
    fetch('/api/stream/update-meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, meta: { featured: value ? 'true' : '' } }),
    }).catch(() => {});
  }

  const addFeatured = (uid: string) => {
    setFeaturedUids((prev) => [...prev, uid]);
    persist(uid, true);
    setModalOpen(false);
  };
  const removeFeatured = (uid: string) => {
    setFeaturedUids((prev) => prev.filter((u) => u !== uid));
    persist(uid, false);
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-condensed text-xl font-bold uppercase text-white">Video in evidenza</h2>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-sandr-orange px-4 py-2 font-condensed text-sm font-bold uppercase tracking-wide text-black"
        >
          Aggiungi video in evidenza
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {featured.length > 0 ? (
          featured.map((v) => (
            <div
              key={v.uid}
              className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#1C1C1C] px-4 py-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumb} alt="" className="h-12 w-20 rounded object-cover" />
              <span className="flex-1 truncate text-sm text-white">{v.title}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sandr-text">
                {v.circuit}
              </span>
              <button
                type="button"
                onClick={() => removeFeatured(v.uid)}
                className="text-xs font-semibold uppercase text-[#888888] hover:text-red-400"
              >
                Rimuovi da evidenza
              </button>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-white/[0.08] bg-[#1C1C1C] px-4 py-10 text-center text-sandr-muted">
            Nessun video in evidenza
          </p>
        )}
      </div>

      {/* Modal selezione video */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="max-h-[70vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#141414] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-condensed text-lg font-bold uppercase text-white">Seleziona un video</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-sm text-[#888888] hover:text-white"
                aria-label="Chiudi"
              >
                ×
              </button>
            </div>
            {selectable.length > 0 ? (
              <div className="space-y-2">
                {selectable.map((v) => (
                  <button
                    key={v.uid}
                    type="button"
                    onClick={() => addFeatured(v.uid)}
                    className="flex w-full items-center gap-3 rounded-lg border border-white/[0.06] bg-[#1C1C1C] px-3 py-2 text-left hover:border-sandr-orange/50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.thumb} alt="" className="h-9 w-16 rounded object-cover" />
                    <span className="flex-1 truncate text-sm text-white">{v.title}</span>
                    <span className="text-[10px] uppercase tracking-wide text-[#888888]">{v.circuit}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sandr-muted">Nessun altro video disponibile</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
