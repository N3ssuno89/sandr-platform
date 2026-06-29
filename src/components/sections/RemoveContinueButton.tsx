'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { removeFromContinueWatching } from '@/lib/tracking/actions';

// Bottone "X" per rimuovere un video da "Continua a guardare" (dismissed=true).
// Cerchio scuro, X bianca. Rimozione diretta (no conferma) + refresh.
export function RemoveContinueButton({ videoId, className = '' }: { videoId: string; className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    await removeFromContinueWatching(videoId);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label="Rimuovi da Continua a guardare"
      title="Rimuovi"
      className={`flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 disabled:opacity-50 ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </button>
  );
}
