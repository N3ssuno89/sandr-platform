'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';

type DeleteResult = { ok: true } | { ok: false; error: string };

// Pulsante elimina riutilizzabile: riceve la server action come prop (Next
// consente di passare server action ai client component). Conferma + refresh.
export function ConfirmDelete({
  action,
  id,
  label = 'Elimina',
  message = 'Eliminare definitivamente questo elemento?',
  redirectTo,
}: {
  action: (id: string) => Promise<DeleteResult>;
  id: string;
  label?: string;
  message?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (!window.confirm(message)) return;
    setBusy(true);
    const res = await action(id);
    setBusy(false);
    if (res.ok) {
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } else {
      window.alert(
        res.error === 'forbidden' || res.error === 'unauthorized'
          ? 'Solo un admin può eseguire questa operazione.'
          : `Errore: ${res.error}`,
      );
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="text-[12px] font-semibold uppercase text-red-400 hover:text-red-300 disabled:opacity-60"
    >
      {label}
    </button>
  );
}
