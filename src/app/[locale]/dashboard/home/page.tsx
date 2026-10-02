import { setRequestLocale } from 'next-intl/server';
import { AuthHome } from '@/components/home/AuthHome';

// Dati sempre freschi: nessuna cache (hero "in evidenza" e righe video devono
// riflettere subito le scritture admin).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Homepage autenticata (stile DAZN post-login). Contenuto condiviso con "/" per
// gli utenti loggati (vedi AuthHome).
export default function AuthHomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <AuthHome />;
}
