import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';

// Libreria VOD (rotta autenticata). Placeholder: nessun fetch dati qui.
export default function VodPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('Vod');

  return (
    <>
      <PageHeader title={t('title')} />
      <EmptyState message={t('empty')} />
    </>
  );
}
