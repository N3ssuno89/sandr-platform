import { setRequestLocale } from 'next-intl/server';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { termsContent } from '@/lib/legal/terms';

// Termini di Servizio (bozza tecnica per revisione legale). Bilingue it/en.
export default function TermsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const doc = params.locale === 'en' ? termsContent.en : termsContent.it;
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#141414]">
      <LegalDocument doc={doc} />
    </div>
  );
}
