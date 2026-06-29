import { setRequestLocale } from 'next-intl/server';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { cookiesContent } from '@/lib/legal/cookies';

// Cookie Policy (bozza tecnica per revisione legale). Bilingue it/en.
export default function CookiePolicyPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const doc = params.locale === 'en' ? cookiesContent.en : cookiesContent.it;
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#141414]">
      <LegalDocument doc={doc} />
    </div>
  );
}
