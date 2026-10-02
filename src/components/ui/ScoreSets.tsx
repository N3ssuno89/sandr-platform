// Punteggio a set in box leggibili (es. "21-18  19-21  15-12"), invece di testo
// piatto. `score` è la stringa prodotta dall'adapter: coppie "a-b" separate da
// spazi. Il set vinto dal primo team è evidenziato con l'accento.
export function ScoreSets({ score }: { score: string }) {
  const sets = score
    .trim()
    .split(/\s+/)
    .map((s) => {
      const [a, b] = s.split('-').map((n) => parseInt(n, 10));
      return Number.isFinite(a) && Number.isFinite(b) ? { a, b } : null;
    })
    .filter((x): x is { a: number; b: number } => x !== null);

  if (sets.length === 0) return null;

  return (
    <div className="flex gap-1">
      {sets.map((s, i) => (
        <span
          key={i}
          className="inline-flex min-w-[2.75rem] items-center justify-center gap-0.5 rounded px-1.5 py-0.5 font-barlow text-xs font-bold tabular-nums"
          style={{ backgroundColor: 'var(--face-chip)' }}
        >
          <span className={s.a > s.b ? 'text-[color:var(--face-accent)]' : 'text-[color:var(--face-muted)]'}>{s.a}</span>
          <span className="text-[color:var(--face-muted)]">-</span>
          <span className={s.b > s.a ? 'text-[color:var(--face-accent)]' : 'text-[color:var(--face-muted)]'}>{s.b}</span>
        </span>
      ))}
    </div>
  );
}
