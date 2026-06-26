import { setRequestLocale } from 'next-intl/server';
import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { DashboardContent } from '@/components/sections/DashboardContent';
import { BettingPartnerSection } from '@/components/sections/BettingPartnerSection';
import { listVideos, getThumbnailUrl, type StreamVideo } from '@/lib/cloudflare-stream';
import type { CircuitTag, ContentItem, ContentType, SportTag } from '@/types/tags';

// Mappa il tipo (etichetta admin in italiano) sul ContentType interno.
function parseType(raw?: string): ContentType {
  switch (raw) {
    case 'Live Recording':
      return 'live';
    case 'Replay':
      return 'replay';
    case 'Intervista':
      return 'interview';
    case 'Highlights':
      return 'highlights';
    case 'Dietro le quinte':
      return 'behind-the-scenes';
    default:
      return 'replay';
  }
}

// Formatta i secondi in "H:MM:SS" (o "M:SS" se sotto l'ora).
function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Converte un video Cloudflare Stream nel formato ContentItem usato dalle righe.
// I metadati custom (circuit/type/sport/access) vivono in meta su Cloudflare.
function toContentItem(video: StreamVideo): ContentItem {
  const meta = video.meta as Record<string, string | undefined>;
  const circuit = (meta.circuit as CircuitTag) ?? 'BPT';
  const type = parseType(meta.type);
  const sport = (meta.sport as SportTag) ?? 'Beach Volley';
  const featured = meta.featured === 'true';

  return {
    id: video.uid,
    title: meta.name ?? 'Video',
    teams: meta.athletes || undefined,
    circuit,
    sport,
    type,
    nations: [],
    thumbnail: meta.thumbnailCard || getThumbnailUrl(video.uid),
    thumbnailFeatured: meta.thumbnailFeatured || undefined,
    duration: formatDuration(video.duration),
    isPremium: meta.access === 'premium',
    date: formatDate(video.created),
    // 'featured' nei tag così il filtro hero è un semplice tags.includes.
    tags: featured ? [circuit, type, sport, 'featured'] : [circuit, type, sport],
  };
}

// Homepage autenticata (stile DAZN post-login). In demo è pubblica: il
// middleware esenta /dashboard/home finché non c'è auth reale (CLAUDE.md).
// Carosello e filtro circuiti vivono in client component dedicati.
export default async function AuthHomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  // Video reali da Cloudflare Stream (build-safe: [] se non configurato).
  const videos = await listVideos();
  const realVideos = videos.length > 0 ? videos.map(toContentItem) : undefined;

  // Video in evidenza per l'hero (meta.featured === 'true' → tag 'featured').
  const featuredVideos = realVideos?.filter((v) => v.tags.includes('featured'));

  return (
    <>
      <HeroCarousel featuredVideos={featuredVideos} />
      <DashboardContent realVideos={realVideos} />
      <BettingPartnerSection />
    </>
  );
}
