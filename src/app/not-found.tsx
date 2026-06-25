import { routing } from '@/i18n/routing';

// 404 globale per i path fuori dal segmento [locale].
// next-intl richiede comunque un root layout: qui forniamo html/body minimi.
export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body className="bg-sandr-black text-sandr-text">
        <main className="mx-auto max-w-6xl px-4 py-24">
          <h1 className="text-3xl">404</h1>
        </main>
      </body>
    </html>
  );
}
