import { setRequestLocale, getTranslations } from 'next-intl/server';
import { OpenComingSoon } from '@/components/open/OpenComingSoon';

// "Vicino a te" (volto OPEN): segnaposto finché la pagina dedicata non arriva.
export default async function OpenVicinoPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('Nav');
  return <OpenComingSoon title={t('near')} />;
}
