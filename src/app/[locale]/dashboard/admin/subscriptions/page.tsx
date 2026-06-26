import { setRequestLocale } from 'next-intl/server';
import { AdminPlaceholder } from '@/components/admin/AdminPlaceholder';

export default function AdminSubscriptionsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <AdminPlaceholder title="Gestione Abbonamenti" />;
}
