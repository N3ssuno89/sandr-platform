import { setRequestLocale } from 'next-intl/server';
import { VideoManager } from '@/components/admin/VideoManager';
import { getVideosForAdmin } from '@/lib/videos/actions';

// Dati sempre freschi: nessuna cache (la lista deve riflettere subito le scritture).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Lista video dal database Supabase (non più da Cloudflare meta).
export default async function AdminVideosPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const rows = await getVideosForAdmin();
  return <VideoManager videos={rows} />;
}
