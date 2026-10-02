import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfiguredServer } from '@/lib/supabase/admin';
import { LandingContent } from '@/components/sections/LandingContent';
import { AuthHome } from '@/components/home/AuthHome';

// Home loggata (video in evidenza/righe) sempre fresca: nessuna cache.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// "/" è auth-aware: gli utenti LOGGATI vedono la home PRO completa (stile DAZN,
// stessa di /dashboard/home), gli anonimi la landing pulita. La lettura della
// sessione (cookie) rende la rotta dinamica.
async function getSessionUser() {
  if (!isSupabaseConfiguredServer()) return null;
  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const user = await getSessionUser();
  return user ? <AuthHome /> : <LandingContent />;
}
