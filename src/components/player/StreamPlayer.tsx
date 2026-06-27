'use client';

// Cloudflare Stream iframe embed player
// AREA CRITICA (CLAUDE.md) — richiede review umana prima della produzione.
// Usa solo l'account ID pubblico per l'embed; nessun token lato client.

import { useState } from 'react';
import { getEmbedUrl } from '@/lib/cloudflare-stream';

export function StreamPlayer({
  videoId,
  title,
  autoplay = false,
}: {
  videoId: string;
  title?: string;
  autoplay?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  // L'embed Cloudflare accetta i parametri come query string sull'URL iframe.
  const base = getEmbedUrl(videoId);
  const src = autoplay ? `${base}?autoplay=true&muted=true` : base;

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg bg-black"
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* Placeholder con logo SANDR finché l'iframe non è caricato */}
      {!loaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="SANDR" className="h-12 w-12 animate-pulse object-contain" />
        </div>
      ) : null}

      <iframe
        src={src}
        title={title ?? 'SANDR Stream'}
        onLoad={() => setLoaded(true)}
        style={{ border: 'none', width: '100%', height: '100%' }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
