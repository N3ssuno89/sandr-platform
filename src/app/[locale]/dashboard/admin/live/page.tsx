import { setRequestLocale } from 'next-intl/server';
import { getLiveVideos } from '@/lib/admin/actions';
import { requireAdminPage } from '@/lib/supabase/guard';
import { DemoPill } from '@/components/account/DemoPill';
import { cardCls, labelCls, inputCls } from '@/components/admin/styles';

export default async function AdminLivePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  await requireAdminPage(params.locale);

  // REAL: video live/programmati da Supabase.
  const live = await getLiveVideos();

  return (
    <div className="max-w-3xl">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Gestione Live</h1>

      {/* Dirette programmate — REAL */}
      <h2 className="mt-6 font-condensed text-xl font-bold uppercase text-white">Dirette programmate</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
        {live.length > 0 ? (
          live.map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-4 py-3 last:border-0">
              <span className="truncate text-sm text-white">{v.title}</span>
              <span className="flex items-center gap-2">
                <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-bold uppercase text-red-400">Live</span>
                <span className="text-xs text-[#888888]">{v.date}</span>
              </span>
            </div>
          ))
        ) : (
          <p className="px-4 py-10 text-center text-sm text-[#888888]">Nessuna diretta programmata</p>
        )}
      </div>

      {/* Crea diretta — MOCK: Cloudflare Live Input integration pending */}
      <div className="mt-8 flex items-center">
        <h2 className="font-condensed text-xl font-bold uppercase text-white">Crea diretta</h2>
        <DemoPill />
      </div>
      <div className={`mt-4 ${cardCls} space-y-4 opacity-80`}>
        <p className="text-sm text-[#888888]">L&apos;integrazione streaming live sarà attivata a breve.</p>
        <div>
          <label className={labelCls}>Titolo</label>
          <input disabled placeholder="Es. Finale BPT Elite — Live" className={`${inputCls} opacity-60`} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Federazione</label>
            <input disabled className={`${inputCls} opacity-60`} />
          </div>
          <div>
            <label className={labelCls}>Evento</label>
            <input disabled className={`${inputCls} opacity-60`} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Orario programmato</label>
          <input disabled type="datetime-local" className={`${inputCls} opacity-60`} />
        </div>
        <button type="button" disabled className="cursor-not-allowed rounded-lg bg-sandr-orange px-5 py-3 font-condensed font-bold uppercase tracking-wide text-black opacity-50">
          Crea diretta (prossimamente)
        </button>
      </div>
    </div>
  );
}
