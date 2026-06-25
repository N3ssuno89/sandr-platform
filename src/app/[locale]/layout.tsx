import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Archivo_Black, Barlow_Condensed, DM_Sans } from 'next/font/google';
import { routing, type Locale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import '../globals.css';

// Font SANDR (vedi CLAUDE.md): Archivo Black / Barlow Condensed per le headline,
// DM Sans per il body. MAI Inter, Roboto o Arial.
const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
});
const barlowCondensed = Barlow_Condensed({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
});
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
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
        className={`${archivoBlack.variable} ${barlowCondensed.variable} ${dmSans.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
