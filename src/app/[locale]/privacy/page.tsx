import { setRequestLocale } from 'next-intl/server';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { privacyContent } from '@/lib/legal/privacy';

// Informativa privacy GDPR (bozza tecnica per revisione legale). Bilingue it/en.
export default function PrivacyPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const doc = params.locale === 'en' ? privacyContent.en : privacyContent.it;
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#141414]">
      <LegalDocument doc={doc} />
    </div>
  );
}
