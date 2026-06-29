import { setRequestLocale } from 'next-intl/server';
import { getAdminDashboard } from '@/lib/videos/actions';
import { FeaturedVideos } from '@/components/admin/FeaturedVideos';

// Dati sempre freschi: nessuna cache (titolo, "in evidenza" e recenti devono
// riflettere subito le scritture admin).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dashboard admin: dati video da SUPABASE (source of truth), non più dai meta
// Cloudflare. Title con fallback "(senza titolo)"; "in evidenza" = is_featured.
export default async function AdminHomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const { total, usersCount, activeSubscriptions, catalogHours, recent, videos } =
    await getAdminDashboard();

  // Tutti REALI da Supabase. Niente delta "+%" finché non c'è uno storico vero
  // (es. confronto col mese precedente): meglio nessun valore che uno finto.
  const stats = [
    { label: 'Video totali', value: String(total) },
    { label: 'Utenti registrati', value: String(usersCount) },
    { label: 'Abbonamenti attivi', value: String(activeSubscriptions) },
    { label: 'Ore di catalogo', value: String(catalogHours) },
  ];

  return (
    <div>
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Dashboard</h1>

      {/* Stat cards — dati reali da Supabase */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-6">
            <p className="font-condensed text-[11px] uppercase tracking-wide text-[#888888]">{s.label}</p>
            <p className="mt-2 font-condensed text-4xl font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Video in evidenza (is_featured su Supabase) */}
      <FeaturedVideos videos={videos} />

      {/* Video recenti */}
      <h2 className="mt-10 font-condensed text-xl font-bold uppercase text-white">Video recenti</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
        {recent.length > 0 ? (
          recent.map((v) => (
            <div key={v.id} className="flex items-center gap-4 border-b border-white/[0.06] px-4 py-3 last:border-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumb} alt="" className="h-10 w-16 rounded object-cover" />
              <span className="flex-1 truncate text-sm text-white">{v.title}</span>
              <span className="text-xs uppercase text-[#888888]">{v.ready ? 'Pronto' : 'Processing'}</span>
            </div>
          ))
        ) : (
          <p className="px-4 py-10 text-center text-sandr-muted">Nessun video caricato</p>
        )}
      </div>
    </div>
  );
}
