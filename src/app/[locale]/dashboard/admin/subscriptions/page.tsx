import { setRequestLocale } from 'next-intl/server';
import { getSubscriptionsOverview } from '@/lib/admin/actions';
import { requireAdminPage } from '@/lib/supabase/guard';
import { DemoPill } from '@/components/account/DemoPill';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

// Spiegazioni MRR/Churn (placeholder finché non c'è l'integrazione Stripe).
const MRR_TIP =
  'Monthly Recurring Revenue — ricavo mensile ricorrente dagli abbonamenti attivi. Dato disponibile con l’integrazione dei pagamenti (Stripe).';
const CHURN_TIP =
  'Tasso di abbandono — percentuale di abbonati che disdicono in un periodo. Dato disponibile con l’integrazione dei pagamenti (Stripe).';

// REAL: subscriptions table. MOCK: MRR e Churn (Stripe pending).
export default async function AdminSubscriptionsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);

  const ov = await getSubscriptionsOverview();
  // MOCK: prezzo premium fittizio finché Stripe non è collegato.
  const mockPremiumPrice = 9.99;
  const mrr = (ov.active * mockPremiumPrice).toFixed(2);
  const churn = ov.total > 0 ? Math.round((ov.cancelled / ov.total) * 100) : 0;

  // Churn e MRR restano MOCK/proxy finché non c'è Stripe (DEMO + tooltip).
  const stats = [
    { label: 'Abbonati attivi', value: String(ov.active), demo: false, tip: null as string | null },
    { label: 'Churn', value: `${churn}%`, demo: true, tip: CHURN_TIP },
    { label: 'MRR (stima)', value: `${mrr} €`, demo: true, tip: MRR_TIP },
  ];

  return (
    <div>
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Abbonamenti</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-6">
            <p className="font-condensed text-[11px] uppercase tracking-wide text-[#888888]">
              {s.label}
              {s.tip ? <InfoTooltip text={s.tip} /> : null}
              {s.demo ? <DemoPill /> : null}
            </p>
            <p className="mt-2 font-condensed text-4xl font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-condensed text-xl font-bold uppercase text-white">Abbonamenti recenti</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
        {ov.recent.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-3 border-b border-white/[0.06] px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#888888]">
                <span>Piano</span>
                <span>Stato</span>
                <span>Rinnovo</span>
                <span>Creato</span>
              </div>
              {ov.recent.map((r) => (
                <div key={r.id} className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-3 border-b border-white/[0.06] px-4 py-3 text-sm last:border-0">
                  <span className="uppercase text-white">{r.plan}</span>
                  <span className={r.status === 'active' ? 'text-emerald-400' : 'text-[#888888]'}>{r.status}</span>
                  <span className="text-[#888888]">{r.periodEnd ? new Date(r.periodEnd).toLocaleDateString('it-IT') : '—'}</span>
                  <span className="text-[#888888]">{r.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-[#888888]">Nessun abbonamento</p>
        )}
      </div>
    </div>
  );
}
