import { setRequestLocale } from 'next-intl/server';
import { listVideos, getThumbnailUrl } from '@/lib/cloudflare-stream';

export default async function AdminHomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const videos = await listVideos();

  const stats = [
    { label: 'Video totali', value: videos.length > 0 ? String(videos.length) : '24', trend: '+12%' },
    { label: 'Utenti attivi', value: '1.247', trend: '+8%' },
    { label: 'Abbonamenti attivi', value: '89', trend: '+5%' },
    { label: 'Ore streammate', value: '4.320', trend: '+18%' },
  ];

  const recent = videos.slice(0, 5);

  return (
    <div>
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Dashboard</h1>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-6">
            <p className="font-condensed text-[11px] uppercase tracking-wide text-[#888888]">{s.label}</p>
            <p className="mt-2 font-condensed text-4xl font-black text-white">{s.value}</p>
            <p className="mt-1 text-xs font-bold text-emerald-400">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Video recenti */}
      <h2 className="mt-10 font-condensed text-xl font-bold uppercase text-white">Video recenti</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
        {recent.length > 0 ? (
          recent.map((v) => (
            <div key={v.uid} className="flex items-center gap-4 border-b border-white/[0.06] px-4 py-3 last:border-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getThumbnailUrl(v.uid)} alt="" className="h-10 w-16 rounded object-cover" />
              <span className="flex-1 truncate text-sm text-white">{v.meta?.name ?? 'Video'}</span>
              <span className="text-xs uppercase text-[#888888]">{v.status?.state ?? '—'}</span>
            </div>
          ))
        ) : (
          <p className="px-4 py-10 text-center text-sandr-muted">Nessun video caricato</p>
        )}
      </div>
    </div>
  );
}
