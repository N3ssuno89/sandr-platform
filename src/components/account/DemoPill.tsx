// Pillola "DEMO": segnala visivamente le sezioni con dati MOCK (non reali)
// durante lo sviluppo. bg rgba(240,78,0,.15), testo #F04E00, 9px.
export function DemoPill() {
  return (
    <span className="ml-2 inline-block rounded bg-[#F04E00]/15 px-1.5 py-0.5 align-middle text-[9px] font-bold uppercase tracking-wide text-[#F04E00]">
      Demo
    </span>
  );
}
