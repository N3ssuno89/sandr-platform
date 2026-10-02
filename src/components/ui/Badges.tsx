// Badge riutilizzabili e coerenti in tutto il sito.

// "● IN DIRETTA" con puntino pulsante.
export function LiveBadge({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded bg-red-600 font-barlow font-bold uppercase tracking-wide text-white ${
        small ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
      }`}
    >
      <span className={`live-dot rounded-full bg-white ${small ? 'h-1 w-1' : 'h-1.5 w-1.5'}`} />
      {label}
    </span>
  );
}

// Badge livello di accesso (free/premium/ppv) con colore coerente.
export function AccessBadge({
  access,
  label,
  small = false,
}: {
  access: 'free' | 'premium' | 'ppv';
  label: string;
  small?: boolean;
}) {
  const bg =
    access === 'free' ? 'bg-emerald-500 text-black' : access === 'ppv' ? 'bg-amber-400 text-black' : 'bg-[color:var(--face-accent)] text-white';
  return (
    <span
      className={`rounded font-barlow font-bold uppercase tracking-wide ${bg} ${
        small ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
      }`}
    >
      {label}
    </span>
  );
}
