import { setRequestLocale } from 'next-intl/server';
import { TorneiCatalog } from '@/components/tornei/TorneiCatalog';

// Catalogo tornei del volto PRO. Dati SOLO da @/lib/data. Slug fisso /tornei
// (localizzazione path rimandata a PR dedicata).
export default function TorneiPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <TorneiCatalog face="pro" />;
}
