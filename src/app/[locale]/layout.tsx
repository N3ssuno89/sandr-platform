import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Archivo_Black, Archivo_Narrow, Barlow, Barlow_Condensed, DM_Sans } from 'next/font/google';
import { routing, type Locale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { SiteChrome } from '@/components/chrome/SiteChrome';
import { CookieBanner } from '@/components/legal/CookieBanner';
import '../globals.css';

// Font SANDR. Titoli grandi: Archivo Black (MAIUSCOLO). Titoli di sezione:
// Archivo Narrow 700 (MAIUSCOLO). Testo: Barlow 400/600/700. Barlow Condensed e
// DM Sans restano disponibili per la UI esistente. MAI Inter, Roboto o Arial.
const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
});
const archivoNarrow = Archivo_Narrow({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-archivo-narrow',
});
const barlow = Barlow({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow',
});
const barlowCondensed = Barlow_Condensed({
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
});
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  // metadataBase forza la risoluzione di canonical/OpenGraph sull'HTTPS reale.
  // Senza, Next usa il default http://localhost:3000 → URL http nei <meta> della
  // pagina statica = mixed content ("connessione non sicura").
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: '/',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${archivoBlack.variable} ${archivoNarrow.variable} ${barlow.variable} ${barlowCondensed.variable} ${dmSans.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          {/* Chrome a due volti (PRO/OPEN): header + footer scelti dal pathname. */}
          <SiteChrome>{children}</SiteChrome>
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
