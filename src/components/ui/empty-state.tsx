// Stato vuoto generico per liste senza contenuti (placeholder).
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <div className="rounded-lg border border-white/10 bg-sandr-surface p-10 text-center text-sandr-muted">
        {message}
      </div>
    </div>
  );
}
