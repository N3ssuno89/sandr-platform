import { setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';

// Singolo VOD (rotta autenticata). Placeholder per il player HLS.
export default function VodDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);

  return (
    <>
      <PageHeader title="Replay" subtitle={`Video ${params.id}`} />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="aspect-video w-full rounded-lg border border-white/10 bg-sandr-surface" />
      </div>
    </>
  );
}
