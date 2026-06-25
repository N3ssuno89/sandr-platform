import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';

// Pannello broadcaster (rotta autenticata, ruolo: broadcaster).
// Il controllo di ruolo è applicato anche via Supabase RLS lato DB.
export default function BroadcastPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations('Broadcast');

  return <PageHeader title={t('title')} subtitle={t('subtitle')} />;
}
