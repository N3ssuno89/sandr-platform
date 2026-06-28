import { setRequestLocale } from 'next-intl/server';
import { DemoPill } from '@/components/account/DemoPill';

// AREA CRITICA (CLAUDE.md): Stripe (pagamenti) richiede review umana.
// MOCK: entire page is placeholder until Stripe integration

const cardCls = 'rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-6';
const labelCls = 'font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]';

export default function PaymentPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center">
        <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Metodo di pagamento</h1>
        <DemoPill />
      </div>

      {/* Nota: Stripe non ancora collegato */}
      <p className="mt-2 text-sm text-[#888888]">
        I pagamenti saranno gestiti tramite Stripe — in fase di attivazione
      </p>

      {/* Carta salvata — MOCK */}
      <div className={`mt-6 ${cardCls}`}>
        <p className={labelCls}>Carta salvata</p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <p className="font-condensed text-lg tracking-[2px] text-white">•••• •••• •••• 4242</p>
            <p className="mt-1 text-sm text-[#888888]">Scadenza 12/27</p>
          </div>
          <button
            type="button"
            disabled
            title="Disponibile a breve"
            className="cursor-not-allowed rounded-lg border border-white/[0.08] px-4 py-2 font-condensed text-sm font-bold uppercase tracking-wide text-[#888888] opacity-60"
          >
            Modifica
          </button>
        </div>
      </div>

      {/* Aggiungi metodo — MOCK (disabilitato) */}
      <button
        type="button"
        disabled
        title="Disponibile a breve"
        className="mt-4 w-full cursor-not-allowed rounded-lg border border-dashed border-white/[0.12] px-4 py-3 font-condensed text-sm font-bold uppercase tracking-wide text-[#888888] opacity-60"
      >
        Aggiungi metodo di pagamento
      </button>
    </div>
  );
}
