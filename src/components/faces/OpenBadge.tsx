// Badge "OPEN": segnala il volto Open (tornei di club/Open, include Under 18).
export function OpenBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`rounded bg-sandr-orange px-1.5 py-0.5 font-condensed text-[10px] font-bold uppercase tracking-wide text-black ${className}`}
    >
      Open
    </span>
  );
}
