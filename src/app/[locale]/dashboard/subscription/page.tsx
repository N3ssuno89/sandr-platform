import { setRequestLocale } from 'next-intl/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { DemoPill } from '@/components/account/DemoPill';

// AREA CRITICA (CLAUDE.md): Supabase Auth + Stripe (pagamenti).
// REAL: subscription status from Supabase. MOCK: billing details (Stripe pending)

const supaConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

type SubscriptionRow = {
  plan: string | null;
  status: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
};
type PpvRow = {
  id: string;
  amount: number | null;
  currency: string | null;
  valid_until: string | null;
  purchased_at: string | null;
  video_id: string | null;
  videos: { title: string | null } | null;
};

const cardCls = 'rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-6';
const labelCls = 'font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]';

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtMoney(amount: number | null, currency: string | null): string {
  if (amount == null) return '—';
  return `${amount.toFixed(2)} ${currency ?? 'EUR'}`;
}

export default async function SubscriptionPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  let subscription: SubscriptionRow | null = null;
  let purchases: PpvRow[] = [];

  // REAL: stato abbonamento e storico PPV dell'utente loggato (Supabase).
  if (supaConfigured) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const sb = supabase as unknown as SupabaseClient;
      const { data: sub } = await sb
        .from('subscriptions')
        .select('plan, status, current_period_end, cancel_at_period_end')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      subscription = (sub as SubscriptionRow | null) ?? null;

      const { data: ppv } = await sb
        .from('ppv_purchases')
        .select('id, amount, currency, valid_until, purchased_at, video_id, videos(title)')
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false });
      purchases = (ppv as PpvRow[] | null) ?? [];
    }
  }

  const isActive = subscription?.status === 'active';
  const planName = isActive ? (subscription?.plan === 'premium' ? 'PREMIUM' : 'FREE') : 'FREE';

  const plans = [
    { name: 'Free', desc: '1 match a settimana + highlights', cta: 'Piano attuale', href: '/pricing' },
    { name: 'Premium', desc: 'Tutto il live + Replay + stats', cta: 'Passa a Premium', href: '/pricing' },
    { name: 'PPV', desc: 'Acquisto singolo evento', cta: 'Vedi eventi', href: '/vod' },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Abbonamento</h1>

      {/* Stato abbonamento corrente — REAL (Supabase) */}
      <div className={`mt-6 ${cardCls}`}>
        <p className={labelCls}>Piano attuale</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="font-condensed text-3xl font-black text-white">{planName}</span>
          {isActive ? (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold uppercase text-emerald-400">
              Attivo
            </span>
          ) : null}
        </div>

        {isActive ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className={labelCls}>Rinnovo</p>
              <p className="mt-1 text-sm text-white">{fmtDate(subscription?.current_period_end ?? null)}</p>
            </div>
            <div>
              <p className={labelCls}>
                Prezzo <DemoPill />
              </p>
              {/* MOCK: prezzo non disponibile finché Stripe non è collegato */}
              <p className="mt-1 text-sm text-white">9,99 € / mese</p>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-[#C0BDB8]">Sei sul piano gratuito.</p>
            <Link
              href="/pricing"
              className="mt-4 inline-block rounded-lg bg-sandr-orange px-5 py-3 font-condensed font-bold uppercase tracking-wide text-black"
            >
              Passa a Premium
            </Link>
          </div>
        )}
      </div>

      {/* Cambia piano */}
      <h2 className="mt-10 font-condensed text-xl font-bold uppercase text-white">Cambia piano</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={cardCls}>
            <p className="font-condensed text-lg font-bold uppercase text-white">{p.name}</p>
            <p className="mt-1 min-h-[2.5rem] text-sm text-[#888888]">{p.desc}</p>
            <Link
              href={p.href}
              className="mt-4 block rounded-lg border border-sandr-orange px-4 py-2 text-center font-condensed text-sm font-bold uppercase tracking-wide text-sandr-orange hover:bg-sandr-orange hover:text-black"
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Storico acquisti PPV — REAL: ppv_purchases from Supabase */}
      <h2 className="mt-10 font-condensed text-xl font-bold uppercase text-white">Storico acquisti PPV</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
        {purchases.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 border-b border-white/[0.06] px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#888888]">
                <span>Evento</span>
                <span>Data acquisto</span>
                <span>Importo</span>
                <span>Valido fino a</span>
                <span>Stato</span>
              </div>
              {purchases.map((p) => {
                const valid = p.valid_until ? new Date(p.valid_until).getTime() > Date.now() : true;
                return (
                  <div
                    key={p.id}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 border-b border-white/[0.06] px-4 py-3 text-sm last:border-0"
                  >
                    <span className="truncate text-white">{p.videos?.title ?? p.video_id ?? 'Evento PPV'}</span>
                    <span className="text-[#C0BDB8]">{fmtDate(p.purchased_at)}</span>
                    <span className="text-[#C0BDB8]">{fmtMoney(p.amount, p.currency)}</span>
                    <span className="text-[#C0BDB8]">{fmtDate(p.valid_until)}</span>
                    <span className={valid ? 'text-emerald-400' : 'text-[#888888]'}>
                      {valid ? 'Valido' : 'Scaduto'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-[#888888]">Nessun acquisto Pay-Per-View</p>
        )}
      </div>
    </div>
  );
}
