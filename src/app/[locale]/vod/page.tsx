import { setRequestLocale } from 'next-intl/server';
import { VodBoard } from '@/components/vod/VodBoard';

// Pagina libreria VOD/replay (rotta autenticata). La parte interattiva
// (filtri) vive nel client component VodBoard.
export default function VodPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <VodBoard />;
}
