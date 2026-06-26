import { setRequestLocale } from 'next-intl/server';
import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { DashboardContent } from '@/components/sections/DashboardContent';
import { BettingPartnerSection } from '@/components/sections/BettingPartnerSection';

// Homepage autenticata (stile DAZN post-login). In demo è pubblica: il
// middleware esenta /dashboard/home finché non c'è auth reale (CLAUDE.md).
// Carosello e filtro circuiti vivono in client component dedicati.
export default function AuthHomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <>
      <HeroCarousel />
      <DashboardContent />
      <BettingPartnerSection />
    </>
  );
}
