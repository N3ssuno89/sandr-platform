// Tooltip "?" leggero (CSS group-hover, nessuno stato). Su mobile l'attributo
// title fa da fallback al tap. Sfondo scuro, testo leggibile.
export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative ml-1 inline-flex align-middle">
      <span
        title={text}
        className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-white/30 text-[9px] font-bold text-[#888888]"
        aria-label={text}
      >
        ?
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-60 -translate-x-1/2 rounded-lg border border-white/10 bg-[#0C0C0C] px-3 py-2 text-[11px] font-normal normal-case leading-snug tracking-normal text-[#C0BDB8] shadow-lg group-hover:block"
      >
        {text}
      </span>
    </span>
  );
}
