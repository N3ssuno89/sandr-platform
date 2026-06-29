'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { setVideoFeatured } from '@/lib/videos/actions';
import type { AdminFeaturedVideo } from '@/lib/videos/types';

// Sezione "Video in evidenza" del pannello admin. Persiste is_featured su
// SUPABASE (source of truth) via la server action setVideoFeatured, che a sua
// volta invalida la cache di home (hero) e dashboard. router.refresh() ricarica
// i dati lato server così la lista resta coerente col DB.
export function FeaturedVideos({ videos }: { videos: AdminFeaturedVideo[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const featured = videos.filter((v) => v.featured).slice(0, 3);
  const selectable = videos.filter((v) => !v.featured);

  async function toggle(id: string, value: boolean) {
    setBusyId(id);
    setError(null);
    const res = await setVideoFeatured(id, value);
    setBusyId(null);
    setModalOpen(false);
    if (!res.ok) {
      setError(
        res.error === 'forbidden' || res.error === 'unauthorized'
          ? 'Solo un admin può modificare i video in evidenza.'
          : res.error === 'not-configured'
            ? 'Supabase non configurato in questo ambiente.'
            : `Errore: ${res.error}`,
      );
      return;
    }
    router.refresh();
  }

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

      {error ? (
        <p className="mt-3 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      ) : null}

      <div className="mt-4 space-y-3">
        {featured.length > 0 ? (
          featured.map((v) => (
            <div
              key={v.id}
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
                disabled={busyId === v.id}
                onClick={() => toggle(v.id, false)}
                className="text-xs font-semibold uppercase text-[#888888] hover:text-red-400 disabled:opacity-60"
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
                    key={v.id}
                    type="button"
                    disabled={busyId === v.id}
                    onClick={() => toggle(v.id, true)}
                    className="flex w-full items-center gap-3 rounded-lg border border-white/[0.06] bg-[#1C1C1C] px-3 py-2 text-left hover:border-sandr-orange/50 disabled:opacity-60"
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
