import { setRequestLocale } from 'next-intl/server';
import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { DashboardContent } from '@/components/sections/DashboardContent';
import { getVideosForDisplay } from '@/lib/videos/actions';

// Homepage autenticata (stile DAZN post-login). I video arrivano da SUPABASE
// (source of truth per tag/circuito/tipo), non più dai meta Cloudflare.
// Build-safe: lista vuota → DashboardContent usa il mock (dev mode).
export default async function AuthHomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const videos = await getVideosForDisplay();
  const realVideos = videos.length > 0 ? videos : undefined;

  // Video in evidenza per l'hero (tag 'featured' = is_featured nel DB).
  const featured = realVideos?.filter((v) => v.tags.includes('featured')) ?? [];
  const featuredVideos = featured.length > 0 ? featured : undefined;

  // Il betting NON sta nella home post-login: vive solo nella landing.
  return (
    <>
      <HeroCarousel featuredVideos={featuredVideos} />
      <DashboardContent realVideos={realVideos} />
    </>
  );
}
