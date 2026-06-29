import type { LegalDoc, LegalBlock } from '@/lib/legal/types';

// Evidenzia i segnaposto legali [DA COMPLETARE ...] / [TO BE COMPLETED ...] in
// ambra, così sono inequivocabili in attesa della compilazione legale.
function renderText(text: string) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, i) =>
    /^\[[^\]]+\]$/.test(part) ? (
      <mark
        key={i}
        className="rounded bg-amber-400/15 px-1 font-semibold text-amber-300"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === 'string') {
    return <p className="mt-3 text-[15px] leading-relaxed text-[#C0BDB8]">{renderText(block)}</p>;
  }
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-[#C0BDB8]">
      {block.list.map((item, i) => (
        <li key={i}>{renderText(item)}</li>
      ))}
    </ul>
  );
}

// Documento legale: testo lungo, prosa leggibile, tema scuro SANDR.
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-condensed text-4xl font-black uppercase leading-none text-white md:text-5xl">
        {doc.title}
      </h1>
      <p className="mt-3 text-[13px] uppercase tracking-wide text-[#888888]">{doc.updated}</p>

      {/* Avviso bozza tecnica per revisione legale */}
      <div className="mt-6 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-4">
        <p className="text-[13px] leading-relaxed text-amber-200/90">
          Bozza tecnica per revisione legale. Le parti evidenziate in ambra
          ([DA COMPLETARE …]) richiedono i dati specifici del titolare e vanno
          completate dal consulente legale prima della pubblicazione.
        </p>
      </div>

      <div className="mt-6">
        {doc.intro.map((p, i) => (
          <p key={i} className="mt-3 text-[15px] leading-relaxed text-[#C0BDB8]">
            {renderText(p)}
          </p>
        ))}
      </div>

      <div className="mt-8 space-y-8">
        {doc.sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-condensed text-xl font-bold uppercase tracking-wide text-white">
              {i + 1}. {s.heading}
            </h2>
            {s.blocks.map((b, j) => (
              <Block key={j} block={b} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
