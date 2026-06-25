import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';

// Pannello admin (rotta autenticata, ruolo: admin).
// Il controllo di ruolo è applicato anche via Supabase RLS lato DB.
export default function DashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations('Dashboard');

  return <PageHeader title={t('title')} subtitle={t('subtitle')} />;
}
