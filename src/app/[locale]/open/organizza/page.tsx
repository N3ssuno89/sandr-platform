import { setRequestLocale, getTranslations } from 'next-intl/server';
import { OpenComingSoon } from '@/components/open/OpenComingSoon';

// "Organizza" (volto OPEN): segnaposto finché la pagina dedicata non arriva.
export default async function OpenOrganizzaPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Nav');
  return <OpenComingSoon title={t('organize')} />;
}
