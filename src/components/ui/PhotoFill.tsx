'use client';

import { useState } from 'react';

// Iniziali (max 2) dal nome, per il placeholder senza foto.
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Riempe il contenitore relativo (absolute inset-0) con la foto atleta presa da
// Supabase Storage (photo_url, URL pubblico completo). Se la foto manca o va in
// errore, mostra un placeholder scuro con le iniziali.
// Crop dall'ALTO (object-top): le foto di persone vengono ritagliate dal basso,
// così la testa non viene mai tagliata (diverso dall'hero video, crop centrato).
export function PhotoFill({ src, name }: { src?: string | null; name: string }) {
  const [errored, setErrored] = useState(false);
  const show = !!src && !errored;

  if (show) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src as string}
        alt={name}
        onError={() => setErrored(true)}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#242424] to-[#141414]">
      <span className="font-condensed text-3xl font-black uppercase tracking-wide text-[#555555]">
        {initials(name)}
      </span>
    </div>
  );
}
