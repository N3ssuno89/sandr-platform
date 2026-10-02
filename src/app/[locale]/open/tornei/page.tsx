import { setRequestLocale } from 'next-intl/server';
import { TorneiCatalog } from '@/components/tornei/TorneiCatalog';

// Catalogo tornei del volto OPEN (tornei di club/Open, include Under 18). Resta
// dentro il volto OPEN. Dati SOLO da @/lib/data. Slug fisso /open/tornei.
export default function OpenTorneiPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <TorneiCatalog face="open" />;
}
